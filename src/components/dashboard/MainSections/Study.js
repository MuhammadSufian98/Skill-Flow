import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SectionShell from "@/components/dashboard/sectionShell";
import { useGeneral } from "@/context/generalContext";
import {
  fetchMaterial,
  saveNotes,
  fetchNotes as fetchNotesFromApi,
} from "@/utils/sectionsApi"; // Renaming fetchNotes

export default function StudySection() {
  const router = useRouter();
  const { sections, setMaterial, progressMap } = useGeneral();
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  // Renamed the function to avoid naming conflict
  const loadNotes = async () => {
    try {
      const fetchedNotes = await fetchNotesFromApi(); // Using the renamed import
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    loadNotes(); // Call renamed function here
  }, []);

  const handleAddNote = async (note, setNotes, setNote) => {
    const trimmed = note.trim();
    if (!trimmed) return;

    setNote(""); // Clear the input field

    // Save the new note to the backend
    const savedNote = await saveNotes([{ text: trimmed }]);

    if (savedNote) {
      // Update the local state with the newly saved note
      setNotes((prevNotes) => [
        ...prevNotes,
        { ...savedNote, id: Date.now(), createdAt: new Date() },
      ]);
    }
  };

  const fetchMaterialData = async (id) => {
    const material = await fetchMaterial(id);
    if (!material?._id) return;
    setMaterial((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      if (list.some((m) => m._id === material._id)) return list;
      return [...list, material];
    });
    router.push(`/dashboard/study/${id}`);
  };

  const getProgress = (id) => {
    const p = progressMap?.[String(id)]?.progress;
    return Number.isFinite(p) ? Math.max(0, Math.min(100, p)) : 0;
  };

  return (
    <SectionShell
      title="Study"
      subtitle="Your sections, progress, and personal notes"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sections Box with scroll */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col">
          <div className="text-sm font-semibold text-white">Sections</div>
          <div
            className="mt-4 flex-1 overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "calc(94vh - 200px)" }}
          >
            {/* This ensures the height adjusts based on available space */}
            <div className="space-y-3">
              {(Array.isArray(sections) ? sections : []).map((t, ti) => (
                <div
                  key={t?.topic || `topic-${ti}`}
                  className="rounded-xl border border-white/10 bg-black/15 px-4 py-3"
                >
                  <div className="text-sm font-semibold text-white">
                    {t.topic}
                  </div>

                  <div className="mt-3 space-y-3">
                    {(Array.isArray(t.sections) ? t.sections : []).map(
                      (s, si) => {
                        const progress = getProgress(s._id || s.id);

                        return (
                          <div
                            key={String(
                              s?._id || s?.id || `${t.topic}-${s.title}-${si}`
                            )}
                            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-white">
                                  {s.title}
                                </div>
                                <div className="text-xs text-white/70">
                                  {t.topic}
                                </div>
                              </div>

                              <button
                                onClick={() => fetchMaterialData(s._id || s.id)}
                                className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
                              >
                                Open
                              </button>
                            </div>

                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-white/70">
                                <span>Progress</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
                                <div
                                  className="h-full rounded-full bg-linear-to-r from-cyan-400 to-purple-500 transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-xs text-white/70">
                              <div>Order: {s.order ?? 0}</div>
                              <div>
                                Quiz unlock at: {s?.quiz?.unlockAtProgress ?? 0}
                                %
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Box with scroll */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col">
          <div className="text-sm font-semibold text-white">Personal Notes</div>
          <div className="mt-3 flex gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a quick note..."
              className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={() => handleAddNote(note, setNotes, setNote)}
              className="rounded-xl bg-linear-to-r from-cyan-400 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Add
            </button>
          </div>

          <div
            className="mt-4 flex-1 overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "calc(85vh - 200px)" }}
          >
            {/* This ensures the height adjusts based on available space */}
            <div className="space-y-3">
              {notes.map((n) => (
                <div
                  key={n._id}
                  className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="text-sm text-white">{n.text}</div>
                  <div className="mt-2 text-xs text-white/70">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
