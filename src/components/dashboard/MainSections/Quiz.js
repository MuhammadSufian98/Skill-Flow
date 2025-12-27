import SectionShell from "@/components/dashboard/sectionShell";
import { useGeneral } from "@/context/generalContext";
import { useRouter } from "next/navigation";
import "../../../app/globals.css";

export default function QuizSection() {
  const { sections, setQuiz } = useGeneral();
  const router = useRouter();

  // Filter out sections that have quizzes unlocked
  const unlockedSections = sections
    .map((topic) => ({
      ...topic,
      sections: topic.sections.filter((section) => {
        const progress = section.progress?.progress || 0;
        const unlockAtProgress = section.quiz?.unlockAtProgress || 0;
        return progress >= unlockAtProgress;
      }),
    }))
    .filter((topic) => topic.sections.length > 0);

  // Function to handle quiz start
  const handleStartQuiz = (id, title, topic) => {
    router.push(`/dashboard/quiz/${id}?title=${title}&topic=${topic}`);
  };

  return (
    <SectionShell
      title="Quiz"
      subtitle="Quizzes unlock as you complete study sections"
    >
      <div className="space-y-3 custom-scrollbar">
        {unlockedSections.length > 0 ? (
          unlockedSections.map((t, ti) => (
            <div
              key={t?.topic || `topic-${ti}`}
              className="rounded-xl border border-white/10 bg-black/15 px-4 py-3"
            >
              <div className="text-sm font-semibold text-white">{t.topic}</div>

              <div className="mt-3 space-y-3">
                {t.sections.map((s, si) => {
                  const progress = s.progress?.progress || 0;

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
                          <div className="text-xs text-white/70">{t.topic}</div>
                        </div>

                        <button
                          onClick={() =>
                            handleStartQuiz(s._id, t.topic, s.title)
                          }
                          className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
                        >
                          Start Quiz
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
                        <div>
                          Quiz unlock at: {s?.quiz?.unlockAtProgress ?? 0}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
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
