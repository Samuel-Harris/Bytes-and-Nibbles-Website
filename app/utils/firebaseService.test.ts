import { FirebaseApp, initializeApp } from "firebase/app";
import { mock } from "jest-mock-extended";
import { mocked } from "jest-mock";
import { getDocs, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import FirebaseService from "./firebaseService";
import { firebaseConfig } from "./firebaseConstants";
import { ByteOverview } from "./Byte";

jest.mock("firebase/app");
jest.mock("firebase/firestore");
jest.mock("firebase/storage");

describe("Firebase service", () => {
  it("should initialise a connection to firebase on instantiation", () => {
    const appMock = mock<FirebaseApp>();
    const initializeAppMock = mocked(initializeApp);
    initializeAppMock.mockReturnValue(appMock);

    const firebaseService = FirebaseService.getInstance();

    expect(firebaseService).toBeInstanceOf(FirebaseService);

    expect(initializeAppMock).toHaveBeenCalledTimes(1);
    expect(initializeAppMock).toHaveBeenCalledWith(firebaseConfig);

    expect(getFirestore).toHaveBeenCalledTimes(1);
    expect(getFirestore).toHaveBeenCalledWith(appMock);

    expect(getStorage).toHaveBeenCalledTimes(1);
    expect(getStorage).toHaveBeenCalledWith(appMock);
  });

  it("should not initialise multiple firebase services", () => {
    const firebaseService1 = FirebaseService.getInstance();
    const firebaseService2 = FirebaseService.getInstance();

    expect(firebaseService1).toBeInstanceOf(FirebaseService);
    expect(firebaseService2).toBeInstanceOf(FirebaseService);
    expect(firebaseService1).toBe(firebaseService2);

    expect(initializeApp).toHaveBeenCalledTimes(1);

    expect(getFirestore).toHaveBeenCalledTimes(1);

    expect(getStorage).toHaveBeenCalledTimes(1);
  });

  it("should list bytes when they have already been fetched", async () => {
    const firebaseService = FirebaseService.getInstance();
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
