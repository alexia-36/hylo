"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar";

import removeFavourite from "../../databaseFunctions/favourite/removeFavourite";
import removeAllFavourite from "../../databaseFunctions/favourite/removeAllFavourite";

import getFavourite from "../../databaseFunctions/favourite/getFavourite";

import FavPlaceCard from "./components/FavPlaceCard";

type FavPlace = {
  id: string;
  name: string;
  imageUrl: string;
  note: string;
  updatedAt: Date;
};

export default function Favourite() {
  const [fav, setFav] = useState<FavPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const checkAuth = useCallback(async () => {
    //vezi explicatia in josul paginii
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return null;
    }

    return user;
  }, [router]);

  //asta initializeaza state-ul fav din baza de date cu locurile care au fost adaugate la favourite atunci cand intru pe pagina
  useEffect(() => {
    async function getFavouritePlaces() {
      //verific daca userul e autentificat (e acelasi cod la in checkUser, dar )
      const user = await checkAuth();
      if (!user) return null;

      try {
        const places = await getFavourite(user.id);
        setFav(places);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    getFavouritePlaces();
  }, [checkAuth]);

  //functie care trimite utilizatorul in pagina home dupa ce apasa pe o tara/oras
  function handleViewDetails(placeName: string) {
    router.push(`/?city=${encodeURIComponent(placeName)}`);
  }

  //functie care sterge toate orasele de la favourite
  async function handleDeleteAll() {
    const user = await checkAuth();
    if (!user) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete all visited places?",
    );

    if (!confirmed) return;

    await removeAllFavourite(user.id);
    setFav([]);
  }

  async function handleDeleteOne(id: string, name: string) {
    const user = await checkAuth();
    if (!user) return;

    await removeFavourite({
      name,
      userId: user.id,
    });
    setFav((prevFav) => prevFav.filter((place) => place.id !== id));
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1a1a1a 100%)",
        }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-white/80">Loading your favourite places...</p>
        </div>
      </div>
    );
  }

  //aceste place contin fiecare obiectul cu tot cu note, de aia nu trebuie sa creez functie separata pt getNote
  const favEl = fav.map((place) => {
    return (
      <FavPlaceCard
        key={place.id}
        place={place}
        handleViewDetails={handleViewDetails}
        handleDeleteOne={handleDeleteOne}
      />
    );
  });

  return (
    <div
      className="min-h-screen pb-10"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1a1a1a 50%, #1e1a0f 100%)",
      }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
              Favourite Places
            </h1>
          </div>

          <p className="text-white/70 text-lg">
            Your most loved destinations around the world
          </p>

          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-amber-300 font-semibold">{fav.length}</span>

            <span className="text-white/70 text-sm">
              {fav.length === 1 ? "place saved" : "places saved"}
            </span>
          </div>

          {fav.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleDeleteAll}
                className="px-5 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 transition-all cursor-pointer text-white font-medium text-sm"
              >
                Remove All
              </button>
            </div>
          )}
        </div>

        {/* cards */}
        {fav.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {favEl}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-15">
            <h2 className="text-2xl font-bold text-white mb-2">
              No favourite places yet
            </h2>

            <p className="text-white/50 max-w-md">
              Save the destinations you love the most and they will appear here.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-8 px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all cursor-pointer text-white font-medium"
            >
              Explore Places →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

//deci explicatia cu callback
//situatia fara callback
// useEffect-ul se randeaza o singura data la inceput
// doar ca nextjs vede ca in useEffect eu apelez functia checkAuth deci depinde de ea(fapt pentru care am adaugat-o la dependente)
// chestia e ca checkAuth se INREGISTREAZA, nu se apeleaza la fiecare render a componentei, dar se inregistreaza diferit la fiecare render
// // render cauzat de actualizarea unui state de ex
// checkAuth se schimba între render-uri desi are acelasi date:
// Render 1 -> checkAuth = funcția #1
// Render 2 -> checkAuth = funcția #2
// Render 3 -> checkAuth = funcția #3
// deci faptul ca functia checkAuth se inregistreaza diferit la fiecare render il determina pe useEffect sa se execute si el de fiecare data, pt ca vede ca functia checkAuth e alta, desi e tot aia
//deci desi eu vreau ca useEffect sa ruleze o singura data la inceput, faptul ca functia checkAuth se inregistreaza diferit la fiecare randare a componentei determina ca si useEffect sa se randeze la fiecare randare a componentei lucru pe care nu il vreau
//pentru asta exista useCallback

// face useCallback?
// useCallback îi spune lui React:
// "Păstrează aceeași funcție între render-uri, cât timp dependențele nu se schimbă."
// Render 1 -> checkAuth = funcția #1
// Render 2 -> checkAuth = funcția #1
// Render 3 -> checkAuth = funcția #1

// Deci React compară:
//vechi: checkAuth -> funcția #1
// nou:   checkAuth -> funcția #1
//și vede că nu s-a schimbat, așa că useEffect nu rulează din nou.

// fără useCallback, efectul s-ar executa din nou după fiecare setFav sau alt re-render, deoarece checkAuth este recreată la fiecare render.
// De aceea next spune:
// „Ori include checkAuth în dependențe, ori fă-o stabilă (de exemplu cu useCallback) sau mut-o în afara componentei.”
