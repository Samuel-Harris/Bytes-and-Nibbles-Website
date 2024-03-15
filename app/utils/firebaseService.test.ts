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
import { Byte, ByteOverview, SectionType } from "./Byte";
import { bytesCollection } from "./collectionConstants";
import isEqual from "lodash/isequal";

jest.mock("firebase/app");
jest.mock("firebase/firestore");
jest.mock("firebase/storage");

let bytes: Byte[];

describe("Firebase service", () => {
  beforeEach(() => {
    bytes = [
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
        coverPhoto: "My cover photo 2",
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
  });

  afterEach(() => {
    // @ts-ignore
    FirebaseService["instance"] = undefined;

    jest.clearAllMocks();
  });

  it("should initialise a connection to firebase and fetch all bytes on instantiation", async () => {
    const appMock = mock<FirebaseApp>();
    const initializeAppMock = mocked(initializeApp);
    initializeAppMock.mockReturnValue(appMock);

    const rawBytes = bytes.map((byte) => ({
      ...byte,
      publishDate: new Timestamp(bytes[0].publishDate.getUTCSeconds(), 0),
      lastModifiedDate: new Timestamp(
        bytes[0].lastModifiedDate.getUTCSeconds(),
        0
      ),
    }));

    const storageMocks: {
      thumbnail: StorageReference;
      coverPhoto: StorageReference;
    }[] = [];
    for (let i = 0; i < bytes.length; i++) {
      storageMocks.push({
        thumbnail: mock<StorageReference>(),
        coverPhoto: mock<StorageReference>(),
      });
    }
    const refMock = mocked(ref);
    refMock.mockImplementation((_storage, path) => {
      for (let i = 0; i < bytes.length; i++) {
        if (path === bytes[i].thumbnail) {
          return storageMocks[i].thumbnail;
        } else if (path === bytes[i].coverPhoto) {
          return storageMocks[i].coverPhoto;
        }
      }
      return mock<StorageReference>();
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
        new Promise((resolve): void => {
          for (const storageMock of storageMocks) {
            if (storageRef === storageMock.thumbnail) {
              resolve(`Download url ${storageMock.thumbnail}`);
            } else if (storageRef === storageMock.coverPhoto) {
              resolve(`Download url ${storageMock.coverPhoto}`);
            }
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

    expect(refMock).toHaveBeenCalledTimes(2 * bytes.length);
    for (const byte of bytes) {
      expect(refMock).toHaveBeenCalledWith(
        firebaseService["storage"],
        byte.thumbnail
      );
      expect(refMock).toHaveBeenCalledWith(
        firebaseService["storage"],
        byte.coverPhoto
      );
    }

    expect(getDownloadURLMock).toHaveBeenCalledTimes(2 * bytes.length);
    for (const storageMock of storageMocks) {
      expect(getDownloadURLMock).toHaveBeenCalledWith(storageMock.thumbnail);
      expect(getDownloadURLMock).toHaveBeenCalledWith(storageMock.coverPhoto);
    }

    expect(isEqual(expectedBytes, firebaseService["bytes"]));
  });

  it("should not initialise multiple firebase services", async () => {
    const fetchBytesMock = jest.spyOn(
      FirebaseService.prototype as any,
      "fetchBytes"
    );
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
    const fetchBytesMock = jest.spyOn(
      FirebaseService.prototype as any,
      "fetchBytes"
    );
    fetchBytesMock.mockImplementation(() => Promise.resolve());

    const firebaseService = await FirebaseService.getInstance();
    firebaseService["bytes"] = bytes;

    const bytesOverviews: ByteOverview[] = await firebaseService.listBytes();

    expect(fetchBytesMock).toHaveBeenCalledTimes(1);

    expect(getDocs).toHaveBeenCalledTimes(0);

    expect(bytesOverviews).toEqual(
      bytes.map(
        (byte): ByteOverview => ({
          title: byte.title,
          subtitle: byte.subtitle,
          thumbnail: byte.thumbnail,
          publishDate: byte.publishDate,
          slug: byte.slug,
        })
      )
    );
  });

  it("should get bytes", async () => {
    const fetchBytesMock = jest.spyOn(
      FirebaseService.prototype as any,
      "fetchBytes"
    );
    fetchBytesMock.mockImplementation(() => Promise.resolve());

    const firebaseService = await FirebaseService.getInstance();
    firebaseService["bytes"] = bytes;

    const byte: Byte | undefined = firebaseService.getByte(bytes[1].slug);

    expect(byte).toEqual(bytes[1]);
  });

  it("should get slugs", async () => {
    const fetchBytesMock = jest.spyOn(
      FirebaseService.prototype as any,
      "fetchBytes"
    );
    fetchBytesMock.mockImplementation(() => Promise.resolve());

    const firebaseService = await FirebaseService.getInstance();
    firebaseService["bytes"] = bytes;

    const slugs: string[] = firebaseService.getSlugs();

    expect(slugs.length).toEqual(bytes.length);
    for (const slug of slugs) {
      expect(bytes.find((byte) => byte.slug === slug)).toBeDefined();
    }
  });
});
