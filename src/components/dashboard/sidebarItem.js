import { ChevronRight } from "lucide-react";

export default function SidebarItem({
  active = false,
  icon: Icon,
  label,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left",
        "transition",
        active
          ? "bg-white/10 border border-white/15"
          : "hover:bg-white/8 border border-transparent",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "grid h-10 w-10 place-items-center rounded-xl",
            active ? "bg-white/10" : "bg-white/5 group-hover:bg-white/8",
            "border border-white/10",
          ].join(" ")}
        >
          <Icon className="h-5 w-5 text-white" strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{label}</div>
        </div>
      </div>

      <ChevronRight
        className={[
          "h-4 w-4 text-white/60 transition",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        ].join(" ")}
      />
    </button>
  );
}
