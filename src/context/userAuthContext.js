"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { me, logoutApi } from "@/utils/authApi";

const UserAuthContext = createContext(null);

const initialUser = () => ({
  name: "Ayaan Khan",
  email: "ayaan@skillflow.app",
  level: "Level 6",
  rank: "Focused Learner",
  streak: 12,
  unlockedQuizzes: 4,
  studyMinutes: 215,
  publicProfile: false,
  reminders: true,
  compact: false,
  sfx: true,
  recentStudy: [
    { id: "rs1", topic: "Biology", section: "Cell Structure", progress: 68 },
    { id: "rs2", topic: "Math", section: "Algebra Basics", progress: 42 },
  ],
  availableQuizzes: [
    {
      id: "q1",
      title: "Cell Structure Quiz",
      questions: 10,
      difficulty: "Medium",
    },
    {
      id: "q2",
      title: "Algebra Basics Quiz",
      questions: 8,
      difficulty: "Easy",
    },
  ],
  sections: [
    {
      id: "s1",
      topic: "Biology",
      section: "Cell Structure",
      progress: 68,
      quizUnlocked: true,
    },
    {
      id: "s2",
      topic: "Biology",
      section: "Genetics Intro",
      progress: 20,
      quizUnlocked: false,
    },
    {
      id: "s3",
      topic: "Math",
      section: "Algebra Basics",
      progress: 42,
      quizUnlocked: true,
    },
    {
      id: "s4",
      topic: "Physics",
      section: "Newton’s Laws",
      progress: 12,
      quizUnlocked: false,
    },
  ],
  notes: [
    {
      id: "n1",
      text: "Cells have membrane, cytoplasm, nucleus (eukaryotes).",
      createdAt: new Date().toISOString(),
    },
    {
      id: "n2",
      text: "Algebra tip: isolate variable with inverse operations.",
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
    },
  ],
  scores: [
    {
      id: "sc1",
      quiz: "Cell Structure Quiz",
      score: 86,
      questions: 10,
      time: 7,
      date: "Today",
    },
    {
      id: "sc2",
      quiz: "Algebra Basics Quiz",
      score: 74,
      questions: 8,
      time: 6,
      date: "Yesterday",
    },
    {
      id: "sc3",
      quiz: "Study Streak Check",
      score: 92,
      questions: 12,
      time: 9,
      date: "2 days ago",
    },
  ],
});

export function UserAuthProvider({ children }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // User data
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "user",
    createdAt: "",

    level: 0,
    publicProfile: false,
    reminders: false,

    compact: false,
    sfx: true,
  });

  // Auth actions (dummy for now)
  const login = (userData) => {
    setIsAuthenticated(true);
    if (userData) setUser(userData);
  };

  const logout = () => {
    const res = logoutApi();
    console.log(res);
    setIsAuthenticated(false);
    setUser({
      id: "",
      name: "",
      email: "",
      role: "user",
      createdAt: "",

      level: 0,
      publicProfile: false,
      reminders: false,

      compact: false,
      sfx: true,
    });
    localStorage.removeItem("access_token");

    window.location.href = "/auth/login";
  };

  // Common user mutations (so components don’t need setUser)
  const togglePublicProfile = () =>
    setUser((u) => ({ ...u, publicProfile: !u.publicProfile }));

  const toggleReminders = () =>
    setUser((u) => ({ ...u, reminders: !u.reminders }));

  const toggleCompact = () => setUser((u) => ({ ...u, compact: !u.compact }));

  const toggleSfx = () => setUser((u) => ({ ...u, sfx: !u.sfx }));

  const userData = async () => {
    try {
      const res = await me();
      console.log(res);
      setUser(res.user);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    userData();
  }, []);

  const value = useMemo(
    () => ({
      // auth
      isAuthenticated,
      login,
      logout,

      // user data
      user,
      setUser,

      // actions
      togglePublicProfile,
      toggleReminders,
      toggleCompact,
      toggleSfx,
    }),
    [isAuthenticated, user]
  );

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used within UserAuthProvider");
  return ctx;
}
