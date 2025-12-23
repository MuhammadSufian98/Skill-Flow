"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Trophy, Clock } from "lucide-react";
import IntroPortalSection from "@/components/IntroSection";

const features = [
  {
    Icon: BookOpen,
    label: "Choose Your Topic",
    glow: "from-cyan-400/35 via-purple-500/15 to-transparent",
  },
  {
    Icon: Clock,
    label: "Challenge Yourself",
    glow: "from-purple-500/30 via-pink-500/15 to-transparent",
  },
  {
    Icon: Trophy,
    label: "Track Your Progress",
    glow: "from-pink-500/30 via-cyan-400/15 to-transparent",
  },
];

export default function Home() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative min-h-screen px-4 pt-24">
        <div className="mx-auto max-w-6xl space-y-10">
          {/* HERO */}
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
            <div className="h-10 w-[70%] rounded-lg bg-white/10 sf-skeleton" />
            <div className="h-4 w-[85%] rounded bg-white/10 sf-skeleton" />
            <div className="h-4 w-[60%] rounded bg-white/10 sf-skeleton" />
            <div className="mt-6 h-12 w-44 rounded-xl bg-white/15 sf-skeleton" />
          </div>

          {/* FEATURE CARDS */}
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative h-40 rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="absolute inset-0 sf-skeleton opacity-70" />
              </div>
            ))}
          </div>

          {/* CONTENT BLOCK */}
          <div className="mx-auto max-w-4xl space-y-3">
            <div className="h-5 w-[40%] rounded bg-white/10 sf-skeleton" />
            <div className="h-4 w-full rounded bg-white/10 sf-skeleton" />
            <div className="h-4 w-[92%] rounded bg-white/10 sf-skeleton" />
            <div className="h-4 w-[88%] rounded bg-white/10 sf-skeleton" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="relative flex min-h-[510px] flex-col items-center justify-center px-4 text-center">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">
            Master New Skills with Skill Flow
          </h1>

          <p className="mt-4 text-base text-white/70 md:text-lg">
            Practice quizzes, study smarter, and track your learning progress —
            all in one place.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className={[
              "mt-10 w-full max-w-xs rounded-lg",
              "bg-linear-to-r from-cyan-400 to-purple-500",
              "bg-size-[200%_200%] bg-left",
              "px-6 py-3 text-lg font-semibold text-white",
              "transition-all duration-500 ease-out",
              "hover:bg-right hover:scale-[1.03]",
              "active:scale-[0.97]",
              "cursor-pointer drop-shadow-lg",
            ].join(" ")}
          >
            Get Started
          </button>
        </div>
      </main>

      <section className="relative z-10 mx-auto w-full px-4">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/25 via-indigo-600/30 to-fuchsia-500/25" />
          <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-80" />

          <div className="relative flex flex-col items-center justify-center gap-4 p-6 sm:p-8 md:flex-row md:items-stretch md:gap-5 md:p-10">
            {features.map(({ Icon, label, glow }) => (
              <div
                key={label}
                className={[
                  "group relative overflow-hidden rounded-2xl",
                  "border border-white/10 bg-white/5 backdrop-blur-xl",
                  "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                  "w-full max-w-[300px] md:max-w-none md:flex-1",
                  "px-6 py-7",
                ].join(" ")}
              >
                <div
                  className={[
                    "pointer-events-none absolute inset-0 opacity-80",
                    "bg-linear-to-br",
                    glow,
                    "blur-2xl",
                    "transition-opacity duration-500",
                    "group-hover:opacity-100",
                  ].join(" ")}
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-70" />

                <div className="relative flex h-full flex-col items-center justify-center gap-3 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5">
                    <Icon className="h-7 w-7 text-white/85" strokeWidth={1.8} />
                  </div>
                  <p className="text-sm font-medium text-white/80">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <IntroPortalSection />
    </>
  );
}
