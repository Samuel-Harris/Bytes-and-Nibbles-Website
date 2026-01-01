import { Authenticator, FirebaseCMSApp } from "firecms";

import { firebaseConfig } from "@bytes-and-nibbles/shared";
import { useCallback } from "react";
import { User } from "firebase/auth";
import { v1ByteCollection } from "./collections/v1_bytes";
import { v1ByteSeriesCollection } from "./collections/v1_byteSeries";
import { v1NibbleCollection } from "./collections/v1_nibbles";

export default function App() {
  const myAuthenticator: Authenticator<User> = useCallback(
    async ({ user, authController }) => {
      console.log("Allowing access to", user?.email);

      authController.setExtra(["admin"]);

      return true;
    },
    []
  );

  return (
    <FirebaseCMSApp
      name={"Bytes and Nibbles CMS"}
      plugins={[]}
      authentication={myAuthenticator}
      collections={[
        v1ByteCollection,
        v1ByteSeriesCollection,
        v1NibbleCollection,
      ]}
      firebaseConfig={firebaseConfig as Record<string, unknown>}
      logo={"/logo.png"}
    />
  );
}
