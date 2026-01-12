"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
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
  const [isSectionsLoaded, setIsSectionsLoaded] = useState(false); // Track if sections are loaded
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

  const updateSections = useCallback((newSections) => {
    setSections((prevSections) => {
      if (JSON.stringify(prevSections) !== JSON.stringify(newSections)) {
        return newSections;
      }
      return prevSections;
    });
  }, []);

  const reloadSections = useCallback(() => {
    setSections([]); // Clear the existing sections and trigger a reload
    setIsSectionsLoaded(false); // Reset the section load status
  }, []);

  const updateSectionProgress = useCallback((sectionId, newProgress) => {
    setProgressMap((prevProgressMap) => {
      const updatedProgressMap = { ...prevProgressMap };
      updatedProgressMap[sectionId] = newProgress;
      return updatedProgressMap;
    });
  }, []);

  // // Fetch sections only when needed
  // const fetchSectionsIfNeeded = async () => {
  //   if (!isSectionsLoaded) {
  //     const response = await fetch("/api/sections");
  //     const data = await response.json();
  //     setSections(data);
  //     setIsSectionsLoaded(true);
  //   }
  // };

  // useEffect(() => {
  //   fetchSectionsIfNeeded(); // Call on mount to fetch sections if not already loaded
  // }, [isSectionsLoaded]);

  const value = useMemo(
    () => ({
      active,
      setActive,
      homeSection,
      setHomeSection,
      sections,
      setSections,
      updateSections,
      reloadSections,
      material,
      setMaterial,
      progressMap,
      setProgressMap,
      updateSectionProgress,
      quiz,
      setQuiz,
      clearQuiz,
      scores,
      setScores,
      addNote,
      notes,
      setNotes,
      // fetchSectionsIfNeeded, // Expose fetchSectionsIfNeeded
    }),
    [
      active,
      homeSection,
      sections,
      progressMap,
      quiz,
      scores,
      notes,
      isSectionsLoaded,
    ]
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
