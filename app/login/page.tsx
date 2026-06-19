"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();

  async function handleRegister() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://192.168.0.160:3000/auth/callback",

        data: {
          //acest data il salvez in user-metadata in supabase
          username,
          avatarSeed: username, //aici next vede avatarSeed in user_metadata, iar acest user_metadata e un obiect care poate stoca orice informatie despre user, si care e accesibil in toate componentele unde am nevoie de informatii despre user, si atunci folosesc username ca seed pentru avatar pentru ca vreau ca fiecare utilizator sa aiba un avatar unic generat in functie de username
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Account created successfully. Please check your email.");
    }
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
    router.replace("/");
  }

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 bg-gradient-to-br from-slate-950  via-slate-900 to-teal-950">
      <Link
        href="/"
        className=" absolute  top-5  left-5  group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 backdrop-blur-sm border border-cyan-400/20 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
      >
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back Home
      </Link>
      <div className="w-full mt-10 mb-15 max-w-md p-8 rounded-3xl bg-[rgba(15,116,121,0.18)] backdrop-blur-xl border border-cyan-400/30shadow-2xl shadow-cyan-500/10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-300 bg-clip-text text-transparent">
            HYLO
          </h1>

          <p className="text-white/60 mt-3">
            Discover weather anywhere in the world
          </p>
        </div>

        {/* username */}
        <div className="mb-5">
          <label className="block text-white/80 mb-2 text-sm">Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            className=" w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-white/80 mb-2 text-sm">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="
              w-full
              px-4
              py-3
              rounded-xl
              bg-white/10
              border
              border-white/10
              text-white
              placeholder:text-white/40
              outline-none
              focus:border-cyan-400
              focus:ring-2
              focus:ring-cyan-400/20
            "
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-white/80 mb-2 text-sm">Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="
              w-full
              px-4
              py-3
              rounded-xl
              bg-white/10
              border
              border-white/10
              text-white
              placeholder:text-white/40
              outline-none
              focus:border-cyan-400
              focus:ring-2
              focus:ring-cyan-400/20
            "
          />
        </div>

        {/* Error / Success */}
        {message && (
          <div className="mb-5 text-center text-sm text-cyan-200 bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-3">
            {message}
          </div>
        )}

        {/* Login */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            py-3
            rounded-xl
            font-semibold
            text-slate-900
            bg-gradient-to-r
            from-cyan-300
            via-sky-400
            to-teal-300
            hover:scale-[1.02]
            transition-all
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-3 text-white/40 text-sm">or</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Register */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="
            w-full
            py-3
            rounded-xl
            border
            border-cyan-400/30
            text-cyan-200
            hover:bg-cyan-500/10
            transition-all
            cursor-pointer
            disabled:opacity-50
          "
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
