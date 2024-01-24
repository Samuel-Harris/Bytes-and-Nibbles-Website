"use client";

import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { listBytes } from "../utils/firestoreService";
import { useEffect } from "react";

export default function BytesPage() {
    useEffect(() => {
        listBytes().then((response: QuerySnapshot<DocumentData, DocumentData>) => {
            console.log(response);
            response.forEach((doc) => {
                console.log(doc.data());
            });
        })
    }, [])

    return (
        <main>
            <div>
                <p>Bytes page</p>
            </div>
        </main>
    )
}
