"use client";

import { GeneralProvider } from "@/context/generalContext";
import { UserAuthProvider } from "@/context/userAuthContext";

export default function Providers({ children }) {
  return (
    <UserAuthProvider>
      <GeneralProvider>{children}</GeneralProvider>
    </UserAuthProvider>
  );
}
