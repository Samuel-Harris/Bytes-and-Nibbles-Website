import { FirebaseApp, initializeApp } from "firebase/app";
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
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
import { bytesCollection } from "./collectionConstants";
import { firebaseConfig } from "./firebaseConstants";
import { Byte, ByteOverview, Series } from "./Byte";

export default class FirebaseService {
  private static instance: FirebaseService;
  private app: FirebaseApp;
  private firestore: Firestore;
  private storage: FirebaseStorage;
  private bytes: Byte[];

  private constructor() {
    // initialise firebase connection
    this.app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.app);
    this.storage = getStorage(this.app);
    this.bytes = [];
  }

  public static async getInstance(): Promise<FirebaseService> {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();

      await FirebaseService.instance.fetchBytes();
    }

    return Promise.resolve(FirebaseService.instance);
  }

  private async fetchBytes(): Promise<void> {
    // define query to list bytes
    const q: Query<DocumentData, DocumentData> = query(
      collection(this.firestore, bytesCollection.name),
      where(bytesCollection.isPublishedField, "==", true)
    );

    // fetch bytes from server
    const queryResults: DocumentData[] = await getDocs(q).then(
      (response: QuerySnapshot<DocumentData, DocumentData>) =>
        response.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data()
        )
    );

    // process byte data
    this.bytes = await Promise.all(
      queryResults.map(async (byteResponse: DocumentData): Promise<Byte> => {
        // convert received byte into byte object
        const byte: Byte = {
          ...byteResponse,
          series: (await getDoc(byteResponse.series)).data() as Series,
          publishDate: byteResponse.publishDate.toDate(),
          lastModifiedDate: byteResponse.lastModifiedDate.toDate(),
          thumbnail: await this.getImage(byteResponse.thumbnail),
          coverPhoto: await this.getImage(byteResponse.coverPhoto),
        } as Byte;

        // get all images for byte
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

  public getByte(slug: string): Byte | undefined {
    return this.bytes.find((byte: Byte) => byte.slug === slug);
  }

  public getSlugs(): string[] {
    return this.bytes.map((byte: Byte) => byte.slug);
  }

  private getImage(path: string): Promise<string> {
    const storageRef: StorageReference = ref(this.storage, path);

    return getDownloadURL(storageRef);
  }
}
