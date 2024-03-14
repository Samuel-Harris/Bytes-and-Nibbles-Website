import { FirebaseApp, initializeApp } from "firebase/app";
import { mock } from "jest-mock-extended";
import { mocked } from "jest-mock";
import {
  DocumentData,
  QuerySnapshot,
  Timestamp,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import {
  StorageReference,
  getDownloadURL,
  getStorage,
  ref,
} from "firebase/storage";
import FirebaseService from "./firebaseService";
import { firebaseConfig } from "./firebaseConstants";
import { ByteOverview, SectionType } from "./Byte";
import { bytesCollection } from "./collectionConstants";
import isEqual from "lodash/isequal";

jest.mock("firebase/app");
jest.mock("firebase/firestore");
jest.mock("firebase/storage");

describe("Firebase service", () => {
  afterEach(() => {
    // @ts-ignore
    FirebaseService["instance"] = undefined;

    jest.clearAllMocks();
  });

  it("should initialise a connection to firebase and fetch all bytes on instantiation", async () => {
    const appMock = mock<FirebaseApp>();
    const initializeAppMock = mocked(initializeApp);
    initializeAppMock.mockReturnValue(appMock);

    const rawBytes = [
      {
        title: "My title 1",
        subtitle: "My subtitle 1",
        slug: "my-slug-1",
        thumbnail: "My thumbnail 1",
        coverPhoto: "My cover photo 1",
        publishDate: new Timestamp(1706320119, 344000000),
        lastModifiedDate: new Timestamp(1706131426, 738000000),
        sections: [],
      },
      {
        title: "My title 2",
        subtitle: "My subtitle 2",
        slug: "my-slug-2",
        thumbnail: "My thumbnail 2",
        coverPhoto: "My cover photo 2",
        publishDate: new Timestamp(1706320120, 344000000),
        lastModifiedDate: new Timestamp(1706131435, 738000000),
        sections: [
          {
            title: "Section title",
            body: [{ type: "paragraph", value: "My paragraph" }],
          },
        ],
      },
    ];

    const storageRefMock1 = mock<StorageReference>();
    const storageRefMock2 = mock<StorageReference>();
    const storageRefMock3 = mock<StorageReference>();
    const storageRefMock4 = mock<StorageReference>();
    const refMock = mocked(ref);
    refMock.mockImplementation((_storage, path) => {
      switch (path) {
        case "My thumbnail 1":
          return storageRefMock1;
        case "My thumbnail 2":
          return storageRefMock2;
        case "My cover photo 1":
          return storageRefMock3;
        case "My cover photo 2":
          return storageRefMock4;
        default:
          return mock<StorageReference>();
      }
    });

    const expectedBytes = rawBytes.map((byte) => {
      return {
        title: byte.title,
        subtitle: byte.subtitle,
        slug: byte.slug,
        thumbnail: `Download url ${byte.title} ${byte.thumbnail}`,
        coverPhoto: `Download url ${byte.title} ${byte.coverPhoto}`,
        publishDate: byte.publishDate.toDate(),
        lastModifiedDate: byte.lastModifiedDate.toDate(),
        sections: byte.sections as SectionType[],
      };
    });

    const getDownloadURLMock = mocked(getDownloadURL);
    getDownloadURLMock.mockImplementation(
      (storageRef) =>
        new Promise((resolve) => {
          switch (storageRef) {
            case storageRefMock1:
              resolve(expectedBytes[0].thumbnail);
            case storageRefMock2:
              resolve(expectedBytes[1].thumbnail);
            case storageRefMock3:
              resolve(expectedBytes[0].coverPhoto);
            case storageRefMock4:
              resolve(expectedBytes[1].coverPhoto);
            default:
              return "";
          }
        })
    );

    const responseMock = {
      docs: rawBytes.map((byte) => {
        return {
          data: () => byte,
          metadata: mock(),
          exists: mock(),
          get: mock(),
          id: mock(),
          ref: mock(),
        };
      }),
    };
    const getDocsMock = mocked(getDocs);
    getDocsMock.mockResolvedValue(
      responseMock as unknown as QuerySnapshot<DocumentData, DocumentData>
    );

    const firebaseService = await FirebaseService.getInstance();

    expect(firebaseService).toBeInstanceOf(FirebaseService);

    expect(initializeAppMock).toHaveBeenCalledTimes(1);
    expect(initializeAppMock).toHaveBeenCalledWith(firebaseConfig);

    expect(getFirestore).toHaveBeenCalledTimes(1);
    expect(getFirestore).toHaveBeenCalledWith(appMock);

    expect(getStorage).toHaveBeenCalledTimes(1);
    expect(getStorage).toHaveBeenCalledWith(appMock);

    expect(getDocsMock).toHaveBeenCalledTimes(1);
    expect(getDocsMock).toHaveBeenCalledWith(
      query(
        collection(firebaseService["firestore"], bytesCollection.name),
        where(bytesCollection.isPublishedField, "==", true)
      )
    );

    expect(refMock).toHaveBeenCalledTimes(4);
    expect(refMock).toHaveBeenCalledWith(firebaseService["storage"], "My thumbnail 1");
    expect(refMock).toHaveBeenCalledWith(firebaseService["storage"], "My thumbnail 2");
    expect(refMock).toHaveBeenCalledWith(firebaseService["storage"], "My cover photo 1");
    expect(refMock).toHaveBeenCalledWith(firebaseService["storage"], "My cover photo 2");

    expect(getDownloadURLMock).toHaveBeenCalledTimes(4);
    expect(getDownloadURLMock).toHaveBeenCalledWith(storageRefMock1);
    expect(getDownloadURLMock).toHaveBeenCalledWith(storageRefMock2);
    expect(getDownloadURLMock).toHaveBeenCalledWith(storageRefMock3);
    expect(getDownloadURLMock).toHaveBeenCalledWith(storageRefMock4);

    expect(isEqual(expectedBytes, firebaseService["bytes"]));
  });

  it("should not initialise multiple firebase services", async () => {
    const fetchBytesMock = jest.spyOn(FirebaseService.prototype as any, 'fetchBytes');
    fetchBytesMock.mockImplementation(() => Promise.resolve());

    const firebaseService1 = await FirebaseService.getInstance();
    const firebaseService2 = await FirebaseService.getInstance();

    expect(firebaseService1).toBeInstanceOf(FirebaseService);
    expect(firebaseService2).toBeInstanceOf(FirebaseService);
    expect(firebaseService1).toBe(firebaseService2);

    expect(initializeApp).toHaveBeenCalledTimes(1);

    expect(getFirestore).toHaveBeenCalledTimes(1);

    expect(getStorage).toHaveBeenCalledTimes(1);

    expect(fetchBytesMock).toHaveBeenCalledTimes(1);
  });

  it("should list bytes", async () => {
    const fetchBytesMock = jest.spyOn(FirebaseService.prototype as any, 'fetchBytes');
    fetchBytesMock.mockImplementation(() => Promise.resolve());

    const firebaseService = await FirebaseService.getInstance();
    firebaseService["bytes"] = [
      {
        title: "My title 1",
        subtitle: "My subtitle 1",
        slug: "my-slug-1",
        thumbnail: "My thumbnail 1",
        coverPhoto: "My cover photo 1",
        publishDate: new Date("03/12/03"),
        lastModifiedDate: new Date("04/12/03"),
        sections: [],
      },
      {
        title: "My title 2",
        subtitle: "My subtitle 2",
        slug: "my-slug-2",
        thumbnail: "My thumbnail 2",
        coverPhoto: "My cover photo 21",
        publishDate: new Date("11/05/24"),
        lastModifiedDate: new Date("12/06/24"),
        sections: [
          {
            title: "Section title",
            body: [{ type: "paragraph", value: "My paragraph" }],
          },
        ],
      },
    ];

    const bytes: ByteOverview[] = await firebaseService.listBytes();

    expect(fetchBytesMock).toHaveBeenCalledTimes(1);

    expect(getDocs).toHaveBeenCalledTimes(0);

    expect(bytes).toEqual([
      {
        title: "My title 1",
        subtitle: "My subtitle 1",
        slug: "my-slug-1",
        thumbnail: "My thumbnail 1",
        publishDate: new Date("03/12/03"),
      },
      {
        title: "My title 2",
        subtitle: "My subtitle 2",
        slug: "my-slug-2",
        thumbnail: "My thumbnail 2",
        publishDate: new Date("11/05/24"),
      },
    ]);
  });
});
