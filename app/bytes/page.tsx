"use client";

import React from "react";
import FirebaseService from "../utils/firebaseService";
import { Dispatch, useEffect } from "react";
import Tilecard from "../components/tilecard";
import { useImmerReducer } from "use-immer";
import { ByteOverview } from "../utils/Byte";

type State = {
  bytes: ByteOverview[];
};

enum ActionType {
  UPDATE_BYTE_LIST,
}

type Action = {
  type: ActionType.UPDATE_BYTE_LIST;
  bytesList: ByteOverview[];
};

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
  const [state, dispatch]: [State, Dispatch<Action>] = useImmerReducer(
    reducer,
    initState
  );

  useEffect(() => {
    let bytesBeenFetched = false;
    const firebaseService = FirebaseService.getInstance();

    if (!bytesBeenFetched) {
      firebaseService.listBytes().then((bytes: ByteOverview[]) => {
        dispatch({
          type: ActionType.UPDATE_BYTE_LIST,
          bytesList: bytes,
        });
      });
    }

    return () => {
      bytesBeenFetched = true;
    };
  }, [dispatch]);

  return (
    <main className="grid grid-rows-auto justify-items-center pb-6">
      {state.bytes.map((byteOverview: ByteOverview) => (
        <div
          key={byteOverview.title}
          title={byteOverview.title}
          className="w-11/12 sm:w-4/5 py-2 sm:py-3 md:py-8"
        >
          <Tilecard
            title={byteOverview.title}
            subtitle={byteOverview.subtitle}
            thumbnail={byteOverview.thumbnail}
            publishDate={byteOverview.publishDate}
            linkPath={`/bytes/${byteOverview.slug}`}
          />
        </div>
      ))}
    </main>
  );
}
