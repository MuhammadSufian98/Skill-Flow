import { useState } from "react";
import SectionShell from "@/components/dashboard/sectionShell";
import { useGeneral } from "@/context/generalContext";

export default function StudySection() {
  const { sections, notes, addNote } = useGeneral();
  const [note, setNote] = useState("");

  const handleAddNote = () => {
    const trimmed = note.trim();
    if (!trimmed) return;

    addNote(trimmed);
    setNote("");
  };

  return (
    <SectionShell
      title="Study"
      subtitle="Your sections, progress and personal notes"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sections */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white">Sections</div>

          <div className="mt-4 space-y-3">
            {sections.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">
                      {s.topic}
                    </div>
                    <div className="text-xs text-white/70">{s.section}</div>
                  </div>

                  <div className="text-xs font-semibold text-white/80">
                    {s.progress}%
                  </div>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-linear-to-r from-cyan-400 to-purple-500"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-white/70">
                    Quiz: {s.quizUnlocked ? "Unlocked" : "Locked"}
                  </div>
                  <button className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15">
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white">Personal Notes</div>

          <div className="mt-3 flex gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a quick note..."
              className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={handleAddNote}
              className="rounded-xl bg-linear-to-r from-cyan-400 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Add
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {notes.map((n) => (
              <div
                key={n.id}
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
    </SectionShell>
  );
}
