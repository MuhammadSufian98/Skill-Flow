import SectionShell from "@/components/dashboard/sectionShell";
import { useGeneral } from "@/context/generalContext";

export default function QuizSection() {
  const { sections } = useGeneral();

  const unlocked = sections.filter((s) => s.quizUnlocked);

  return (
    <SectionShell
      title="Quiz"
      subtitle="Quizzes unlock as you complete study sections"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {unlocked.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="text-sm font-semibold text-white">{s.topic}</div>
            <div className="mt-1 text-sm text-white/70">{s.section}</div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-white/70">
                {Math.max(5, Math.round(s.progress / 10) + 5)} questions •
                Medium
              </div>
              <button className="rounded-xl bg-linear-to-r from-cyan-400 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98]">
                Start Quiz
              </button>
            </div>
          </div>
        ))}

        {unlocked.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
            <div className="text-sm font-semibold">No quizzes unlocked yet</div>
            <div className="mt-2 text-sm text-white/70">
              Complete your first study section to unlock a quiz here.
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
