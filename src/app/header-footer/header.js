"use client";

import React, { useEffect, useState } from "react";
import { SkillFlowLogo } from "@/components/SFlogo";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith("/auth") || pathname.startsWith("/dashboard")) {
    return null;
  }

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY;

      if (goingDown && y > 40) setHidden(true);
      else setHidden(false);

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "h-16 md:h-20",
        "transition-transform duration-300 ease-in-out",
        hidden ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 md:px-8">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <SkillFlowLogo className="h-8 w-8 md:h-10 md:w-10 shrink-0" />
          <span className="relative top-px text-xl md:text-2xl font-semibold leading-none bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Skill Flow
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
          <a className="hover:text-white transition-colors" href="#features">
            Features
          </a>
          <a className="hover:text-white transition-colors" href="#about">
            About
          </a>
          <a className="hover:text-white transition-colors" href="#pricing">
            Contact us
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/auth/login")}
            className="hidden sm:inline-flex rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition cursor-pointer drop-shadow-md"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/auth/signup")}
            className={[
              "rounded-lg",
              "bg-linear-to-r from-cyan-400 to-purple-500",
              "bg-size-[200%_200%] bg-left",
              "px-4 py-2 text-sm font-medium text-white",
              "transition-all duration-500 ease-out",
              "hover:bg-right hover:scale-[1.02]",
              "active:scale-[0.97]",
              "cursor-pointer drop-shadow-md",
            ].join(" ")}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-black/30 backdrop-blur-xl border-b border-white/10" />
    </header>
  );
}
