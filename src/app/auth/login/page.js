"use client";

import React, { useState } from "react";
import AuthTransition from "../authTransition";
import Link from "next/link";
import { login } from "@/utils/authApi";

export default function Login() {
  const [creds, setCreds] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    if (!creds.email || !creds.password) {
      alert("Please fill in all fields.");
      return;
    }
    const email = creds.email;
    const password = creds.password;

    console.log(creds);
    const res = await login(email, password);
    console.log(res);
    localStorage.setItem("access_token", res.token);

    window.location.href = "/dashboard";
  };
  return (
    <AuthTransition>
      <div className="relative flex min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden p-12 md:flex">
          <div
            className="absolute inset-0 bg-linear-to-br from-cyan-400/75 via-purple-500/45 to-pink-500/75 opacity-95"
            style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)" }}
          />
          <div className="relative z-10">
            <h1 className="mb-4 text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/70 leading-relaxed">
              Log in to Skill Flow to continue quizzes, study smarter, and track
              your progress.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center p-10 text-white md:w-1/2">
          <h2 className="mb-8 text-2xl font-semibold">Login</h2>

          <div className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setCreds({ ...creds, email: e.target.value })}
              className="w-full rounded-lg bg-white/10 px-4 py-3.5 text-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-cyan-400"
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              className="w-full rounded-lg bg-white/10 px-4 py-3.5 text-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-cyan-400"
            />

            <button
              onClick={() => handleSubmit()}
              className={[
                "mt-6 w-full rounded-lg",
                "bg-linear-to-r from-cyan-400 to-purple-500",
                "bg-size-[200%_200%] bg-left",
                "px-6 py-3.5 text-sm font-semibold text-white",
                "transition-all duration-500 ease-out",
                "hover:bg-right",
                "cursor-pointer drop-shadow-lg",
              ].join(" ")}
            >
              Sign In
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-white/50">
            Don’t have an account?{" "}
            <Link className="cursor-pointer text-cyan-400" href="/auth/signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthTransition>
  );
}
