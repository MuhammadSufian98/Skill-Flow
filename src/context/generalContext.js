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

  // {
  //   id: "s1",
  //   topic: "Programming",
  //   section: "JavaScript Fundamentals",
  // },
  const [sections, setSections] = useState([]);
  const [material, setMaterial] = useState([]);
  const [progressMap, setProgressMap] = useState({});

  const [quiz, setQuiz] = useState([]);

  // Function to clear quiz
  const clearQuiz = () => {
    setQuiz([]); // Reset quiz data to empty array
  };

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

  const [notes, setNotes] = useState([
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
  ]);

  const addNote = (text) => {
    const trimmed = (text || "").trim();
    if (!trimmed) return;

    setNotes((prevNotes) => [
      {
        id: crypto.randomUUID(), // Generate a unique ID
        text: trimmed,
        createdAt: new Date().toISOString(), // Timestamp
      },
      ...prevNotes, // Add new note to the front of the array
    ]);
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
      material,
      setMaterial,
      progressMap,
      setProgressMap,
      quiz,
      setQuiz,
      clearQuiz,
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
