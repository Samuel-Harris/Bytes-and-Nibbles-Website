import { FirebaseApp, initializeApp } from "firebase/app";
import {
  DocumentData,
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
import {
  ByteOverviewType,
  firebaseConfig,
  NibbleOverviewType,
} from "@bytes-and-nibbles/shared";
import { bytesCollection, nibblesCollection } from "./collectionConstants";
import _ from "lodash";
import { ByteSchema, NibbleSchema } from "@bytes-and-nibbles/shared";

function storageRef(): StorageReference {
  return {} as StorageReference;
}

vi.mock("firebase/app");
vi.mock("firebase/firestore");
vi.mock("firebase/storage");

const bytes: ByteSchema[] = [
  {
    title: "My title 1",
    subtitle: "My subtitle 1",
    series: { title: "My series 1", accentColour: "#ac3Ef" },
    slug: "my-slug-1",
    thumbnail: "My thumbnail 1",
    coverPhoto: "My cover photo 1",
    isPublished: true,
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
    isPublished: true,
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

const nibbles: NibbleSchema[] = [
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
    // @ts-expect-error - accessing private static property for testing
    FirebaseService["instance"] = undefined;

    vi.clearAllMocks();
  });

  it("should initialise a connection to firebase and fetch all bytes on instantiation", async () => {
    const appMock: FirebaseApp = ({} as FirebaseApp);
    const initializeAppMock = vi.mocked(initializeApp);
    initializeAppMock.mockReturnValue(appMock);

    const getDocMock = vi.mocked(getDoc);
    // @ts-expect-error - mocking implementation with different signature
    getDocMock.mockImplementation((series) => ({ data: () => series }));

    const rawBytes = bytes.map((byte: ByteSchema) => ({
      ...byte,
      publishDate: new Timestamp(byte.publishDate.getUTCSeconds(), 0),
      lastModifiedDate: new Timestamp(byte.lastModifiedDate.getUTCSeconds(), 0),
    }));

    const rawNibbles = nibbles.map((nibble: NibbleSchema) => ({
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
        thumbnail: storageRef(),
        coverPhoto: storageRef(),
      });
    }

    const nibbleStorageMocks: {
      thumbnail: StorageReference;
      coverPhoto: StorageReference;
    }[] = [];
    for (let i = 0; i < nibbles.length; i++) {
      nibbleStorageMocks.push({
        thumbnail: storageRef(),
        coverPhoto: storageRef(),
      });
    }

    const refMock = vi.mocked(ref);
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

      return storageRef();
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

    const getDownloadURLMock = vi.mocked(getDownloadURL);
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
          metadata: vi.fn(),
          exists: vi.fn(),
          get: vi.fn(),
          id: vi.fn(),
          ref: vi.fn(),
        };
      }),
    };

    const nibblesResponseMock = {
      docs: rawNibbles.map((nibble) => {
        return {
          data: () => nibble,
          metadata: vi.fn(),
          exists: vi.fn(),
          get: vi.fn(),
          id: vi.fn(),
          ref: vi.fn(),
        };
      }),
    };

    const getDocsMock = vi.mocked(getDocs);
    getDocsMock.mockResolvedValueOnce(
      bytesResponseMock as unknown as QuerySnapshot<DocumentData, DocumentData>
    );
    getDocsMock.mockResolvedValueOnce(
      nibblesResponseMock as unknown as QuerySnapshot<
        DocumentData,
        DocumentData
      >
    );

    const firebaseService: FirebaseService =
      await FirebaseService.getInstance();

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

      expect(getDocMock).toHaveBeenCalledWith(byte.series);
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

  it("should resolve captioned image storage paths in nested section, subsection, subsubsection, and collapsible group bodies", async () => {
    const nestedPaths = {
      section: "images/section-cap.png",
      subsection: "images/subsection-cap.png",
      subsubsection: "images/subsubsection-cap.png",
      group: "images/collapsible-group-cap.png",
    };

    const nestedByte: ByteSchema = {
      ...bytes[0],
      slug: "nested-cap-slug",
      sections: [
        {
          title: "Outer section",
          body: [
            {
              type: "captionedImage",
              value: {
                image: nestedPaths.section,
                caption: "section cap",
              },
            },
            {
              type: "subsection",
              value: {
                title: "Subsection",
                isCollapsible: false,
                body: [
                  {
                    type: "captionedImage",
                    value: {
                      image: nestedPaths.subsection,
                      caption: "subsection cap",
                    },
                  },
                  {
                    type: "subsubsection",
                    value: {
                      title: "Subsubsection",
                      isCollapsible: false,
                      body: [
                        {
                          type: "captionedImage",
                          value: {
                            image: nestedPaths.subsubsection,
                            caption: "subsubsection cap",
                          },
                        },
                        {
                          type: "collapsibleGroup",
                          value: {
                            title: "Inner group",
                            body: [
                              {
                                type: "captionedImage",
                                value: {
                                  image: nestedPaths.group,
                                  caption: "group cap",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const appMock: FirebaseApp = ({} as FirebaseApp);
    const initializeAppMock = vi.mocked(initializeApp);
    initializeAppMock.mockReturnValue(appMock);

    const getDocMock = vi.mocked(getDoc);
    // @ts-expect-error - mocking implementation with different signature
    getDocMock.mockImplementation((series) => ({ data: () => series }));

    const rawNested = {
      ...nestedByte,
      publishDate: new Timestamp(nestedByte.publishDate.getUTCSeconds(), 0),
      lastModifiedDate: new Timestamp(
        nestedByte.lastModifiedDate.getUTCSeconds(),
        0
      ),
    };

    const byteStorageMocks: {
      thumbnail: StorageReference;
      coverPhoto: StorageReference;
    } = {
      thumbnail: storageRef(),
      coverPhoto: storageRef(),
    };

    const nestedImageRefs: Record<string, StorageReference> = {
      [nestedPaths.section]: storageRef(),
      [nestedPaths.subsection]: storageRef(),
      [nestedPaths.subsubsection]: storageRef(),
      [nestedPaths.group]: storageRef(),
    };

    const refMock = vi.mocked(ref);
    refMock.mockImplementation((_storage, path) => {
      if (path === nestedByte.thumbnail) {
        return byteStorageMocks.thumbnail;
      }
      if (path === nestedByte.coverPhoto) {
        return byteStorageMocks.coverPhoto;
      }
      const nestedRef = nestedImageRefs[path as string];
      if (nestedRef) {
        return nestedRef;
      }
      return storageRef();
    });

    const getDownloadURLMock = vi.mocked(getDownloadURL);
    getDownloadURLMock.mockImplementation(
      (storageRef) =>
        new Promise((resolve): void => {
          if (storageRef === byteStorageMocks.thumbnail) {
            resolve(`Download url ${nestedByte.title} ${nestedByte.thumbnail}`);
          } else if (storageRef === byteStorageMocks.coverPhoto) {
            resolve(`Download url ${nestedByte.title} ${nestedByte.coverPhoto}`);
          } else {
            for (const [p, r] of Object.entries(nestedImageRefs)) {
              if (storageRef === r) {
                resolve(`resolved-body-url:${p}`);
                return;
              }
            }
            resolve("Invalid ref");
          }
        })
    );

    const bytesResponseMock = {
      docs: [
        {
          data: () => rawNested,
          metadata: vi.fn(),
          exists: vi.fn(),
          get: vi.fn(),
          id: vi.fn(),
          ref: vi.fn(),
        },
      ],
    };

    const nibblesResponseMock = {
      docs: nibbles.map((nibble) => ({
        data: () => ({
          ...nibble,
          publishDate: new Timestamp(nibble.publishDate.getUTCSeconds(), 0),
          lastModifiedDate: new Timestamp(
            nibble.lastModifiedDate.getUTCSeconds(),
            0
          ),
        }),
        metadata: vi.fn(),
        exists: vi.fn(),
        get: vi.fn(),
        id: vi.fn(),
        ref: vi.fn(),
      })),
    };

    const getDocsMock = vi.mocked(getDocs);
    getDocsMock.mockResolvedValueOnce(
      bytesResponseMock as unknown as QuerySnapshot<DocumentData, DocumentData>
    );
    getDocsMock.mockResolvedValueOnce(
      nibblesResponseMock as unknown as QuerySnapshot<
        DocumentData,
        DocumentData
      >
    );

    const firebaseService: FirebaseService =
      await FirebaseService.getInstance();

    const stored = firebaseService["bytes"].find(
      (b) => b.slug === nestedByte.slug
    );
    expect(stored).toBeDefined();
    const sectionBody = stored!.sections[0].body;

    expect(sectionBody[0].type).toBe("captionedImage");
    if (sectionBody[0].type === "captionedImage") {
      expect(sectionBody[0].value.image).toBe(
        `resolved-body-url:${nestedPaths.section}`
      );
    }

    const subsection = sectionBody[1];
    expect(subsection.type).toBe("subsection");
    if (subsection.type !== "subsection") {
      throw new Error("expected subsection");
    }

    expect(subsection.value.body[0].type).toBe("captionedImage");
    if (subsection.value.body[0].type === "captionedImage") {
      expect(subsection.value.body[0].value.image).toBe(
        `resolved-body-url:${nestedPaths.subsection}`
      );
    }

    const subsub = subsection.value.body[1];
    expect(subsub.type).toBe("subsubsection");
    if (subsub.type !== "subsubsection") {
      throw new Error("expected subsubsection");
    }

    expect(subsub.value.body[0].type).toBe("captionedImage");
    if (subsub.value.body[0].type === "captionedImage") {
      expect(subsub.value.body[0].value.image).toBe(
        `resolved-body-url:${nestedPaths.subsubsection}`
      );
    }

    const group = subsub.value.body[1];
    expect(group.type).toBe("collapsibleGroup");
    if (group.type !== "collapsibleGroup") {
      throw new Error("expected collapsible group");
    }

    expect(group.value.body[0].type).toBe("captionedImage");
    if (group.value.body[0].type === "captionedImage") {
      expect(group.value.body[0].value.image).toBe(
        `resolved-body-url:${nestedPaths.group}`
      );
    }

    expect(getDownloadURLMock).toHaveBeenCalledWith(
      nestedImageRefs[nestedPaths.section]
    );
    expect(getDownloadURLMock).toHaveBeenCalledWith(
      nestedImageRefs[nestedPaths.subsection]
    );
    expect(getDownloadURLMock).toHaveBeenCalledWith(
      nestedImageRefs[nestedPaths.subsubsection]
    );
    expect(getDownloadURLMock).toHaveBeenCalledWith(
      nestedImageRefs[nestedPaths.group]
    );
  });

  it("should list bytes", async () => {
    const firebaseService = Object.create(FirebaseService.prototype) as FirebaseService;
    firebaseService["bytes"] = bytes;

    const bytesOverviews: ByteOverviewType[] =
      await firebaseService.listBytes();

    expect(bytesOverviews).toEqual(
      bytes.map(
        (byte): ByteOverviewType => ({
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
    const firebaseService = Object.create(FirebaseService.prototype) as FirebaseService;
    firebaseService["nibbles"] = nibbles;

    const nibbleOverviews: NibbleOverviewType[] =
      await firebaseService.listNibbles();

    expect(nibbleOverviews).toEqual(
      nibbles.map(
        (nibble): NibbleOverviewType => ({
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
    const firebaseService = Object.create(FirebaseService.prototype) as FirebaseService;
    firebaseService["bytes"] = bytes;

    const byte: ByteSchema | undefined = firebaseService.getByte(bytes[1].slug);

    expect(byte).toEqual(bytes[1]);
  });

  it("should get nibbles", async () => {
    const firebaseService = Object.create(FirebaseService.prototype) as FirebaseService;
    firebaseService["nibbles"] = nibbles;

    const nibble: NibbleSchema | undefined = firebaseService.getNibble(
      nibbles[1].slug
    );

    expect(nibble).toEqual(nibbles[1]);
  });

  it("should get byte slugs", async () => {
    const firebaseService = Object.create(FirebaseService.prototype) as FirebaseService;
    firebaseService["bytes"] = bytes;

    const slugs: string[] = firebaseService.getByteSlugs();

    expect(slugs.length).toEqual(bytes.length);
    for (const slug of slugs) {
      expect(bytes.find((byte) => byte.slug === slug)).toBeDefined();
    }
  });

  it("should get nibble slugs", async () => {
    const firebaseService = Object.create(FirebaseService.prototype) as FirebaseService;
    firebaseService["nibbles"] = nibbles;

    const slugs: string[] = firebaseService.getNibbleSlugs();

    expect(slugs.length).toEqual(nibbles.length);
    for (const slug of slugs) {
      expect(nibbles.find((nibble) => nibble.slug === slug)).toBeDefined();
    }
  });
});
