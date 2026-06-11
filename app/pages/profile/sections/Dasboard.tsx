//sectiune care contine doar avatar, email, logout
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Dashboard({ user }: { user: User | null }) {
  const avatarSeed = user?.user_metadata?.avatarSeed; //acest avatarSeed e practic un string care se genereaza la crearea contului, si care e folosit pentru a genera avatarul unic al fiecarui utilizator
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${avatarSeed}`;

  const username = user?.user_metadata?.username; //nu am nevoie de state pentru username pentru ca el se afla in state-ul user, iar supabase stocheaza username-ul in user.user_metadata
  const [isEditing, setIsEditing] = useState(false); //pentru a arata/ascude inputul de editare a username-ului
  const [newUsername, setNewUsername] = useState(username || "");

  const [isChangingPassword, setIsChangingPassword] = useState(false); //pentru a arata/ascunde inputurile de editare a parolei
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswords, setShowPasswords] = useState(false); //e pentru user sa vada parola cand o tasteaza

  const router = useRouter(); //penru a redirectiona utilizatorul dupa logout

  //preiau data la care s-a creat contul si il formatez
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  //functii
  async function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all visited places?",
    );

    if (!confirmed) return;
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleUpdateUsername() {
    const { error } = await supabase.auth.updateUser({
      data: { username: newUsername },
    });

    if (error) {
      alert(error.message);
      return;
    }

    setIsEditing(false);
    window.location.reload(); //asta da refresh
  }

  async function handleRandomAvatar() {
    const randomSeed = Date.now().toString(); //generez un string random care va fi folosit ca seed pentru avatar

    const { error } = await supabase.auth.updateUser({
      data: {
        avatarSeed: randomSeed, //aici actualizez avatarSeed-ul in supabase cu noul seed random generat, iar apoi componenta va folosi acest nou seed pentru a genera un nou avatar, dar pentru ca componenta sa stie ca seed-ul s-a schimbat, e nevoie de un refresh, de aceea dau window.location.reload() dupa ce actualizez seed-ul in supabase
      },
    });

    if (error) {
      alert(error.message);
      return;
    }
    window.location.reload(); //daca nu dau refresh, avatarul nu se va schimba pentru ca url-ul avatarului se bazeaza pe seed, iar seed-ul s-a schimbat dar componenta nu stie asta pana nu da refresh
  }

  async function handleChangePassword() {
    if (!user) return;
    if (!user.email) return;

    //verific daca parola noua si cea confirrmata sunt identice
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must contain at least 6 characters");
      return;
    }

    //verific parola curenta
    const { error: signInError } = await supabase.auth.signInWithPassword({
      //acest signInError e denumire pentru eroarea asta, ca mai jos am alte erori si nu pot da aceasi denumire de error la toate
      email: user.email,
      password: currentPassword,
    });
    if (signInError) {
      alert("Current password is incorrect");
      return;
    }

    //dau update la parola curenta din supabase cu cea noua
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      alert(updateError.message);
      return;
    }

    alert("Password updated successfully"); //daca ajung aici inseamna ca s-a actualizat parola

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
  }

  return (
    <section className="flex-1 mt-8 rounded-3xl bg-[rgba(15,116,121,0.18)] backdrop-blur-xl border border-cyan-400/20 p-8 text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {/* avatar*/}
      <div className="relative">
        <Image
          loading="eager"
          src={avatarUrl}
          alt="Profile"
          width={120}
          height={120}
          unoptimized
          className=" rounded-full border-4 border-cyan-400/40 shadow-lg shadow-cyan-500/20"
        />
        <button
          onClick={handleRandomAvatar}
          className="absolute bottom-0 right-0 p-2 rounded-full bg-cyan-500/80 hover:bg-cyan-500 shadow-lg cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 21h14c1.1 0 2-.9 2-2v-7h-2v7H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2"></path>
            <path d="M7 13v3c0 .55.45 1 1 1h3c.27 0 .52-.11.71-.29l9-9a.996.996 0 0 0 0-1.41l-3-3a.996.996 0 0 0-1.41 0l-9.01 8.99A1 1 0 0 0 7 13m10-7.59L18.59 7 17.5 8.09 15.91 6.5zm-8 8 5.5-5.5 1.59 1.59-5.5 5.5H9z"></path>
          </svg>
        </button>
      </div>

      {/* username-ul si logica de edit */}
      {isEditing ? (
        <div className="flex flex-col gap-3 mt-4">
          <input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-center"
          />

          <button
            onClick={handleUpdateUsername}
            className="cursor-pointer px-4 py-2 rounded-xl bg-orange-400/90 hover:bg-orange-400"
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center gap-2 mt-4">
            <h2 className="text-2xl font-bold">{username}</h2>

            <button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer  text-orange-300/70 text-sm hover:text-orange-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 21h14c1.1 0 2-.9 2-2v-7h-2v7H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2"></path>
                <path d="M7 13v3c0 .55.45 1 1 1h3c.27 0 .52-.11.71-.29l9-9a.996.996 0 0 0 0-1.41l-3-3a.996.996 0 0 0-1.41 0l-9.01 8.99A1 1 0 0 0 7 13m10-7.59L18.59 7 17.5 8.09 15.91 6.5zm-8 8 5.5-5.5 1.59 1.59-5.5 5.5H9z"></path>
              </svg>
            </button>
          </div>
        </>
      )}

      {/* sectiunea de info */}
      <div className="mt-6 w-full rounded-xl bg-white/5 border border-white/10 p-4">
        <p className="text-xs uppercase tracking-wide text-white/40">
          Account Information
        </p>

        <div className="mt-3">
          <p className="text-white/50 text-sm">email</p>

          <p className="font-medium">{user?.email}</p>
        </div>

        <div className="mt-3">
          <p className="text-white/50 text-sm">Member since</p>

          <p className="font-medium">{memberSince}</p>
        </div>
      </div>

      {/* butonul de change password */}
      {!isChangingPassword && (
        <button
          onClick={() => setIsChangingPassword(!isChangingPassword)}
          className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30 cursor-pointer"
        >
          {isChangingPassword ? "Cancel" : "Change Password"}
        </button>
      )}

      {/* sectiune de editare a parolei*/}
      {isChangingPassword && (
        <div className=" flex flex-col  items-center justify-center mt-6 w-full rounded-xl bg-white/5 border border-white/10 p-4 animate-in fade-in duration-300">
          <p className="text-xs uppercase tracking-wide text-white/40 mb-4 ">
            Change Password
          </p>

          <div className="flex flex-col gap-3">
            {/*butonul de show passwords */}
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-sm text-cyan-300 hover:text-cyan-200 cursor-pointer flex items-center justify-center gap-2 transition-colors"
            >
              {showPasswords ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2.81 2.81 1.39 4.22l3.54 3.54C3.11 9.27 1.8 11.01 1 13c1.73 4.39 6 7.5 11 7.5 1.94 0 3.77-.48 5.36-1.33l3.43 3.43 1.41-1.41L2.81 2.81zM12 17c-2.76 0-5-2.24-5-5 0-.91.25-1.76.68-2.49L9.66 11.5c-.1.32-.16.66-.16 1 0 1.38 1.12 2.5 2.5 2.5.34 0 .68-.06 1-.16l1.99 1.99c-.73.43-1.58.67-2.49.67z" />
                </svg>
              )}
              <span>{showPasswords ? "Hide" : "Show"} passwords</span>
            </button>

            {/* Inputs */}
            <div className="space-y-2">
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-cyan-400/50 focus:outline-none transition-all placeholder:text-white/40"
                required
              />

              <input
                type={showPasswords ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-cyan-400/50 focus:outline-none transition-all placeholder:text-white/40"
                required
              />

              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-cyan-400/50 focus:outline-none transition-all placeholder:text-white/40"
                required
              />
            </div>

            {/* cancel si save buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all cursor-pointer font-medium text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() => handleChangePassword()}
                className="flex-1 px-4 py-2 rounded-xl bg-amber-500/40 hover:bg-amber-500/70 transition-all cursor-pointer font-medium text-sm shadow-lg "
              >
                Save New Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* butonul de logout */}
      <button
        onClick={handleLogout}
        className=" mt-8 px-6 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 transition-all cursor-pointer font-medium"
      >
        Log Out
      </button>
    </section>
  );
}
