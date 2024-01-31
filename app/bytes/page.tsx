"use client";

import { listBytes } from "../utils/firebaseService";
import { Dispatch, useEffect } from "react";
import Tilecard from "../components/tilecard";
import ByteOverview from "../utils/byteOverview";
import { useImmerReducer } from "use-immer";

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

function reducer(draft: State, action: Action): void {
    switch (action.type) {
        case ActionType.UPDATE_BYTE_LIST:
            draft.bytes = action.bytesList;
            return;
        default:
            return;
    }
}

export default function BytesPage(): JSX.Element {
    const initState: State = { bytes: [] };
    const [state, dispatch]: [State, Dispatch<Action>] = useImmerReducer(reducer, initState);

    useEffect(() => {
        let bytesBeenFetched = false;

        if (!bytesBeenFetched) {
            listBytes().then((bytes: ByteOverview[]) => {
                dispatch({
                    type: ActionType.UPDATE_BYTE_LIST,
                    bytesList: bytes,
                })
            });
        }

        return () => {
            bytesBeenFetched = true
        };
    }, [dispatch])

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
