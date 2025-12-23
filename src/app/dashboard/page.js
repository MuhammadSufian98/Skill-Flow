"use client";

import React, { useMemo } from "react";
import {
  Home,
  BookOpen,
  HelpCircle,
  Trophy,
  User,
  Settings,
} from "lucide-react";
import { SkillFlowLogo } from "@/components/SFlogo";

import SidebarItem from "@/components/dashboard/sidebarItem";

import HomeSection from "@/components/dashboard/MainSections/Home";
import StudySection from "@/components/dashboard/MainSections/Study";
import ScoreSection from "@/components/dashboard/MainSections/Score";
import QuizSection from "@/components/dashboard/MainSections/Quiz";
import ProfileSection from "@/components/dashboard/MainSections/Profile";
import SettingsSection from "@/components/dashboard/MainSections/Setting";

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

export default function DashboardPage() {
  const { active, setActive } = useGeneral();
  const { user } = useUserAuth();

  const content = useMemo(() => {
    if (active === "home") return <HomeSection />;
    if (active === "study") return <StudySection />;
    if (active === "quiz") return <QuizSection />;
    if (active === "score") return <ScoreSection />;
    if (active === "profile") return <ProfileSection />;
    return <SettingsSection />;
  }, [active]);

  const rank = levelRanks[user.level] ?? "Unknown Rank";

  return (
    <div className="relative z-10 min-h-dvh w-full">
      {/* Layout wrapper */}
      <div className="mx-auto flex h-dvh w-full max-w-6xl gap-4 px-3 py-3 md:px-6 md:py-4">
        {/* Sidebar (desktop) */}
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

        {/* Main Content */}
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl">
          {/* Important: min-h-0 allows inner scrolling correctly */}
          <div className="min-h-0 flex-1">{content}</div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
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
