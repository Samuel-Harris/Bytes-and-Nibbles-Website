"use client";

import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { listBytes } from "../utils/firestoreService";
import { useEffect } from "react";
import Tilecard from "../components/tilecard";

export default function BytesPage(): JSX.Element {
    useEffect(() => {
        listBytes().then((response: QuerySnapshot<DocumentData, DocumentData>) => {
            console.log(response);
            response.forEach((doc) => {
                console.log(doc.data());
            });
        })
    }, [])

    return (
        <main className="grid grid-rows-10 justify-items-center pb-6">
            {Array.from(Array(10).keys()).map((i) =>
            <div className="row-span-1 w-full px-24 py-4">
                <Tilecard title={`My ${i}th tile`} subtitle={"A long and length subtitle about this blog that concisely explains what the topic is about. What happens if this is even longer?"} thumbnail={""} publishDate={new Date("2024-06-07")}/>
            </div>)
            }
        </main>
    )
}
