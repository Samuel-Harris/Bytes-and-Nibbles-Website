import {
  FirebaseStorage,
  getBlob,
  getStorage,
  ref,
  StorageReference,
} from "firebase/storage";
import { getImage } from "./firebaseService";
import { mocked } from "jest-mock";

jest.mock("firebase/app");
jest.mock("firebase/firestore");
jest.mock("firebase/storage");

describe("firebaseService", () => {
  it("should list all bytes with listBytes()", () => {});
  it("should get images their paths with getImage()", () => {
    const path = "some_path";

    const mRef: jest.MockedFunction<typeof ref> = mocked(ref);
    const mStorageRef: StorageReference = {
      name: "mockStorageRef",
    } as StorageReference;
    mRef.mockReturnValue(mStorageRef);

    const mGetBlob: jest.MockedFunction<typeof getBlob> = mocked(getBlob);
    const mBlob: Promise<Blob> = new Promise(() => new Blob());
    mGetBlob.mockReturnValue(mBlob);

    const mObjectUrl = "mock object url";
    URL.createObjectURL = jest.fn().mockReturnValue(mObjectUrl);

    const actualmageSrcPromise: Promise<string> = getImage(path);

    expect(ref).toHaveBeenCalledTimes(1);

    expect(getBlob).toHaveBeenCalledWith(mStorageRef);
    expect(getBlob).toHaveBeenCalledTimes(1);

    expect(actualmageSrcPromise).resolves.toEqual(mObjectUrl);
  });
});
