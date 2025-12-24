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
  ByteOverviewType,
  ByteSeriesType,
  ByteType,
  NibbleOverviewType,
  NibbleType,
  firebaseConfig,
} from "@bytes-and-nibbles/shared";

export default class FirebaseService {
  private app: FirebaseApp;
  private firestore: Firestore;
  private storage: FirebaseStorage;
  private bytes: ByteType[];
  private nibbles: NibbleType[];

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
      orderBy(nibblesCollection.publishDateField, "desc")
    );

    const queryResults: DocumentData[] = await getDocs(q).then(
      (response: QuerySnapshot<DocumentData, DocumentData>) =>
        response.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data()
        )
    );

    this.bytes = await Promise.all(
      queryResults.map(
        async (byteResponse: DocumentData): Promise<ByteType> => {
          const byte: ByteType = {
            ...byteResponse,
            series: (
              await getDoc(byteResponse.series)
            ).data() as ByteSeriesType,
            publishDate: byteResponse.publishDate.toDate(),
            lastModifiedDate: byteResponse.lastModifiedDate.toDate(),
            thumbnail: await this.getImage(byteResponse.thumbnail),
            coverPhoto: await this.getImage(byteResponse.coverPhoto),
          } as ByteType;

          for (const section of byte.sections) {
            for (const sectionBodyComponent of section.body) {
              if (sectionBodyComponent.type === "subsection") {
                for (const subsectionBodyComponent of sectionBodyComponent.value
                  .body) {
                  if (subsectionBodyComponent.type === "captionedImage") {
                    subsectionBodyComponent.value.image = await this.getImage(
                      subsectionBodyComponent.value.image
                    );
                  }
                }
              } else if (sectionBodyComponent.type === "captionedImage") {
                sectionBodyComponent.value.image = await this.getImage(
                  sectionBodyComponent.value.image
                );
              }
            }
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
        async (nibbleResponse: DocumentData): Promise<NibbleType> => {
          // convert received nibble into nibble object
          const nibble: NibbleType = {
            ...nibbleResponse,
            publishDate: nibbleResponse.publishDate.toDate(),
            lastModifiedDate: nibbleResponse.lastModifiedDate.toDate(),
            thumbnail: await this.getImage(nibbleResponse.thumbnail),
            coverPhoto: await this.getImage(nibbleResponse.coverPhoto),
          } as NibbleType;

          return nibble;
        }
      )
    );
  }

  public listBytes(): ByteOverviewType[] {
    return this.bytes.map(
      (byte: ByteType): ByteOverviewType => ({
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
      (nibble: NibbleType): NibbleOverviewType => ({
        title: nibble.title,
        thumbnail: nibble.thumbnail,
        coverPhoto: nibble.coverPhoto,
        slug: nibble.slug,
        publishDate: nibble.publishDate,
        timeTakenMinutes: nibble.timeTakenMinutes,
      })
    );
  }

  public getByte(slug: string): ByteType | undefined {
    return this.bytes.find((byte: ByteType) => byte.slug === slug);
  }

  public getNibble(slug: string): NibbleType | undefined {
    return this.nibbles.find((nibble: NibbleType) => nibble.slug === slug);
  }

  public getByteSlugs(): string[] {
    return this.bytes.map((byte: ByteType) => byte.slug);
  }

  public getNibbleSlugs(): string[] {
    return this.nibbles.map((nibble: NibbleType) => nibble.slug);
  }

  private getImage(path: string): Promise<string> {
    const storageRef: StorageReference = ref(this.storage, path);

    return getDownloadURL(storageRef);
  }
}
