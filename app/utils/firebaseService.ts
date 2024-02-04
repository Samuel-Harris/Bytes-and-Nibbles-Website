import { FirebaseApp, initializeApp } from "firebase/app";
import {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  QuerySnapshot,
  collection,
  getDocs,
  initializeFirestore,
  persistentLocalCache,
  query,
  where,
} from "firebase/firestore";
import {
  FirebaseStorage,
  StorageReference,
  getBlob,
  getStorage,
  ref,
} from "firebase/storage";
import { bytesCollection } from "./collectionConstants";
import { firebaseConfig } from "./firebaseConstants";

export type ByteOverview = {
  title: string;
  subtitle: string;
  thumbnail: string;
  publishDate: Date;
};

export class FirebaseService {
  private app: FirebaseApp;
  private db: Firestore;
  private storage: FirebaseStorage;

  public constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = initializeFirestore(this.app, {
      localCache: persistentLocalCache({}),
    });
    this.storage = getStorage(this.app);
  }

  public async listBytes(): Promise<ByteOverview[]> {
    const q = query(
      collection(this.db, bytesCollection.name),
      where(bytesCollection.isPublishedField, "==", true)
    );

    const bytes: DocumentData[] = await getDocs(q).then(
      (response: QuerySnapshot<DocumentData, DocumentData>) =>
        response.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => doc.data()
        )
    );

    return Promise.all(
      bytes.map(async (byte: DocumentData): Promise<ByteOverview> => {
        return {
          title: byte[bytesCollection.titleField],
          subtitle: byte[bytesCollection.subtitleField],
          thumbnail: await this.getImage(byte[bytesCollection.thumbnailField]),
          publishDate: byte[bytesCollection.publishDateField].toDate(),
        } as ByteOverview;
      })
    );
  }

  private getImage(path: string): Promise<string> {
    const gsRef: StorageReference = ref(this.storage, path);

    return getBlob(gsRef).then((blob) => {
      return URL.createObjectURL(blob);
    });
  }
}
