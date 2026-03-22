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
import {
  BaseContentSchema,
  ByteOverviewType,
  ByteSeriesType,
  ByteSchema,
  NibbleOverviewType,
  NibbleSchema,
  SectionBodyElementSchema,
  SubsectionBodyElementSchema,
  SubsubsectionBodyElementSchema,
  firebaseConfig,
} from "@bytes-and-nibbles/shared";

export default class FirebaseService {
  private app: FirebaseApp;
  private firestore: Firestore;
  private storage: FirebaseStorage;
  private bytes: ByteSchema[];
  private nibbles: NibbleSchema[];

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
      where(bytesCollection.isPublishedField, "==", true),
      orderBy(bytesCollection.publishDateField, "desc")
    );

    const queryResults: DocumentData[] = await getDocs(q).then(
      (response: QuerySnapshot<DocumentData, DocumentData>) =>
        response.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data()
        )
    );

    this.bytes = await Promise.all(
      queryResults.map(
        async (byteResponse: DocumentData): Promise<ByteSchema> => {
          const byte: ByteSchema = {
            ...byteResponse,
            series: (
              await getDoc(byteResponse.series)
            ).data() as ByteSeriesType,
            publishDate: byteResponse.publishDate.toDate(),
            lastModifiedDate: byteResponse.lastModifiedDate.toDate(),
            thumbnail: await this.getImage(byteResponse.thumbnail),
            coverPhoto: await this.getImage(byteResponse.coverPhoto),
          } as ByteSchema;

          for (const section of byte.sections) {
            await this.resolveImagesInSectionBody(section.body);
          }

          return byte;
        }
      )
    );
  }

  private async fetchNibbles(): Promise<void> {
    const q: Query<DocumentData, DocumentData> = query(
      collection(this.firestore, nibblesCollection.name),
      where(nibblesCollection.isPublishedField, "==", true),
      orderBy(nibblesCollection.publishDateField, "desc")
    );

    const queryResults: DocumentData[] = await getDocs(q).then(
      (response: QuerySnapshot<DocumentData, DocumentData>) =>
        response.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data()
        )
    );

    this.nibbles = await Promise.all(
      queryResults.map(
        async (nibbleResponse: DocumentData): Promise<NibbleSchema> => {
          // convert received nibble into nibble object
          const nibble: NibbleSchema = {
            ...nibbleResponse,
            publishDate: nibbleResponse.publishDate.toDate(),
            lastModifiedDate: nibbleResponse.lastModifiedDate.toDate(),
            thumbnail: await this.getImage(nibbleResponse.thumbnail),
            coverPhoto: await this.getImage(nibbleResponse.coverPhoto),
          } as NibbleSchema;

          return nibble;
        }
      )
    );
  }

  public listBytes(): ByteOverviewType[] {
    return this.bytes.map(
      (byte: ByteSchema): ByteOverviewType => ({
        title: byte.title,
        subtitle: byte.subtitle,
        series: byte.series,
        thumbnail: byte.thumbnail,
        publishDate: byte.publishDate,
        slug: byte.slug,
      })
    );
  }

  public listNibbles(): NibbleOverviewType[] {
    return this.nibbles.map(
      (nibble: NibbleSchema): NibbleOverviewType => ({
        title: nibble.title,
        thumbnail: nibble.thumbnail,
        coverPhoto: nibble.coverPhoto,
        slug: nibble.slug,
        publishDate: nibble.publishDate,
        timeTakenMinutes: nibble.timeTakenMinutes,
      })
    );
  }

  public getByte(slug: string): ByteSchema | undefined {
    return this.bytes.find((byte: ByteSchema) => byte.slug === slug);
  }

  public getNibble(slug: string): NibbleSchema | undefined {
    return this.nibbles.find((nibble: NibbleSchema) => nibble.slug === slug);
  }

  public getByteSlugs(): string[] {
    return this.bytes.map((byte: ByteSchema) => byte.slug);
  }

  public getNibbleSlugs(): string[] {
    return this.nibbles.map((nibble: NibbleSchema) => nibble.slug);
  }

  private getImage(path: string): Promise<string> {
    const storageRef: StorageReference = ref(this.storage, path);

    return getDownloadURL(storageRef);
  }

  private async resolveImagesInBaseContentItems(
    items: BaseContentSchema[]
  ): Promise<void> {
    for (const item of items) {
      if (item.type === "captionedImage") {
        item.value.image = await this.getImage(item.value.image);
      }
    }
  }

  private async resolveImagesInSubsubsectionBody(
    body: SubsubsectionBodyElementSchema[]
  ): Promise<void> {
    for (const el of body) {
      switch (el.type) {
        case "captionedImage":
          el.value.image = await this.getImage(el.value.image);
          break;
        case "collapsibleGroup":
          await this.resolveImagesInBaseContentItems(el.value.body);
          break;
        case "paragraph":
        case "latexParagraph":
          break;
      }
    }
  }

  private async resolveImagesInSubsectionBody(
    body: SubsectionBodyElementSchema[]
  ): Promise<void> {
    for (const el of body) {
      switch (el.type) {
        case "subsubsection":
          await this.resolveImagesInSubsubsectionBody(el.value.body);
          break;
        case "captionedImage":
          el.value.image = await this.getImage(el.value.image);
          break;
        case "collapsibleGroup":
          await this.resolveImagesInBaseContentItems(el.value.body);
          break;
        case "paragraph":
        case "latexParagraph":
          break;
      }
    }
  }

  private async resolveImagesInSectionBody(
    body: SectionBodyElementSchema[]
  ): Promise<void> {
    for (const el of body) {
      switch (el.type) {
        case "subsection":
          await this.resolveImagesInSubsectionBody(el.value.body);
          break;
        case "captionedImage":
          el.value.image = await this.getImage(el.value.image);
          break;
        case "collapsibleGroup":
          await this.resolveImagesInBaseContentItems(el.value.body);
          break;
        case "paragraph":
        case "latexParagraph":
          break;
      }
    }
  }
}
