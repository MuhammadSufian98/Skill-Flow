"use client";

import React, { useState } from "react";
import AuthTransition from "../authTransition";
import Link from "next/link";
import { login } from "@/utils/authApi";
import { Eye, EyeClosed } from "lucide-react";

const WarningDialog = ({ message }) => (
  <div className="absolute top-1/2 right-12 transform -translate-y-1/2 bg-white p-2 rounded-lg shadow-lg text-xs text-gray-700 border border-red-500">
    {message}
  </div>
);

export default function Login() {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!creds.email || !creds.password) {
      alert("Please fill in all fields.");
      return;
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/;
    if (!emailRegex.test(creds.email)) {
      setEmailError(true);
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

  const handleMouseEnter = () => {
    setShowDialog(true);
  };

  const handleMouseLeave = () => {
    setShowDialog(false);
  };

  return (
    <AuthTransition>
      <div className="relative flex min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden p-12 md:flex back">
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
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                className="w-full rounded-lg bg-white/10 px-4 py-3.5 text-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-cyan-400"
              />
              {emailError && (
                <div
                  className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer absolute top-1/2 right-4 transform -translate-y-1/2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  i
                </div>
              )}
              {showDialog && emailError && (
                <WarningDialog message="Email not valid" />
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) =>
                  setCreds({ ...creds, password: e.target.value })
                }
                className="w-full rounded-lg bg-white/10 px-4 py-3.5 text-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-cyan-400"
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </div>
            </div>

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
