import { FirebaseApp, initializeApp } from "firebase/app";
import {
  DocumentData,
  Firestore,
  Query,
  QueryDocumentSnapshot,
  collection,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  FirebaseStorage,
  StorageReference,
  getDownloadURL,
  getStorage,
  ref,
} from "firebase/storage";
import { bytesCollection, nibblesCollection } from "./collectionConstants";
import { firebaseConfig } from "./firebaseConstants";
import { Byte, ByteOverview, Series } from "./Byte";
import { Nibble, NibbleOverview } from "./Nibble";

// Define generic types for content to reduce duplication
interface BaseContent {
  slug: string;
  title: string;
  thumbnail: string;
  publishDate: Date;
}

export default class FirebaseService {
  private app: FirebaseApp;
  private firestore: Firestore;
  private storage: FirebaseStorage;
  private bytes: Byte[] = [];
  private nibbles: Nibble[] = [];
  private static instance: FirebaseService | null = null;
  private isInitialized = false;

  private constructor() {
    this.app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  public static async getInstance(): Promise<FirebaseService> {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }

    if (!FirebaseService.instance.isInitialized) {
      await FirebaseService.instance.initialize();
    }

    return FirebaseService.instance;
  }

  private async initialize(): Promise<void> {
    await Promise.all([this.fetchBytes(), this.fetchNibbles()]);
    this.isInitialized = true;
  }

  private async fetchBytes(): Promise<void> {
    const q: Query<DocumentData, DocumentData> =
      this.createPublishedContentQuery(bytesCollection.name);
    const queryResults: DocumentData[] = await this.executeQuery(q);

    this.bytes = await Promise.all(
      queryResults.map(async (byteResponse: DocumentData): Promise<Byte> => {
        const byte = {
          ...byteResponse,
          series: (await getDoc(byteResponse.series)).data() as Series,
          publishDate: byteResponse.publishDate.toDate(),
          lastModifiedDate: byteResponse.lastModifiedDate.toDate(),
          thumbnail: await this.getImage(byteResponse.thumbnail),
          coverPhoto: await this.getImage(byteResponse.coverPhoto),
        } as Byte;

        await this.processByteImages(byte);
        return byte;
      }),
    );
  }

  private async processByteImages(byte: Byte): Promise<void> {
    for (const section of byte.sections) {
      for (const component of section.body) {
        if (component.type === "subsection") {
          for (const subComponent of component.value.body) {
            if (subComponent.type === "captionedImage") {
              subComponent.value.image = await this.getImage(
                subComponent.value.image,
              );
            }
          }
        } else if (component.type === "captionedImage") {
          component.value.image = await this.getImage(component.value.image);
        }
      }
    }
  }

  private async fetchNibbles(): Promise<void> {
    const q = this.createPublishedContentQuery(nibblesCollection.name);
    const queryResults = await this.executeQuery(q);

    this.nibbles = await Promise.all(
      queryResults.map(
        async (nibbleResponse): Promise<Nibble> =>
          ({
            ...nibbleResponse,
            publishDate: nibbleResponse.publishDate.toDate(),
            lastModifiedDate: nibbleResponse.lastModifiedDate.toDate(),
            thumbnail: await this.getImage(nibbleResponse.thumbnail),
            coverPhoto: await this.getImage(nibbleResponse.coverPhoto),
          }) as Nibble,
      ),
    );
  }

  private createPublishedContentQuery(
    collectionName: string,
  ): Query<DocumentData> {
    const isByte: boolean = collectionName === bytesCollection.name;

    return query(
      collection(this.firestore, collectionName),
      where(
        isByte
          ? bytesCollection.isPublishedField
          : nibblesCollection.isPublishedField,
        "==",
        true,
      ),
      orderBy(
        isByte
          ? bytesCollection.publishDateField
          : nibblesCollection.publishDateField,
        "desc",
      ),
    );
  }

  private async executeQuery(q: Query<DocumentData>): Promise<DocumentData[]> {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) =>
      doc.data(),
    );
  }

  public listBytes(): ByteOverview[] {
    return this.bytes.map(
      (byte: Byte): ByteOverview => ({
        title: byte.title,
        subtitle: byte.subtitle,
        series: byte.series,
        thumbnail: byte.thumbnail,
        publishDate: byte.publishDate,
        slug: byte.slug,
      }),
    );
  }

  public listNibbles(): NibbleOverview[] {
    return this.nibbles.map(
      (nibble: Nibble): NibbleOverview => ({
        title: nibble.title,
        thumbnail: nibble.thumbnail,
        coverPhoto: nibble.coverPhoto,
        slug: nibble.slug,
        publishDate: nibble.publishDate,
        timeTakenMinutes: nibble.timeTakenMinutes,
      }),
    );
  }

  public getByte(slug: string): Byte | undefined {
    return this.findContentBySlug(this.bytes, slug);
  }

  public getNibble(slug: string): Nibble | undefined {
    return this.findContentBySlug(this.nibbles, slug);
  }

  private findContentBySlug<T extends BaseContent>(
    items: T[],
    slug: string,
  ): T | undefined {
    return items.find((item) => item.slug === slug);
  }

  public getByteSlugs(): string[] {
    return this.getContentSlugs(this.bytes);
  }

  public getNibbleSlugs(): string[] {
    return this.getContentSlugs(this.nibbles);
  }

  private getContentSlugs<T extends BaseContent>(items: T[]): string[] {
    return items.map((item) => item.slug);
  }

  private getImage(path: string): Promise<string> {
    const storageRef: StorageReference = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }
}
