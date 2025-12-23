"use client";

import React, { useState } from "react";
import AuthTransition from "../authTransition";
import Link from "next/link";
import { signup } from "@/utils/authApi";
import { EyeClosed, Eye } from "lucide-react";

export default function SignUp() {
  const [creds, setCreds] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = creds.name.trim();
    const email = creds.email.trim();

    if (!name || !email || !creds.password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await signup(email, creds.password, name);
      console.log(res);
      localStorage.setItem("access_token", res.token);

      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTransition>
      <div className="relative flex min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="flex w-full flex-col justify-center p-10 text-white md:w-1/2">
          <h2 className="mb-8 text-2xl font-semibold">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Name"
              value={creds.name}
              onChange={(e) => setCreds({ ...creds, name: e.target.value })}
              autoComplete="name"
              className="w-full rounded-lg bg-white/10 px-4 py-3.5 text-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-cyan-400"
            />

            <input
              type="email"
              placeholder="Email"
              value={creds.email}
              onChange={(e) => setCreds({ ...creds, email: e.target.value })}
              autoComplete="email"
              className="w-full rounded-lg bg-white/10 px-4 py-3.5 text-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-cyan-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={creds.password}
                onChange={(e) =>
                  setCreds({ ...creds, password: e.target.value })
                }
                autoComplete="new-password"
                className="w-full rounded-lg bg-white/10 px-4 py-3.5 pr-12 text-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-cyan-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? (
                  <EyeClosed className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={[
                "mt-6 w-full rounded-lg",
                "bg-linear-to-r from-cyan-400 to-purple-500",
                "bg-size-[200%_200%] bg-left",
                "px-6 py-3.5 text-sm font-semibold text-white",
                "transition-all duration-500 ease-out",
                "hover:bg-right",
                loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                "drop-shadow-lg",
              ].join(" ")}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/50">
            Already have an account?{" "}
            <Link className="cursor-pointer text-cyan-400" href="/auth/login">
              Log in
            </Link>
          </p>
        </div>

        <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden p-12 md:flex">
          <div
            className="absolute inset-0 bg-linear-to-br from-cyan-400/75 via-purple-500/45 to-pink-500/75 opacity-95"
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div className="relative z-10">
            <h1 className="mb-4 text-3xl font-bold text-white">
              New to Skill Flow?
            </h1>
            <p className="text-white/70 leading-relaxed">
              Create your account to take quizzes, build study streaks, and
              master topics faster with Skill Flow.
            </p>
          </div>
        </div>
      </div>
    </AuthTransition>
  );
}
