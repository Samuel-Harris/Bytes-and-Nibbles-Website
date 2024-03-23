import { FirebaseApp, initializeApp } from "firebase/app";
import {
  DocumentData,
  Firestore,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
  getDoc,
  getDocs,
  getFirestore,
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

export default class FirebaseService {
  private app: FirebaseApp;
  private firestore: Firestore;
  private storage: FirebaseStorage;
  private bytes: Byte[];
  private nibbles: Nibble[];

  private constructor() {
    this.app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.app);
    this.storage = getStorage(this.app);
    this.bytes = [];
    this.nibbles = [];
  }

  public static async getInstance(): Promise<FirebaseService> {
    const instance = new FirebaseService();
    await instance.fetchBytes();
    await instance.fetchNibbles();

    return Promise.resolve(instance);
  }

  private async fetchBytes(): Promise<void> {
    const q: Query<DocumentData, DocumentData> = query(
      collection(this.firestore, bytesCollection.name),
      where(bytesCollection.isPublishedField, "==", true)
    );

    const queryResults: DocumentData[] = await getDocs(q).then(
      (response: QuerySnapshot<DocumentData, DocumentData>) =>
        response.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data()
        )
    );

    this.bytes = await Promise.all(
      queryResults.map(async (byteResponse: DocumentData): Promise<Byte> => {
        const byte: Byte = {
          ...byteResponse,
          series: (await getDoc(byteResponse.series)).data() as Series,
          publishDate: byteResponse.publishDate.toDate(),
          lastModifiedDate: byteResponse.lastModifiedDate.toDate(),
          thumbnail: await this.getImage(byteResponse.thumbnail),
          coverPhoto: await this.getImage(byteResponse.coverPhoto),
        } as Byte;

        for (const section of byte.sections) {
          for (const bodyComponent of section.body) {
            if (bodyComponent.type === "captionedImage") {
              bodyComponent.value.image = await this.getImage(
                bodyComponent.value.image
              );
            }
          }
        }

        return byte;
      })
    );
  }

  private async fetchNibbles(): Promise<void> {
    const q: Query<DocumentData, DocumentData> = query(
      collection(this.firestore, nibblesCollection.name),
      where(nibblesCollection.isPublishedField, "==", true)
    );

    const queryResults: DocumentData[] = await getDocs(q).then(
      (response: QuerySnapshot<DocumentData, DocumentData>) =>
        response.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data()
        )
    );

    this.nibbles = await Promise.all(
      queryResults.map(
        async (nibbleResponse: DocumentData): Promise<Nibble> => {
          // convert received nibble into nibble object
          const nibble: Nibble = {
            ...nibbleResponse,
            publishDate: nibbleResponse.publishDate.toDate(),
            lastModifiedDate: nibbleResponse.lastModifiedDate.toDate(),
            thumbnail: await this.getImage(nibbleResponse.thumbnail),
            coverPhoto: await this.getImage(nibbleResponse.coverPhoto),
          } as Nibble;

          return nibble;
        }
      )
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
      })
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
      })
    );
  }

  public getByte(slug: string): Byte | undefined {
    return this.bytes.find((byte: Byte) => byte.slug === slug);
  }

  public getNibble(slug: string): Nibble | undefined {
    return this.nibbles.find((nibble: Nibble) => nibble.slug === slug);
  }

  public getByteSlugs(): string[] {
    return this.bytes.map((byte: Byte) => byte.slug);
  }

  public getNibbleSlugs(): string[] {
    return this.nibbles.map((nibble: Nibble) => nibble.slug);
  }

  private getImage(path: string): Promise<string> {
    const storageRef: StorageReference = ref(this.storage, path);

    return getDownloadURL(storageRef);
  }
}
