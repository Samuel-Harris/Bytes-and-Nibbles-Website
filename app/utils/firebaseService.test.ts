import { FirebaseApp, initializeApp } from "firebase/app";
import { mock } from "jest-mock-extended";
import { mocked } from "jest-mock";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import FirebaseService from "./firebaseService";
import { firebaseConfig } from "./firebaseConstants";

jest.mock("firebase/app");
jest.mock("firebase/firestore");
jest.mock("firebase/storage");

describe("Firebase service", () => {
    it("should initialise a connection to firebase on instantiation", () => {
        const initializeAppMock = mocked(initializeApp);
        const appMock = mock<FirebaseApp>();
        initializeAppMock.mockReturnValue(appMock);

        const getFirestoreMock = mocked(getFirestore);
        const getStorageMock = mocked(getStorage);

        const firebaseService = FirebaseService.getInstance();

        expect(firebaseService).toBeInstanceOf(FirebaseService);

        expect(initializeAppMock).toHaveBeenCalledTimes(1);
        expect(initializeAppMock).toHaveBeenCalledWith(firebaseConfig);

        expect(getFirestoreMock).toHaveBeenCalledTimes(1);
        expect(getFirestoreMock).toHaveBeenCalledWith(appMock);

        expect(getStorageMock).toHaveBeenCalledTimes(1);
        expect(getStorageMock).toHaveBeenCalledWith(appMock);
    })

    it("should not initialise multiple firebase services", () => {
        const initializeAppMock = mocked(initializeApp);

        const getFirestoreMock = mocked(getFirestore);
        const getStorageMock = mocked(getStorage);

        const firebaseService1 = FirebaseService.getInstance();
        const firebaseService2 = FirebaseService.getInstance();

        expect(firebaseService1).toBeInstanceOf(FirebaseService);
        expect(firebaseService2).toBeInstanceOf(FirebaseService);
        expect(firebaseService1).toBe(firebaseService2);

        expect(initializeAppMock).toHaveBeenCalledTimes(1);

        expect(getFirestoreMock).toHaveBeenCalledTimes(1);

        expect(getStorageMock).toHaveBeenCalledTimes(1);
    })
});