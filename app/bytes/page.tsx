"use client";

import React from "react";
import FirebaseService from "../utils/firebaseService";
import { Dispatch, useEffect } from "react";
import Tilecard from "../components/tilecard";
import { useImmerReducer } from "use-immer";
import { ByteOverview } from "../utils/Byte";

type State = {
  byteOverviews: ByteOverview[];
};

enum ActionType {
  UPDATE_BYTE_LIST,
}

type Action = {
  type: ActionType.UPDATE_BYTE_LIST;
  newByteOverviews: ByteOverview[];
};

function reducer(draft: State, action: Action): void {
  switch (action.type) {
    case ActionType.UPDATE_BYTE_LIST:
      draft.byteOverviews = action.newByteOverviews;
      return;
    default:
      return;
  }
}

export default function BytesPage(): JSX.Element {
  const initState: State = { byteOverviews: [] };
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
          newByteOverviews: bytes,
        });
      });
    }

    return () => {
      bytesBeenFetched = true;
    };
  }, [dispatch]);

  return (
    <main className="grid grid-rows-auto justify-items-center ">
      {React.Children.toArray(
        state.byteOverviews.map((byteOverview: ByteOverview) => (
          <Tilecard
            title={byteOverview.title}
            subtitle={byteOverview.subtitle}
            thumbnail={byteOverview.thumbnail}
            publishDate={byteOverview.publishDate}
            linkPath={`/bytes/${byteOverview.slug}`}
          />
        ))
      )}
    </main>
  );
}
