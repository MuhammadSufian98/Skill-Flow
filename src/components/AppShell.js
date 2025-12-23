"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/header-footer/header";
import Footer from "@/app/header-footer/footer";

const HEADER_PADDING_PREFIXES = ["/"];

const HIDE_HEADER_PREFIXES = ["/auth"];
const HIDE_FOOTER_PREFIXES = ["/auth", "/dashboard"];

export default function AppShell({ children }) {
  const pathname = usePathname();

  const hideHeader = HIDE_HEADER_PREFIXES.some((p) => pathname.startsWith(p));
  const hideFooter = HIDE_FOOTER_PREFIXES.some((p) => pathname.startsWith(p));

  const padForHeader =
    !hideHeader &&
    HEADER_PADDING_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );

  return (
    <>
      {!hideHeader && <Header />}
      <main
        className={["relative z-10", padForHeader ? "pt-16 md:pt-20" : ""].join(
          " "
        )}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}
