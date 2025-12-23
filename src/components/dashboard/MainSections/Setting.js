import SectionShell from "@/components/dashboard/sectionShell";
import { useUserAuth } from "@/context/userAuthContext";

export default function SettingsSection() {
  const { user, toggleCompact, toggleSfx } = useUserAuth();

  return (
    <SectionShell title="Settings" subtitle="App configuration (dummy)">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Appearance */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white">Appearance</div>

          <div className="mt-4 space-y-3">
            {/* Compact Mode */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  Compact mode
                </div>
                <div className="text-xs text-white/70">
                  Tighter spacing in lists
                </div>
              </div>

              <button
                onClick={toggleCompact}
                className={[
                  "rounded-xl px-3 py-2 text-xs font-semibold text-white transition",
                  user.compact ? "bg-white/15" : "bg-white/8 hover:bg-white/12",
                ].join(" ")}
              >
                {user.compact ? "On" : "Off"}
              </button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  Sound effects
                </div>
                <div className="text-xs text-white/70">UI sounds (dummy)</div>
              </div>

              <button
                onClick={toggleSfx}
                className={[
                  "rounded-xl px-3 py-2 text-xs font-semibold text-white transition",
                  user.sfx ? "bg-white/15" : "bg-white/8 hover:bg-white/12",
                ].join(" ")}
              >
                {user.sfx ? "On" : "Off"}
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white">Account</div>

          <div className="mt-4 space-y-3">
            <button className="w-full rounded-xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12">
              Change password (dummy)
            </button>

            <button className="w-full rounded-xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12">
              Manage subscription (dummy)
            </button>

            <button className="w-full rounded-xl bg-linear-to-r from-cyan-400 to-purple-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] active:scale-[0.98]">
              Save settings (dummy)
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
