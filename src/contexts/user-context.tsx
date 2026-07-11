"use client";

import * as React from "react";
import { getMe, type UserMe } from "@/services/users";

interface UserContextValue {
  user: UserMe | null;
  setUser: (user: UserMe | null) => void;
}

const UserContext = React.createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserMe | null>(null);

  React.useEffect(() => {
    getMe().then(setUser).catch(console.error);
  }, []);

  const value = React.useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = React.useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
