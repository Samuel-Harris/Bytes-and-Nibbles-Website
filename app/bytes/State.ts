import { ByteOverview } from "../utils/Byte";

export type State = {
  byteOverviews: ByteOverview[];
};

export enum ActionType {
  UPDATE_BYTE_LIST,
}

export type Action = {
  type: ActionType.UPDATE_BYTE_LIST;
  newByteOverviews: ByteOverview[];
};

export function reducer(draft: State, action: Action): void {
  switch (action.type) {
    case ActionType.UPDATE_BYTE_LIST:
      draft.byteOverviews = action.newByteOverviews;
      return;
  }
}
