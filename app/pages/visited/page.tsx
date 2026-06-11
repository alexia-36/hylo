"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Navbar from "../../components/Navbar";

import removeVisited from "../../databaseFunctions/visited/removeVisited";
import removeAllVisited from "../../databaseFunctions/visited/removeAllVisited";
import getVisited from "../../databaseFunctions/visited/geVisited";

type VisitedPlace = {
  id: string;
  name: string;
  imageUrl: string;
};

export default function Visited() {
  const [visited, setVisited] = useState<VisitedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  async function checkAuth() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return null;
    }
    return user;
  }

  //asta initializeaza state-ul visited din baza de date cu locurile vizitate atunci cand intru pe pagina
  useEffect(() => {
    async function getVisitedPlaces() {
      const user = await checkAuth();
      if (!user) return;

      try {
        const places = await getVisited(user.id);
        setVisited(places);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    getVisitedPlaces();
  }, []);

  //functie care trimite utilizatorul in pagina home dupa ce apasa pe o tara/oras
  function handleViewDetails(placeName: string) {
    router.push(`/?city=${encodeURIComponent(placeName)}`);
  }

  //functie care sterge toate orasele de la visited
  async function handleDeleteAll() {
    const user = await checkAuth();
    if (!user) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete all visited places?",
    );

    if (!confirmed) return;

    await removeAllVisited(user.id);
    setVisited([]);
  }

  async function handleDeleteOne(id: string, name: string) {
    const user = await checkAuth();
    if (!user) return;

    await removeVisited({
      name,
      userId: user.id,
    });
    setVisited((prevFav) => prevFav.filter((place) => place.id !== id));
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #0a1a1a 100%)",
        }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-white/80">Loading your visited places...</p>
        </div>
      </div>
    );
  }

  const placesEl = visited.map((place) => {
    return (
      <div
        key={place.id}
        className="group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20"
      >
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={place.imageUrl}
            alt={place.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

          {/* delete button - appears on hover */}
          <button
            onClick={() => handleDeleteOne(place.id, place.name)}
            className="absolute top-4 left-4 cursor-pointer bg-red-500/90 hover:bg-red-600 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
            aria-label="Remove from visited"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* city name overlay */}
          <div className="absolute bottom-4 left-4">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              {place.name}
            </h2>
          </div>
        </div>

        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm">Already visited destination</p>
          </div>

          <button
            onClick={() => handleViewDetails(place.name)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium transition-all cursor-pointer shadow-lg hover:shadow-xl"
          >
            View Details →
          </button>
        </div>
      </div>
    );
  });

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #0a1a1a 50%, #0a1f1a 100%)",
      }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 bg-clip-text text-transparent">
              Visited Places
            </h1>
          </div>

          <p className="text-white/70 text-lg">
            Places you have already explored
          </p>

          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-emerald-300 font-semibold">
              {visited.length}
            </span>
            <span className="text-white/70 text-sm">
              {visited.length === 1 ? "place visited" : "places visited"}
            </span>
          </div>

          {visited.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleDeleteAll}
                className="px-5 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 transition-all cursor-pointer text-white font-medium text-sm"
              >
                Delete All
              </button>
            </div>
          )}
        </div>

        {visited.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {placesEl}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-15">
            <h2 className="text-2xl font-bold text-white mb-2">
              No visited places yet
            </h2>

            <p className="text-white/50 max-w-md">
              Start exploring and mark places as visited to see them here.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-8 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer text-white font-medium"
            >
              Explore Places →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
