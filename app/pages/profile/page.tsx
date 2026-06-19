"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import Navbar from "@/app/components/Navbar";
import Dashboard from "./sections/Dasboard";
import YourJourney from "./sections/YourJourney";

import getVisited from "../../databaseFunctions/visited/geVisited";

import { User } from "@supabase/supabase-js";

import dynamic from "next/dynamic";

const ProfileMap = dynamic(() => import("./sections/ProfileMap"), {
  ssr: false,
});

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null); //am userul la nivel de parinte pentru ca am nevoie in ambele componente Dashboard si YourJourney de user

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [visitedPlaces, setVisitedPlaces] = useState([]);
  //asta de sus contine array de genu
  //   [
  //   {
  //     name: "London",
  //     latitude: 51.5074,
  //     longitude: -0.1278
  //   },
  //   {
  //     name: "Paris",
  //     latitude: 48.8566,
  //     longitude: 2.3522
  //   }
  // ]
  //prettier-ignore

  useEffect(() => {    //asta verifica daca sunt logat sau nu, si daca sunt preia userul din supabase cu id, email, data crearii si cu user_metadat unde am stocat username si avatarSeed, acest avatarSeed e prima data generat automat la inregistrare
    async function loadUser() {
      const {data: { user }} = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user); //in acest user am toate informatiile despre utilizator, inclusiv user_metadata unde am stocat username si avatarSeed, si de asemenea am si created_at care imi spune cand a fost creat contul

      //aici fac cerere de toate locurile userului 
      const data = await getVisited(user.id);
      setVisitedPlaces(data);
      
      setIsLoading(false);
    }
    loadUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900">
        {/* Container animat */}
        <div className="relative">
          {/* Inel de încărcare rotativ */}
          <div className="relative w-20 h-20">
            <div className="w-full h-full rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
          </div>
        </div>

        <div className="text-center">
          <p className="mt-4 text-white/80">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* stanga */}
          <div>
            <Dashboard user={user} />
          </div>

          {/* dreapta */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <YourJourney user={user} />

            <ProfileMap places={visitedPlaces} />
          </div>
        </div>
      </div>
    </div>
  );
}
