import React from "react";
import { useStorageState } from "./useStorageState";
import api from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AuthContext = React.createContext<{
  signIn: (username: [], private_key: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

interface UserAuth {
  username: string;
  token: string;
}
// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState(
    JSON.stringify(null)
  );
  return (
    <AuthContext.Provider
      value={{
        signIn: async (username, private_key) => {
          // Add your login logic here
          // For example purposes, we'll just set a fake session in storage
          //This likely would be a JWT token or other session data
          console.log(username, "fggdfgd");
          try {
            await AsyncStorage.setItem("@private_key", private_key);

            console.log("saved");
          } catch (e) {
            console.error("Error saving data", e);
          }

          setSession(JSON.stringify(username));
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
