import SectionShell from "@/components/dashboard/sectionShell";
import { useUserAuth } from "@/context/userAuthContext";

const levelRanks = {
  0: "Newcomer",
  1: "Curious Beginner",
  2: "Early Explorer",
  3: "Motivated Learner",
  4: "Consistent Student",
  5: "Focused Learner",
  6: "Skilled Thinker",
  7: "Advanced Explorer",
  8: "Knowledge Builder",
  9: "Expert Learner",
  10: "Master Strategist",
};

export default function ProfileSection() {
  const { user, togglePublicProfile, toggleReminders } = useUserAuth();

  const rank = levelRanks[user.level] ?? "Unknown Rank";

  return (
    <SectionShell title="Profile" subtitle="Your account details">
      <div className="grid gap-4 md:grid-cols-2">
        {/* User Info */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white">User</div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-white/70">Name</div>
              <div className="text-sm font-semibold text-white">
                {user.name}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-white/70">Email</div>
              <div className="text-sm font-semibold text-white">
                {user.email}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-white/70">Level</div>
              <div className="text-sm font-semibold text-white">
                {user.level} • {rank}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white">Preferences</div>

          <div className="mt-4 space-y-3">
            {/* Public Profile */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  Public profile
                </div>
                <div className="text-xs text-white/70">
                  Allow others to discover you (coming soon)
                </div>
              </div>

              <button
                onClick={togglePublicProfile}
                className={[
                  "rounded-xl px-3 py-2 text-xs font-semibold text-white transition",
                  user.publicProfile
                    ? "bg-white/15"
                    : "bg-white/8 hover:bg-white/12",
                ].join(" ")}
              >
                {user.publicProfile ? "Enabled" : "Disabled"}
              </button>
            </div>

            {/* Reminders */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  Study reminders
                </div>
                <div className="text-xs text-white/70">
                  Daily nudges to keep your streak
                </div>
              </div>

              <button
                onClick={toggleReminders}
                className={[
                  "rounded-xl px-3 py-2 text-xs font-semibold text-white transition",
                  user.reminders
                    ? "bg-white/15"
                    : "bg-white/8 hover:bg-white/12",
                ].join(" ")}
              >
                {user.reminders ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
