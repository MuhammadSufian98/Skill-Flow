"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  HelpCircle,
  Trophy,
  User,
  Settings,
  ChevronRight,
} from "lucide-react";
import { SkillFlowLogo } from "@/components/SFlogo";

import SidebarItem from "@/components/dashboard/sidebarItem";

import "../globals.css";

import HomeSection from "@/components/dashboard/MainSections/Home";
import StudySection from "@/components/dashboard/MainSections/Study";
import ScoreSection from "@/components/dashboard/MainSections/Score";
import QuizSection from "@/components/dashboard/MainSections/Quiz";
import ProfileSection from "@/components/dashboard/MainSections/Profile";
import SettingsSection from "@/components/dashboard/MainSections/Setting";

import { fetchSections, getProgress } from "@/utils/sectionsApi";

import { useGeneral } from "@/context/generalContext";
import { useUserAuth } from "@/context/userAuthContext";

const levelRanks = {
  0: "Newcomer",
  1: "Curious Beginner",
  2: "Early Explorer",
  3: "Motivated Learner",
  4: "Consistent Student",
  5: "Focused Learner",
  6: "Skilled Thinker",
  7: "Advanced Explorer",
  8: "Knowledge Builder",
  9: "Expert Learner",
  10: "Master Strategist",
};

// This is the default export of the page component
export default function DashboardPage() {
  const { active, setActive, sections, setSections, setProgressMap } =
    useGeneral();

  const { user } = useUserAuth();
  const router = useRouter();

  const fetchedStudyRef = useRef(false);

  // Add loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const hasData = Array.isArray(sections) && sections.length > 0;
      if (fetchedStudyRef.current) return;

      fetchedStudyRef.current = true;

      try {
        let payload = hasData ? sections : [];
        if (!hasData) {
          const data = await fetchSections();
          payload = Array.isArray(data?.topics) ? data.topics : [];
          setSections(payload);
          console.log("Fetched sections:", payload);
        }

        const ids = payload
          .flatMap((t) => {
            const a = Array.isArray(t?.sections) ? t.sections : [];
            const b = Array.isArray(t?.materials) ? t.materials : [];
            return [...a, ...b];
          })
          .map((m) => String(m?._id || m?.id || "")) // Added fallback for m?.id
          .filter(Boolean);

        const uniqueIds = Array.from(new Set(ids));

        if (!uniqueIds.length) {
          setProgressMap({});
          setLoading(false); // Set loading to false after data is fetched
          return;
        }

        const results = await Promise.allSettled(
          uniqueIds.map((mid) => getProgress(mid))
        );

        const progressMap = {};
        results.forEach((r, idx) => {
          if (r.status === "fulfilled" && r.value) {
            progressMap[uniqueIds[idx]] = r.value;
          } else {
            progressMap[uniqueIds[idx]] = null;
          }
        });

        // Merge the progress into the sections data
        const mergedSections = payload.map((topic) => ({
          ...topic,
          sections: (Array.isArray(topic.sections) ? topic.sections : []).map(
            (section) => {
              const sectionProgress = progressMap[section._id] || 0;
              const quizUnlocked =
                sectionProgress >= (section.quiz?.unlockAtProgress || 0);
              return {
                ...section,
                progress: sectionProgress,
                quizUnlocked, // Add quizUnlocked flag based on progress
              };
            }
          ),
        }));

        setSections(mergedSections); // Update sections with progress and quizUnlocked
        console.log(
          JSON.stringify(
            {
              message: "Merged sections with progress",
              mergedSections: mergedSections,
              // progressMap: progressMap,
            },
            null,
            2
          )
        );
        setProgressMap(progressMap); // Store progress map for future reference
        setLoading(false); // Set loading to false after data is fetched
      } catch (e) {
        fetchedStudyRef.current = false;
        setLoading(false); // Set loading to false in case of error
      }
    };

    load();
  }, [sections, setSections, setProgressMap]);

  const rank = levelRanks[user.level] ?? "Unknown Rank";

  return (
    <div className="relative z-10 min-h-dvh w-full">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="flex w-full mx-auto h-dvh max-w-6xl gap-4 px-3 py-3 md:px-6 md:py-4">
            {/* Sidebar loader */}
            <div className="w-[280px] shrink-0 flex-col animate-pulse bg-black/35 rounded-2xl mr-4 p-4">
              <div className="h-10 w-32 bg-linear-to-br from-cyan-400/25 via-purple-600/35 to-pink-500/25 rounded-md mb-4"></div>
              <div className="h-4 w-24 bg-linear-to-br from-cyan-400/25 via-purple-600/35 to-pink-500/25 rounded-md mb-2"></div>
              <div className="space-y-2">
                <div className="h-12 w-full bg-linear-to-br from-cyan-400/10 via-purple-600/10 to-pink-500/10 rounded-md"></div>
                <div className="h-12 w-full bg-linear-to-br from-cyan-400/10 via-purple-600/10 to-pink-500/10 rounded-md"></div>
                <div className="h-12 w-full bg-linear-to-br from-cyan-400/10 via-purple-600/10 to-pink-500/10 rounded-md"></div>
              </div>
            </div>

            {/* Content loader */}
            <div className="flex-1 bg-black/35 animate-pulse rounded-2xl p-4">
              <div className="h-10 w-40 bg-linear-to-br from-cyan-400/25 via-purple-600/35 to-pink-500/25 rounded-md mb-4"></div>
              <div className="space-y-4">
                {/* Skeleton boxes */}
                <div className="h-8 w-3/4 bg-linear-to-br from-cyan-400/10 via-purple-600/10 to-pink-500/10 rounded-md"></div>
                <div className="h-8 w-3/4 bg-linear-to-br from-cyan-400/10 via-purple-600/10 to-pink-500/10 rounded-md"></div>
                <div className="h-8 w-3/4 bg-linear-to-br from-cyan-400/10 via-purple-600/10 to-pink-500/10 rounded-md"></div>
                <div className="h-8 w-3/4 bg-linear-to-br from-cyan-400/10 via-purple-600/10 to-pink-500/10 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex h-dvh w-full max-w-6xl gap-4 px-3 py-3 md:px-6 md:py-4">
          <aside className="hidden h-full w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl md:flex">
            <div className="shrink-0 border-b border-white/10 px-4 py-4">
              <div className="text-sm font-semibold text-white">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  <SkillFlowLogo className="h-8 w-8 md:h-10 md:w-10 shrink-0" />
                  <span className="relative top-px text-xl md:text-2xl font-semibold leading-none bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Skill Flow
                  </span>
                </div>
              </div>
              <div className="mt-1 text-xs text-white/70">
                {user.name} • {rank}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
              <div className="space-y-2">
                <SidebarItem
                  active={active === "home"}
                  icon={Home}
                  label="Home"
                  onClick={() => setActive("home")}
                />
                <SidebarItem
                  active={active === "study"}
                  icon={BookOpen}
                  label="Study"
                  onClick={() => setActive("study")}
                />
                <SidebarItem
                  active={active === "quiz"}
                  icon={HelpCircle}
                  label="Quiz"
                  onClick={() => setActive("quiz")}
                />
                <SidebarItem
                  active={active === "score"}
                  icon={Trophy}
                  label="Score"
                  onClick={() => setActive("score")}
                />
                <SidebarItem
                  active={active === "profile"}
                  icon={User}
                  label="Profile"
                  onClick={() => setActive("profile")}
                />
                <SidebarItem
                  active={active === "settings"}
                  icon={Settings}
                  label="Settings"
                  onClick={() => setActive("settings")}
                />
              </div>
            </div>
          </aside>

          <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl">
            <div className="min-h-0 flex-1">
              {active === "home" && <HomeSection />}
              {active === "study" && <StudySection />}
              {active === "quiz" && <QuizSection />}
              {active === "score" && <ScoreSection />}
              {active === "profile" && <ProfileSection />}
              {active === "settings" && <SettingsSection />}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/60 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2">
          {[
            { key: "home", icon: Home, label: "Home" },
            { key: "study", icon: BookOpen, label: "Study" },
            { key: "quiz", icon: HelpCircle, label: "Quiz" },
            { key: "score", icon: Trophy, label: "Score" },
            { key: "profile", icon: User, label: "Profile" },
            { key: "settings", icon: Settings, label: "Settings" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={[
                "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition",
                active === key
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
              <span className="leading-none">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="h-16 md:hidden" />
    </div>
  );
}
