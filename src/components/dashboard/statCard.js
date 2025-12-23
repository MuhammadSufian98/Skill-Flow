export default function StatCard({ icon: Icon, title, value, sub }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="absolute inset-0 bg-linear-to-br from-cyan-400/10 via-purple-500/8 to-pink-500/10" />

      <div className="relative flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5">
          <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <div className="text-xs font-semibold text-white/70">{title}</div>
          <div className="text-xl font-extrabold text-white">{value}</div>
          {sub && <div className="text-xs text-white/70">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
