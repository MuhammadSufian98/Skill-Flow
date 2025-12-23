import React from "react";
import { useUserAuth } from "@/context/userAuthContext";
import { LogOut } from "lucide-react";

export default function SectionShell({ title, subtitle, children }) {
  const { logout } = useUserAuth();
  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between items-center shrink-0 border-b border-white/10 px-6 py-4">
        <div>
          <div className="text-lg font-bold text-white">{title}</div>
          <div className="text-sm text-white/70">{subtitle}</div>
        </div>
        <button
          onClick={() => logout()}
          className={[
            "mt-2",
            "inline-flex items-center gap-2",
            "rounded-xl",
            "px-3 py-2",
            "text-xs font-semibold",
            "text-red-400",
            "bg-white/5",
            "border border-white/10",
            "hover:bg-red-500/10",
            "hover:text-red-300",
            "transition cursor-pointer",
          ].join(" ")}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
    </div>
  );
}
