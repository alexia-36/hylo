"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

//functii
import getVisited from "@/app/databaseFunctions/visited/geVisited";
import getFavourite from "@/app/databaseFunctions/favourite/getFavourite";

//componente
import ProgressBar from "../components/ProgressBar";

export default function YourJourney({ user }: { user: User | null }) {
  const [visitedCount, setVisitedCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  const [targetPlaces, setTargetPlaces] = useState(
    Number(user?.user_metadata?.targetCountries) || 50,
  ); //puteam sa fac un useEffect pentru asta, dar primeam eroare deoarece se re renderiza de inca o data (prima data ca s-a schimbat userul si apoi ca modific state-ul)

  //asta preia numarul de locuri vizitate si favorite din supabase
  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      const visitedPlaces = await getVisited(user.id);
      const favouritePlaces = await getFavourite(user.id);

      setVisitedCount(visitedPlaces.length);
      setFavCount(favouritePlaces.length);
    }
    loadStats();
  }, [user]);

  async function handleSaveTarget() {
    await supabase.auth.updateUser({
      data: {
        targetCountries: targetPlaces,
      },
    });
  }

  return (
    <section className="mt-8 rounded-3xl bg-[rgba(15,116,121,0.18)] backdrop-blur-xl border border-cyan-400/20 p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Your Journey</h2>

      {/* VISITED */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/60 text-sm">Visited Places</p>

          <p className="text-3xl font-bold text-green-400/90">{visitedCount}</p>
        </div>

        <Link
          href="/pages/visited"
          className=" px-4 py-2 rounded-xl bg-green-400/30 border border-green-400/50 hover:bg-green-400/40 transition-all"
        >
          View Visited
        </Link>
      </div>

      {/* FAVOURITES */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-white/60 text-sm">Favourite Places</p>

          <p className="text-3xl font-bold text-orange-400">{favCount}</p>
        </div>

        <Link
          href="/pages/favourite"
          className=" px-4 py-2 rounded-xl bg-orange-500/40 border border-orange-500/50 hover:bg-orange-500/50 transition-all"
        >
          View Favourite
        </Link>
      </div>

      {/* target countries */}
      <div className="mb-5">
        <p className="text-lg font-semibold">
          What is your target number of places you would like to visit?
        </p>

        <input
          type="number"
          min="0"
          value={targetPlaces}
          onChange={(e) => setTargetPlaces(Number(e.target.value))}
          className=" mt-3 w-24 px-4 py-2 mr-2  rounded-xl bg-white/10 border border-white/20 outline-none focus:border-cyan-400 "
        />

        <button
          onClick={() => handleSaveTarget()}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 cursor-pointer"
        >
          Save
        </button>
      </div>

      <ProgressBar value={visitedCount} max={targetPlaces} />

      <p className="mt-2 text-sm text-white/50">
        {visitedCount} / {targetPlaces} places visited
      </p>
    </section>
  );
}
