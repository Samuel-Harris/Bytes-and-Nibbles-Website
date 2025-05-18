import { FirebaseApp, initializeApp } from "firebase/app";
import { mock } from "jest-mock-extended";
import { mocked } from "jest-mock";
import {
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  collection,
  getDoc,
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
import FirebaseService from "./FirebaseService";
import { firebaseConfig } from "./firebaseConstants";
import { Byte, ByteOverview, Series } from "./Byte";
import { bytesCollection, nibblesCollection } from "./collectionConstants";
import _, { get } from "lodash";
import { Nibble, NibbleOverview } from "./Nibble";

jest.mock("firebase/app");
jest.mock("firebase/firestore");
jest.mock("firebase/storage");

const bytes: Byte[] = [
  {
    title: "My title 1",
    subtitle: "My subtitle 1",
    series: { title: "My series 1", accentColour: "#ac3Ef" },
    slug: "my-slug-1",
    thumbnail: "My thumbnail 1",
    coverPhoto: "My cover photo 1",
    publishDate: new Date("03/12/03"),
    lastModifiedDate: new Date("04/12/03"),
    sections: [
      {
        title: "Section title 1",
        body: [{ type: "paragraph", value: "My paragraph 1" }],
      },
    ],
  },
  {
    title: "My title 2",
    subtitle: "My subtitle 2",
    series: { title: "My series 2", accentColour: "#FA3FE" },
    slug: "my-slug-2",
    thumbnail: "My thumbnail 2",
    coverPhoto: "My cover photo 2",
    publishDate: new Date("11/05/24"),
    lastModifiedDate: new Date("12/06/24"),
    sections: [
      {
        title: "Section title 2",
        body: [
          { type: "paragraph", value: "My paragraph 2" },
          { type: "paragraph", value: "My paragraph 3" },
        ],
      },
      {
        title: "Section title 3",
        body: [{ type: "paragraph", value: "My paragraph 4" }],
      },
    ],
  },
];

const nibbles: Nibble[] = [
  {
    title: "My nibble 1",
    thumbnail: "My thumbnail 3",
    coverPhoto: "My cover photo 3",
    slug: "my-slug-3",
    nServings: 4,
    source: "My source 1",
    ingredients: [
      {
        name: "Garam masala",
        quantity: 1,
        measurement: "cup",
        optional: false,
      },
    ],
    steps: ["Drink the powder"],
    publishDate: new Date("11/05/24"),
    lastModifiedDate: new Date("01/05/24"),
    timeTakenMinutes: 60,
  },
  {
    title: "My nibble 2",
    thumbnail: "My thumbnail 4",
    coverPhoto: "My cover photo 4",
    slug: "my-slug-4",
    nServings: 6,
    source: "My source 2",
    ingredients: [
      {
        name: "Turmeric",
        quantity: 2,
        measurement: "Tbsp",
        optional: true,
      },
    ],
    steps: ["Consume the yellow"],
    publishDate: new Date("12/03/21"),
    lastModifiedDate: new Date("01/05/24"),
    timeTakenMinutes: 65,
  },
];

describe("Firebase service", () => {
  afterEach(() => {
    // @ts-ignore
    FirebaseService["instance"] = undefined;

    jest.clearAllMocks();
  });

  it("should initialise a connection to firebase and fetch all bytes on instantiation", async () => {
    // Given
    const appMock: FirebaseApp = mock<FirebaseApp>();
    const initializeAppMock = mocked(initializeApp);
    initializeAppMock.mockReturnValue(appMock);

    const rawBytes = bytes.map((byte: Byte) => ({
      ...byte,
      publishDate: new Timestamp(byte.publishDate.getUTCSeconds(), 0),
      lastModifiedDate: new Timestamp(byte.lastModifiedDate.getUTCSeconds(), 0),
      series: byte.series.title,
    }));

    const rawNibbles = nibbles.map((nibble: Nibble) => ({
      ...nibble,
      publishDate: new Timestamp(nibble.publishDate.getUTCSeconds(), 0),
      lastModifiedDate: new Timestamp(
        nibble.lastModifiedDate.getUTCSeconds(),
        0
      ),
    }));

    const byteStorageMocks: {
      thumbnail: StorageReference;
      coverPhoto: StorageReference;
    }[] = [];
    for (let i = 0; i < bytes.length; i++) {
      byteStorageMocks.push({
        thumbnail: mock<StorageReference>(),
        coverPhoto: mock<StorageReference>(),
      });
    }

    const nibbleStorageMocks: {
      thumbnail: StorageReference;
      coverPhoto: StorageReference;
    }[] = [];
    for (let i = 0; i < nibbles.length; i++) {
      nibbleStorageMocks.push({
        thumbnail: mock<StorageReference>(),
        coverPhoto: mock<StorageReference>(),
      });
    }

    const refMock = mocked(ref);
    refMock.mockImplementation((_storage, path) => {
      for (let i = 0; i < bytes.length; i++) {
        if (path === bytes[i].thumbnail) {
          return byteStorageMocks[i].thumbnail;
        } else if (path === bytes[i].coverPhoto) {
          return byteStorageMocks[i].coverPhoto;
        }
      }

      for (let i = 0; i < nibbles.length; i++) {
        if (path === nibbles[i].thumbnail) {
          return nibbleStorageMocks[i].thumbnail;
        } else if (path === nibbles[i].coverPhoto) {
          return nibbleStorageMocks[i].coverPhoto;
        }
      }

      return mock<StorageReference>();
    });

    const expectedBytes = rawBytes.map((byte) => ({
      ...byte,
      thumbnail: `Download url ${byte.title} ${byte.thumbnail}`,
      coverPhoto: `Download url ${byte.title} ${byte.coverPhoto}`,
      publishDate: byte.publishDate.toDate(),
      lastModifiedDate: byte.lastModifiedDate.toDate(),
    }));

    const expectedNibbles = rawNibbles.map((nibble) => {
      return {
        ...nibble,
        thumbnail: `Download url ${nibble.title} ${nibble.thumbnail}`,
        coverPhoto: `Download url ${nibble.title} ${nibble.coverPhoto}`,
        publishDate: nibble.publishDate.toDate(),
        lastModifiedDate: nibble.lastModifiedDate.toDate(),
      };
    });

    const getDownloadURLMock = mocked(getDownloadURL);
    getDownloadURLMock.mockImplementation(
      (storageRef) =>
        new Promise((resolve): void => {
          for (const storageMock of byteStorageMocks) {
            if (storageRef === storageMock.thumbnail) {
              resolve(`Download url ${storageMock.thumbnail}`);
            } else if (storageRef === storageMock.coverPhoto) {
              resolve(`Download url ${storageMock.coverPhoto}`);
            }
          }

          for (const storageMock of nibbleStorageMocks) {
            if (storageRef === storageMock.thumbnail) {
              resolve(`Download url ${storageMock.thumbnail}`);
            } else if (storageRef === storageMock.coverPhoto) {
              resolve(`Download url ${storageMock.coverPhoto}`);
            }
          }

          resolve("Invalid ref");
        })
    );

    const bytesResponseMock = {
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

    const nibblesResponseMock = {
      docs: rawNibbles.map((nibble) => {
        return {
          data: () => nibble,
          metadata: mock(),
          exists: mock(),
          get: mock(),
          id: mock(),
          ref: mock(),
        };
      }),
    };

    const series: Series = {
      title: "My series 1",
      accentColour: "#ac3Ef",
    };

    const getDocMock = mocked(getDoc);
    const documentSnapshotMock = mock<DocumentSnapshot<DocumentData>>();
    documentSnapshotMock.data.mockReturnValue(series);
    getDocMock.mockImplementation((_): any => {
      return Promise.resolve(documentSnapshotMock);
    });

    const getDocsMock = mocked(getDocs);
    getDocsMock.mockResolvedValueOnce(
      bytesResponseMock as unknown as QuerySnapshot<DocumentData, DocumentData>
    );
    getDocsMock.mockResolvedValueOnce(
      nibblesResponseMock as unknown as QuerySnapshot<
        DocumentData,
        DocumentData
      >
    );

    // When
    const firebaseService: FirebaseService =
      await FirebaseService.getInstance();


    // Then
    expect(firebaseService).toBeDefined();
    expect(firebaseService).toBeInstanceOf(FirebaseService);

    expect(initializeAppMock).toHaveBeenCalledTimes(1);
    expect(initializeAppMock).toHaveBeenCalledWith(firebaseConfig);

    expect(getFirestore).toHaveBeenCalledTimes(1);
    expect(getFirestore).toHaveBeenCalledWith(appMock);

    expect(getStorage).toHaveBeenCalledTimes(1);
    expect(getStorage).toHaveBeenCalledWith(appMock);

    expect(getDocsMock).toHaveBeenCalledTimes(2);
    expect(getDocsMock).toHaveBeenCalledWith(
      query(
        collection(firebaseService["firestore"], bytesCollection.name),
        where(bytesCollection.isPublishedField, "==", true)
      )
    );
    expect(getDocsMock).toHaveBeenCalledWith(
      query(
        collection(firebaseService["firestore"], nibblesCollection.name),
        where(nibblesCollection.isPublishedField, "==", true)
      )
    );

    expect(refMock).toHaveBeenCalledTimes(2 * (bytes.length + nibbles.length));
    expect(getDocMock).toHaveBeenCalledTimes(bytes.length);

    for (const byte of bytes) {
      expect(refMock).toHaveBeenCalledWith(
        firebaseService["storage"],
        byte.thumbnail
      );
      expect(refMock).toHaveBeenCalledWith(
        firebaseService["storage"],
        byte.coverPhoto
      );

      expect(getDocMock).toHaveBeenCalledWith(byte.series.title);
    }

    for (const nibble of nibbles) {
      expect(refMock).toHaveBeenCalledWith(
        firebaseService["storage"],
        nibble.thumbnail
      );
      expect(refMock).toHaveBeenCalledWith(
        firebaseService["storage"],
        nibble.coverPhoto
      );
    }

    expect(getDownloadURLMock).toHaveBeenCalledTimes(
      2 * (bytes.length + nibbles.length)
    );
    for (const storageMock of byteStorageMocks) {
      expect(getDownloadURLMock).toHaveBeenCalledWith(storageMock.thumbnail);
      expect(getDownloadURLMock).toHaveBeenCalledWith(storageMock.coverPhoto);
    }

    for (const storageMock of nibbleStorageMocks) {
      expect(getDownloadURLMock).toHaveBeenCalledWith(storageMock.thumbnail);
      expect(getDownloadURLMock).toHaveBeenCalledWith(storageMock.coverPhoto);
    }

    expect(_.isEqual(expectedBytes, firebaseService["bytes"]));

    expect(_.isEqual(expectedNibbles, firebaseService["nibbles"]));
  });

  it("should list bytes", async () => {
    const firebaseService: FirebaseService = new (FirebaseService as any)();
    firebaseService["bytes"] = bytes;

    const bytesOverviews: ByteOverview[] = await firebaseService.listBytes();

    expect(bytesOverviews).toEqual(
      bytes.map(
        (byte): ByteOverview => ({
          title: byte.title,
          subtitle: byte.subtitle,
          series: byte.series,
          thumbnail: byte.thumbnail,
          publishDate: byte.publishDate,
          slug: byte.slug,
        })
      )
    );
  });

  it("should list nibbles", async () => {
    const firebaseService: FirebaseService = new (FirebaseService as any)();
    firebaseService["nibbles"] = nibbles;

    const nibbleOverviews: NibbleOverview[] =
      await firebaseService.listNibbles();

    expect(nibbleOverviews).toEqual(
      nibbles.map(
        (nibble): NibbleOverview => ({
          title: nibble.title,
          thumbnail: nibble.thumbnail,
          coverPhoto: nibble.coverPhoto,
          slug: nibble.slug,
          publishDate: nibble.publishDate,
          timeTakenMinutes: nibble.timeTakenMinutes,
        })
      )
    );
  });

  it("should get bytes", async () => {
    const firebaseService: FirebaseService = new (FirebaseService as any)();
    firebaseService["bytes"] = bytes;

    const byte: Byte | undefined = firebaseService.getByte(bytes[1].slug);

    expect(byte).toEqual(bytes[1]);
  });

  it("should get nibbles", async () => {
    const firebaseService: FirebaseService = new (FirebaseService as any)();
    firebaseService["nibbles"] = nibbles;

    const nibble: Nibble | undefined = firebaseService.getNibble(
      nibbles[1].slug
    );

    expect(nibble).toEqual(nibbles[1]);
  });

  it("should get byte slugs", async () => {
    const firebaseService: FirebaseService = new (FirebaseService as any)();
    firebaseService["bytes"] = bytes;

    const slugs: string[] = firebaseService.getByteSlugs();

    expect(slugs.length).toEqual(bytes.length);
    for (const slug of slugs) {
      expect(bytes.find((byte) => byte.slug === slug)).toBeDefined();
    }
  });

  it("should get nibble slugs", async () => {
    const firebaseService: FirebaseService = new (FirebaseService as any)();
    firebaseService["nibbles"] = nibbles;

    const slugs: string[] = firebaseService.getNibbleSlugs();

    expect(slugs.length).toEqual(nibbles.length);
    for (const slug of slugs) {
      expect(nibbles.find((nibble) => nibble.slug === slug)).toBeDefined();
    }
  });
});
