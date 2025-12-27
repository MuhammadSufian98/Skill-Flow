"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

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

  const [sections, setSections] = useState([]); // Stores all the sections
  const [material, setMaterial] = useState([]); // Stores material data (can be updated separately)
  const [progressMap, setProgressMap] = useState({}); // Stores progress for sections

  const [quiz, setQuiz] = useState([]); // Stores quiz data

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

  // Efficiently update sections: either replace all sections or update individual ones
  const updateSections = useCallback((newSections) => {
    setSections((prevSections) => {
      // Only update if the newSections differ from the current ones
      if (JSON.stringify(prevSections) !== JSON.stringify(newSections)) {
        return newSections;
      }
      return prevSections;
    });
  }, []);

  // Force reload of sections (e.g., when needed to fetch fresh data)
  const reloadSections = useCallback(() => {
    setSections([]); // Clear the existing sections and trigger a reload
  }, []);

  // Update the progress for a specific section
  const updateSectionProgress = useCallback((sectionId, newProgress) => {
    setProgressMap((prevProgressMap) => {
      const updatedProgressMap = { ...prevProgressMap };
      updatedProgressMap[sectionId] = newProgress;
      return updatedProgressMap;
    });
  }, []);

  const value = useMemo(
    () => ({
      active,
      setActive,
      homeSection,
      setHomeSection,
      sections,
      setSections,
      updateSections, // Expose updateSections for efficient section updates
      reloadSections, // Expose reloadSections for refreshing the sections
      material,
      setMaterial,
      progressMap,
      setProgressMap,
      updateSectionProgress, // Expose updateSectionProgress for handling progress changes
      quiz,
      setQuiz,
      clearQuiz,
      scores,
      setScores,
      addNote,
      notes,
      setNotes,
    }),
    [active, homeSection, sections, progressMap, quiz, scores, notes]
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
