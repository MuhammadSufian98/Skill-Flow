import { Flame, Target, Clock } from "lucide-react";
import SectionShell from "@/components/dashboard/sectionShell";
import StatCard from "@/components/dashboard/statCard";
import { useGeneral } from "@/context/generalContext";

export default function HomeSection() {
  const { homeSection } = useGeneral();

  return (
    <SectionShell
      title="Home"
      subtitle="Overview of your study and quiz progress"
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Flame}
          title="Study Streak"
          value={`${homeSection.streak} days`}
          sub="Keep it going today"
        />
        <StatCard
          icon={Target}
          title="Quizzes Unlocked"
          value={`${homeSection.unlockedQuizzes}`}
          sub="Based on sections completed"
        />
        <StatCard
          icon={Clock}
          title="Study Time"
          value={`${homeSection.studyMinutes}m`}
          sub="This week"
        />
      </div>

      {/* Content */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Continue Studying */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white">
            Continue studying
          </div>
          <div className="mt-1 text-sm text-white/70">
            Jump back into your last section and unlock the next quiz.
          </div>

          <div className="mt-4 space-y-3">
            {homeSection.recentStudy.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">
                    {s.topic}
                  </div>
                  <div className="text-xs text-white/70">
                    {s.section} • {s.progress}% complete
                  </div>
                </div>
                <button className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15">
                  Resume
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quizzes */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white">
            Next unlocked quizzes
          </div>
          <div className="mt-1 text-sm text-white/70">
            Finish sections to unlock more quizzes.
          </div>

          <div className="mt-4 space-y-3">
            {homeSection.availableQuizzes.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">
                    {q.title}
                  </div>
                  <div className="text-xs text-white/70">
                    {q.questions} questions • {q.difficulty}
                  </div>
                </div>
                <button className="rounded-lg bg-linear-to-r from-cyan-400 to-purple-500 px-3 py-2 text-xs font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98]">
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
