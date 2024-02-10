import { FirebaseApp, initializeApp } from "firebase/app";
import {
  DocumentData,
  Firestore,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
  getDocs,
  getDocsFromCache,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import {
  FirebaseStorage,
  StorageReference,
  getBlob,
  getDownloadURL,
  getStorage,
  ref,
} from "firebase/storage";
import { bytesCollection } from "./collectionConstants";
import { firebaseConfig } from "./firebaseConstants";
import { Byte, ByteOverview, Section } from "./Byte";
import Image from "next/image";

export default class FirebaseService {
  private app: FirebaseApp;
  private db: Firestore;
  private storage: FirebaseStorage;

  public constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  public async listBytes(): Promise<ByteOverview[]> {
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

    // collect all bytes into byte overviews
    return Promise.all(
      queryResults.map(async (byte: DocumentData): Promise<ByteOverview> => {
        return {
          title: byte[bytesCollection.titleField],
          subtitle: byte[bytesCollection.subtitleField],
          thumbnail: await this.getImage(byte[bytesCollection.thumbnailField]),
          publishDate: byte[bytesCollection.publishDateField].toDate(),
        } as ByteOverview;
      })
    );
  }

  public async getByte(slug: string): Promise<Byte | null> {
    // define query to get byte
    const q: Query<DocumentData, DocumentData> = query(
      collection(this.db, bytesCollection.name),
      where(bytesCollection.isPublishedField, "==", true),
      where(bytesCollection.slugField, "==", slug),
      limit(1)
    );

    // fetch byte from server
    const queryResults = await getDocs(q).then(
      (response: QuerySnapshot<DocumentData, DocumentData>) =>
        response.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data()
        )
    );

    if (queryResults.length > 0) {
      // byte found
      const byte: Byte = queryResults[0] as Byte;

      // get images for byte.
      byte.coverPhoto = await this.getImage(byte.coverPhoto);
      byte.sections.forEach((section: Section) => {
        section.body.forEach(async (bodyComponent: any) => {
          if (bodyComponent.image) {
            bodyComponent.image = await this.getImage(bodyComponent.image);
          }
        });
      });

      return byte;
    } else {
      // byte not found
      return null;
    }
  }

  public async getSlugs(): Promise<string[]> {
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

    // collect all bytes into byte overviews
    return Promise.all(
      queryResults.map(async (byte: DocumentData): Promise<string> => {
        return byte[bytesCollection.slugField];
      })
    );
  }

  private getImage(path: string): Promise<string> {
    const gsRef: StorageReference = ref(this.storage, path);

    return getDownloadURL(gsRef);
  }
}
