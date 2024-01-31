import { initializeApp } from "firebase/app";
import { DocumentData, Firestore, QuerySnapshot, collection, getDocs, initializeFirestore, persistentLocalCache, query, where } from "firebase/firestore";
import { FirebaseStorage, StorageReference, getBlob, getStorage, ref } from "firebase/storage";
import ByteOverview from "./byteOverview";
import { bytesCollection } from "./collectionConstants";
import { firebaseConfig } from "./firebaseConstants";

const app = initializeApp(firebaseConfig);

const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({}),
});
export default db;

export async function listBytes(): Promise<ByteOverview[]> {
  const q = query(collection(db, bytesCollection.name), where(bytesCollection.isPublishedField, "==", true));

  const bytes: DocumentData[] = await getDocs(q).then((response: QuerySnapshot<DocumentData, DocumentData>) => response.docs.map((doc) => doc.data()));

  return Promise.all(bytes.map(async (byte: DocumentData): Promise<ByteOverview> =>{
    return {
      title: byte[bytesCollection.titleField],
      subtitle: byte[bytesCollection.subtitleField],
      thumbnail: await getImage(byte[bytesCollection.thumbnailField]),
      publishDate: byte[bytesCollection.publishDateField].toDate(),
    } as ByteOverview;
  }));
}

export function getImage(path: string): Promise<string> {
  const storage: FirebaseStorage = getStorage(app);
  const gsRef: StorageReference = ref(storage, path);

  return getBlob(gsRef).then((blob) => {
    return URL.createObjectURL(blob);
  });
}
