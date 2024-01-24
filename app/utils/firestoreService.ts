import { initializeApp } from "firebase/app";
import { DocumentData, Firestore, QuerySnapshot, collection, getDocs, initializeFirestore, persistentLocalCache, query, where } from "firebase/firestore";
import { BYTE_COLLECTION_NAME, IS_PUBLISHED_FIELD } from "./firestoreConstants";

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

export function listBytes(): Promise<QuerySnapshot<DocumentData, DocumentData>> {
  const q = query(collection(db, BYTE_COLLECTION_NAME), where(IS_PUBLISHED_FIELD, "==", true));

  return getDocs(q);
}
