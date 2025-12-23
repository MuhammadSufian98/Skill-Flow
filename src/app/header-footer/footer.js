"use client";

import React from "react";
import Link from "next/link";
import { SkillFlowLogo } from "@/components/SFlogo";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/auth") || pathname.startsWith("/dashboard")) {
    return null;
  }
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-15">
      <div className="pointer-events-none absolute left-0 top-1/2 h-[55%] w-full -translate-y-1/2">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-400/12 via-purple-600/14 to-pink-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-linear-to-b from-white/6 via-transparent to-transparent opacity-70" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-12 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/55 backdrop-blur-xl">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/22 via-purple-600/20 to-pink-500/18" />
          <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/18 to-black/50" />

          <div className="relative grid gap-10 px-6 py-10 sm:px-10 md:grid-cols-12 md:px-12 md:py-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <SkillFlowLogo className="h-10 w-10 shrink-0" />
                <span className="text-2xl font-semibold leading-none bg-linear-to-r from-cyan-300 via-purple-400 to-pink-300 bg-clip-text text-transparent">
                  Skill Flow
                </span>
              </div>

              <p className="mt-4 text-white text-base leading-relaxed">
                Your personal quiz + study portal. Save notes, learn by
                sections, and unlock quizzes as you progress. Soon: share notes
                publicly and discover community study packs.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12">
                  <Sparkles className="h-4 w-4" />
                  Build a streak
                </a>
                <a className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12">
                  <ArrowRight className="h-4 w-4" />
                  Start learning
                </a>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-8 sm:grid-cols-3">
                {[
                  {
                    title: "Product",
                    links: ["Features", "How it works", "Get started"],
                  },
                  {
                    title: "Company",
                    links: ["About", "Contact", "Roadmap"],
                  },
                  {
                    title: "Legal",
                    links: [
                      "Privacy Policy",
                      "Terms of Service",
                      "Cookie Policy",
                    ],
                  },
                ].map((col) => (
                  <div key={col.title}>
                    <p className="text-sm font-semibold text-white">
                      {col.title}
                    </p>
                    <ul className="mt-4 space-y-3 text-sm text-white">
                      {col.links.map((l) => (
                        <li key={l}>
                          <Link className="hover:underline" href="#">
                            {l}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Stay in the loop
                    </p>
                    <p className="mt-1 text-sm text-white">
                      Updates on new quizzes, features & sharing.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex w-full max-w-md items-center gap-2"
                  >
                    <div className="flex w-full items-center gap-2 rounded-xl border border-white/14 bg-black/25 px-3 py-2">
                      <Mail className="h-4 w-4 text-white" />
                      <input
                        type="email"
                        placeholder="Your email"
                        className="w-full bg-transparent text-sm text-white placeholder:text-white/70 outline-none"
                      />
                    </div>
                    <button
                      className={[
                        "rounded-xl",
                        "bg-linear-to-r from-cyan-400 to-purple-500",
                        "bg-size-[200%_200%] bg-left",
                        "px-4 py-2 text-sm font-semibold text-white",
                        "transition-all duration-500 ease-out",
                        "hover:bg-right hover:scale-[1.03]",
                        "active:scale-[0.97]",
                        "drop-shadow-lg",
                      ].join(" ")}
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="md:col-span-12">
              <div className="mt-10 flex flex-col gap-4 border-t border-white/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-white">
                  © {year} Skill Flow. All rights reserved.
                </p>

                <div className="flex items-center gap-3">
                  {[Github, Twitter, Linkedin].map((Icon, i) => (
                    <a
                      key={i}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/14 bg-white/6 text-white transition hover:bg-white/10"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
