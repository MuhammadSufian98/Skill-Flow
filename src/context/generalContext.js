"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

const GeneralContext = createContext(null);

export function GeneralProvider({ children }) {
  const [active, setActive] = useState("home");
  const [homeSection, setHomeSection] = useState({
    streak: 0,
    unlockedQuizzes: 0,
    studyMinutes: 0,
    recentStudy: [],
    availableQuizzes: [],
  });
  const [sections, setSections] = useState([
    {
      id: "s1",
      topic: "Programming",
      section: "JavaScript Fundamentals",
      progress: 68,
      quizUnlocked: true,
    },
    {
      id: "s2",
      topic: "Programming",
      section: "Functions & Scope",
      progress: 20,
      quizUnlocked: false,
    },
    {
      id: "s3",
      topic: "Data Structures & Algorithms",
      section: "Arrays & Strings",
      progress: 42,
      quizUnlocked: true,
    },
    {
      id: "s4",
      topic: "Data Structures & Algorithms",
      section: "Sorting Basics",
      progress: 12,
      quizUnlocked: false,
    },
  ]);

  const [scores, setScores] = useState([
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
  ]);
  const [notes, setNotes] = useState([]);

  const addNote = (text) => {
    const trimmed = (text || "").trim();
    if (!trimmed) return;

    setNotes((u) => ({
      ...u,
      notes: [
        {
          id: crypto.randomUUID(),
          text: trimmed,
          createdAt: new Date().toISOString(),
        },
        ...u.notes,
      ],
    }));
  };

  const value = useMemo(
    () => ({
      active,
      setActive,
      homeSection,
      setHomeSection,
      sections,
      setSections,
      scores,
      setScores,
      addNote,
      notes,
      setNotes,
    }),
    [active]
  );

  return (
    <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>
  );
}

export function useGeneral() {
  const ctx = useContext(GeneralContext);
  if (!ctx) throw new Error("useGeneral must be used within GeneralProvider");
  return ctx;
}
