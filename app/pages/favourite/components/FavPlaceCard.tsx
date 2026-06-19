"use client";

import { useState } from "react";
import Image from "next/image";

import NoteForm from "./NoteFrom";

type Props = {
  place: {
    id: string;
    name: string;
    imageUrl: string;
    note: string | null;
    updatedAt: Date;
  };
  handleViewDetails: (placeName: string) => void;
  handleDeleteOne: (placeId: string, placeName: string) => void;
};

//prettier-ignore
export default function FavPlaceCard({place, handleViewDetails, handleDeleteOne}: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [note, setNote] = useState<string>(place.note || "");

    const [lastUpdated, setLastUpdated] = useState(place.updatedAt); //asta e pt a da rerender la componenta NoteForm ca altfel nu apare data


//asta e functia de salvare in supabase, daca nu intelegi de ce nu am o functie de getNote uite-te la /favourite page.tsx la linia 106
async function handleSaveNote(){
    const res = await fetch("/api/favourite", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: place.id,
        note,
      }),
    });

    const updatedPlace = await res.json();

    setLastUpdated(updatedPlace.updatedAt);
    setIsFormOpen(false);
  }


  return (
    /*asta e div-ul pentru fiecare loc in parte*/
    <div
      key={place.id}
      className="group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20"
    >

      {/*overlay si poza */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={place.imageUrl}
          alt={place.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />



        {/* overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>

        {/* city name overlay */}
        <div className="absolute bottom-4 left-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            {place.name}
          </h2>
        </div>

        {/* remove button - appears on hover */}
      </div>

      {/*sectiunea de butoane */}
      <div className="p-5 flex items-center justify-center">
      
        <div className="flex items-center justify-between gap-4">
          {/*btn delete */}
          <button
            onClick={() => handleDeleteOne(place.id, place.name)}
            className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-500/80 text-white cursor-pointer"
          >
            Delete <span className="hidden xl:block">✖</span>
          </button>
          
           {/*btn add note */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-5 py-2 rounded-xl bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white cursor-pointer transition-all duration-300"
          >
            {note ? "Show Note" : "Add Note"}
          </button>

           {/*btn explore */}
          <button
            onClick={() => handleViewDetails(place.name)}
            className="px-5 py-3 rounded-xl  flex flex-col items-center  bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-medium transition-all cursor-pointer shadow-lg hover:shadow-xl"
          >
            Explore <svg   className="hidden xl:block" xmlns="http://www.w3.org/2000/svg" width="24" height="24"  fill="currentColor" viewBox="0 0 24 24" > <path d="M6 13h8.09l-3.3 3.29 1.42 1.42 5.7-5.71-5.7-5.71-1.42 1.42 3.3 3.29H6z"></path></svg>
          </button>
        </div>
      </div>

       <NoteForm 
         isOpen={isFormOpen} 
         note={note} 
         setNote={setNote} 
         onClose={() => setIsFormOpen(false)}
         onSave={handleSaveNote}
         lastUpdated={lastUpdated}
       />


    </div>
  );
}
