import { initializeApp } from "firebase/app";
import { DocumentData, Firestore, QuerySnapshot, Timestamp, collection, getDocs, initializeFirestore, persistentLocalCache, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ByteOverview from "./byteOverview";
import { bytesCollection } from "./collectionConstants";

const firebaseConfig = {
  apiKey: "AIzaSyAf0UoF9IQj93P4ioHPtEbt94VJFSPf7sE",
  authDomain: "bytes-and-nibbles.firebaseapp.com",
  projectId: "bytes-and-nibbles",
  storageBucket: "bytes-and-nibbles.appspot.com",
  messagingSenderId: "751360074629",
  appId: "1:751360074629:web:5a1e811bb7eb97b0371aec",
  measurementId: "G-R95RTCLKPF"
};


const app = initializeApp(firebaseConfig);

const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({}),
});
export default db;

export function listBytes(): Promise<ByteOverview[]> {
  const q = query(collection(db, bytesCollection.name), where(bytesCollection.isPublishedField, "==", true));

  return getDocs(q).then((response: QuerySnapshot<DocumentData, DocumentData>): ByteOverview[] => {
    const bytes: ByteOverview[] = [];

    response.forEach((doc) => {
      const byte: DocumentData = doc.data();
      const publishDateTimestamp: Timestamp = byte[bytesCollection.publishDateField];

      const byteOverview: ByteOverview = {
        title: byte[bytesCollection.titleField],
        subtitle: byte[bytesCollection.subtitleField],
        thumbnail: byte[bytesCollection.thumbnailField],
        publishDate: publishDateTimestamp.toDate(),
      }

      bytes.push(byteOverview);
    });

    return bytes;
  }).catch((error) => {
    console.error(error);

    return [];
  });
}

export function getImage(path: string) {
  const storage = getStorage();
}
