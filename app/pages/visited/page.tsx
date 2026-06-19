"use client";
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";

import removeVisited from "../../databaseFunctions/visited/removeVisited";
import removeAllVisited from "../../databaseFunctions/visited/removeAllVisited";
import getVisited from "../../databaseFunctions/visited/geVisited";

import VisitedPlaceCard from "./components/VisitedPlaceCard";

import updateVisitedRating from "../../databaseFunctions/visited/updateVisitedRating";

type VisitedPlace = {
  id: string;
  name: string;
  imageUrl: string;
  rating: number | null;
};

export default function Visited() {
  const [visited, setVisited] = useState<VisitedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const checkAuth = useCallback(async () => {
    //vezi explicatia in josul paginii /favourite
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return null;
    }

    return user;
  }, [router]);

  //functie care trimite utilizatorul in pagina home dupa ce apasa pe o tara/oras
  function handleViewDetails(placeName: string) {
    router.push(`/?city=${encodeURIComponent(placeName)}`);
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
  }, [checkAuth]);

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

  async function handleRatingChange(id: string, rating: number) {
    setVisited((prev) =>
      prev.map((place) => (place.id === id ? { ...place, rating } : place)),
    );
    await updateVisitedRating({
      id,
      rating,
    });
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
      <VisitedPlaceCard
        key={place.id}
        place={place}
        handleViewDetails={handleViewDetails}
        handleDeleteOne={handleDeleteOne}
        handleRatingChange={handleRatingChange}
      />
    );
  });

  return (
    <div
      className="min-h-screen   pb-12"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #0a1a1a 50%, #0a1f1a 100%)",
      }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/*header*/}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-emerald-400 via-teal-400 to-green-500 bg-clip-text text-transparent">
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

        {/*cards */}
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
              className="mt-8 px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer text-white font-medium"
            >
              Explore Places →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
