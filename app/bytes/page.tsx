"use client";

import { DocumentData, QuerySnapshot, Timestamp } from "firebase/firestore";
import { listBytes } from "../utils/firestoreService";
import { useEffect, useReducer } from "react";
import Tilecard from "../components/tilecard";
import { ByteOverview } from "./byteOverview";

type State = {
    bytes: ByteOverview[];
}

enum ActionType {
    UPDATE_BYTE_LIST = "updateByteList"
}

type Action = {
    type: ActionType.UPDATE_BYTE_LIST;
    bytesList: ByteOverview[];
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.UPDATE_BYTE_LIST:
            return { bytes: action.bytesList };
        default:
            return state;
    }
}

export default function BytesPage(): JSX.Element {
    const [state, dispatch]: [State, React.Dispatch<Action>] = useReducer(reducer, { bytes: [] });

    useEffect(() => {
        let fetchedBytes = false;
        listBytes().then((response: QuerySnapshot<DocumentData, DocumentData>) => {
            const newBytes: ByteOverview[] = [];
            response.forEach((doc) => {
                const byte: DocumentData = doc.data();
                const timestamp: Timestamp = byte.publishDate;
                const byteOverview: ByteOverview = {
                    title: byte.title,
                    subtitle: byte.subtitle,
                    thumbnail: byte.thumbnail,
                    publishDate: timestamp.toDate(),
                }

                newBytes.push(byteOverview);
            });

            if (!fetchedBytes) {
                dispatch({ type: ActionType.UPDATE_BYTE_LIST, bytesList: newBytes })
            }
        })

        return () => {
            fetchedBytes = true
        };
    }, [])

    return (
        <main className="grid grid-rows-10 justify-items-center pb-6">
            {state.bytes.map((byteOverview: ByteOverview) =>
                <div key={byteOverview.title} className="row-span-1 w-full px-24 py-4">
                    <Tilecard title={byteOverview.title} subtitle={byteOverview.subtitle} thumbnail={byteOverview.thumbnail} publishDate={byteOverview.publishDate} />
                </div>)
            }
        </main>
    )
}
