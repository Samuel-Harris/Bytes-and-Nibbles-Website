import { FirebaseApp, initializeApp } from "firebase/app";
import {
  DocumentData,
  Firestore,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
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
import { Byte, ByteOverview, Section } from "./Byte";

export default class FirebaseService {
  private static instance: FirebaseService;
  private app: FirebaseApp;
  private db: Firestore;
  private storage: FirebaseStorage;
  private bytes: Byte[];

  private constructor() {
    // initialise firebase connection
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);

    this.bytes = [];
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }

    return FirebaseService.instance;
  }

  private async fetchBytes(): Promise<void> {
    // define query to list bytes
    const q: Query<DocumentData, DocumentData> = query(
      collection(this.db, bytesCollection.name),
      where(bytesCollection.isPublishedField, "==", true)
    );

    // fetch bytes from server
    const queryResults: DocumentData[] = await getDocs(q).then(
      (response: QuerySnapshot<DocumentData, DocumentData>) =>
        response.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data()
        )
    );

    this.bytes = await Promise.all(
      queryResults.map(async (byteResponse: DocumentData): Promise<Byte> => {
        // convert received byte into byte object
        const byte: Byte = byteResponse as Byte;

        // convert all date strings to Date objects
        byte.publishDate = new Date(byte.publishDate);
        byte.lastModifiedDate = new Date(byte.lastModifiedDate);

        // get all images for byte
        byte.thumbnail = await this.getImage(byte.thumbnail);
        byte.coverPhoto = await this.getImage(byte.coverPhoto);
        byte.sections.forEach((section: Section) => {
          section.body.forEach(async (bodyComponent: any) => {
            if (bodyComponent.image) {
              bodyComponent.image = await this.getImage(bodyComponent.image);
            }
          });
        });

        return byte;
      })
    );
  }

  /**
   * This decorator method ensures that the bytes have been fetched before a method is called
   * @param target 
   * @param propertyKey 
   * @param descriptor 
   * @returns a function returning a Promise wrapping the original method and fetching the bytes if they haven't been fetched
   */
  private static ByteGetter<T>(
    target: FirebaseService,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>
  ): void | TypedPropertyDescriptor<(...args: any[]) => Promise<T>> {
    if (!descriptor.value) {
      return;
    }

    const originalMethod: (...args: any[]) => Promise<T> = descriptor.value; // save original method

    // replace the original method with a byte-fetching one that also calls the original method
    descriptor.value = function (...args: any[]): Promise<T> {
      return new Promise(async (resolve) => {
        const firebaseService: FirebaseService = FirebaseService.getInstance();
        if (firebaseService.bytes.length === 0) {  // no bytes have been found
          await firebaseService.fetchBytes();
        }

        // call original method with all given arguments
        resolve((<any>originalMethod).apply(this, [...args]));
      });
    };

    return descriptor;
  }

  @(FirebaseService.ByteGetter<ByteOverview[]>)
  public async listBytes(): Promise<ByteOverview[]> {
    return this.bytes.map((byte: DocumentData): ByteOverview => {
      return {
        title: byte.title,
        subtitle: byte.subtitle,
        thumbnail: byte.thumbnail,
        publishDate: byte.publishDate,
      } as ByteOverview;
    });
  }

  @(FirebaseService.ByteGetter<Byte | undefined>)
  public async getByte(slug: string): Promise<Byte | undefined> {
    return this.bytes.find((byte: Byte) => byte.slug === slug);
  }

  @(FirebaseService.ByteGetter<string[]>)
  public async getSlugs(): Promise<string[]> {
    return this.bytes.map((byte: Byte) => byte.slug);
  }

  private getImage(path: string): Promise<string> {
    const gsRef: StorageReference = ref(this.storage, path);

    return getDownloadURL(gsRef);
  }
}
