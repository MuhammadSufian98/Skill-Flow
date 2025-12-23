import SectionShell from "@/components/dashboard/sectionShell";
import { useGeneral } from "@/context/generalContext";

export default function ScoreSection() {
  const { scores } = useGeneral();

  return (
    <SectionShell title="Score" subtitle="Your recent quiz performance">
      <div className="grid gap-4 md:grid-cols-2">
        {scores.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">{s.quiz}</div>
              <div className="text-sm font-extrabold text-white">
                {s.score}%
              </div>
            </div>

            <div className="mt-2 text-xs text-white/70">
              {s.questions} questions • {s.time} min • {s.date}
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-linear-to-r from-cyan-400 to-purple-500"
                style={{ width: `${s.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
