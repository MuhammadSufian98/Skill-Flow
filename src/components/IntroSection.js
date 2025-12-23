"use client";

import React, { useMemo, useState } from "react";
import {
  BookOpen,
  NotebookPen,
  Brain,
  GraduationCap,
  Sparkles,
  Trophy,
  Clock,
} from "lucide-react";

const ICONS = [
  BookOpen,
  NotebookPen,
  Brain,
  GraduationCap,
  Trophy,
  Clock,
  Sparkles,
];

const SAFE_BOX = { x1: 24, x2: 76, y1: 20, y2: 80 };

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function randomPointOutsideSafe() {
  for (let tries = 0; tries < 300; tries++) {
    const x = rand(6, 94);
    const y = rand(8, 92);
    const inside =
      x >= SAFE_BOX.x1 &&
      x <= SAFE_BOX.x2 &&
      y >= SAFE_BOX.y1 &&
      y <= SAFE_BOX.y2;
    if (!inside) return { x, y };
  }
  return { x: 8, y: 10 };
}

function oppositePoint(p) {
  const ox = 100 - p.x;
  const oy = 100 - p.y;

  const clamped = {
    x: Math.min(94, Math.max(6, ox)),
    y: Math.min(92, Math.max(8, oy)),
  };

  const inside =
    clamped.x >= SAFE_BOX.x1 &&
    clamped.x <= SAFE_BOX.x2 &&
    clamped.y >= SAFE_BOX.y1 &&
    clamped.y <= SAFE_BOX.y2;

  if (!inside) return clamped;
  return randomPointOutsideSafe();
}

export default function IntroPortalSection() {
  const items = useMemo(() => {
    const base = [
      { Icon: BookOpen, r: -10, d: 0 },
      { Icon: NotebookPen, r: 14, d: 180 },
      { Icon: Brain, r: 8, d: 320 },
      { Icon: GraduationCap, r: -14, d: 420 },
      { Icon: Trophy, r: 18, d: 90 },
      { Icon: Clock, r: -18, d: 260 },
      { Icon: Sparkles, r: 10, d: 140 },
    ].map((it) => {
      const a = randomPointOutsideSafe();
      const b = oppositePoint(a);
      return { ...it, a, b };
    });

    const extras = Array.from({ length: 6 }).map((_, i) => {
      const Icon = ICONS[(i + 1) % ICONS.length];
      const a = randomPointOutsideSafe();
      const b = oppositePoint(a);
      const r = rand(-22, 22);
      return { Icon, a, b, r, d: i * 120 };
    });

    return [...base, ...extras];
  }, []);

  const [pos, setPos] = useState(() => items.map(() => "a"));
  const [fading, setFading] = useState(() => items.map(() => false));

  const teleport = (idx) => {
    setFading((p) => p.map((v, i) => (i === idx ? true : v)));

    window.setTimeout(() => {
      setPos((p) => p.map((v, i) => (i === idx ? (v === "a" ? "b" : "a") : v)));
    }, 180);

    window.setTimeout(() => {
      setFading((p) => p.map((v, i) => (i === idx ? false : v)));
    }, 260);
  };

  return (
    <section className="relative mt-20 mb-10">
      <div className="relative mx-auto w-full overflow-hidden bg-black/55 backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/60 via-purple-600/55 to-pink-500/60" />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/35" />

        <div className="relative px-6 py-14 text-center sm:px-10 md:px-16">
          <div className="absolute inset-0 z-20">
            {items.map(({ Icon, a, b, r, d }, i) => {
              const p = pos[i] === "a" ? a : b;

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: `translate(-50%, -50%) rotate(${r}deg)`,
                    animationDelay: `${d}ms`,
                  }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => teleport(i)}
                    className={[
                      "grid h-12 w-12 place-items-center rounded-2xl",
                      "border border-white/20 bg-white/10",
                      "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                      "transition-all duration-200",
                      "hover:scale-110",
                      fading[i] ? "opacity-0" : "opacity-100",
                      "icon-float",
                    ].join(" ")}
                    aria-label="decorative icon"
                  >
                    <Icon className="h-6 w-6 text-white" strokeWidth={1.8} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="absolute left-1/2 top-1/2 z-15 h-[72%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-3xl md:h-[66%] md:w-[70%]" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
              Your personal study portal
            </div>

            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
              Study smarter with Skill Flow — notes, sections, and quizzes that
              unlock as you learn.
            </h2>

            <p className="mt-5 text-base text-white md:text-lg">
              Skill Flow is your space to study your way: save personal notes,
              organize content into sections, and unlock quizzes only after you
              complete each section. The more you study, the more quizzes you
              unlock — turning progress into momentum.
            </p>

            <p className="mt-4 text-base text-white md:text-lg">
              We’re building this into a true portal: soon you’ll be able to
              share your notes publicly, discover community study packs, and
              learn together — all in one place.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes floaty {
          0%,
          100% {
            transform: translateZ(0) translateY(0);
          }
          50% {
            transform: translateZ(0) translateY(-10px);
          }
        }
        .icon-float {
          animation: floaty 2.8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
