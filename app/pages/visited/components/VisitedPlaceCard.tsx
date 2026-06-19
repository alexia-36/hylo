"use client";

import Image from "next/image";
import Rating from "./Rating";

type Props = {
  place: {
    id: string;
    name: string;
    imageUrl: string;
    rating: number | null;
  };
  handleViewDetails: (placeName: string) => void;
  handleDeleteOne: (placeId: string, placeName: string) => void;
  handleRatingChange: (id: string, rating: number) => void;
};

//prettier-ignore
export default function VisitedPlaceCard({ place, handleViewDetails, handleDeleteOne, handleRatingChange,
}: Props) {
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
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>

        {/* city name overlay */}
        <div className="absolute bottom-4 left-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            {place.name}
          </h2>
        </div>
      </div>

      <div className="p-5 flex items-center justify-between -mt-4">
        <div>
          <p className="text-white/60 text-sm">Already visited destination</p>
        </div>

        {/*sectiune de delete si view details */}
        <div className="p-5 flex items-center justify-between gap-4">
          <button
            onClick={() => handleDeleteOne(place.id, place.name)}
            className="px-5 py-1 rounded-xl bg-red-500 hover:bg-red-500/70 text-white cursor-pointer"
          >
            Delete ✖
          </button>

          <button
            onClick={() => handleViewDetails(place.name)}
            className="px-5 py-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium transition-all cursor-pointer shadow-lg hover:shadow-xl"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Rating */}
      <div className="-mt-4 mx-2 mb-2 rounded-xl border border-white/10 bg-white/5  py-3 backdrop-blur-sm">
        <p className="mb-1 text-center text-sm font-medium text-white/70">
          Rate your experience
        </p>

        <div className="flex justify-center">
          <Rating
            rating={place.rating ?? 0}
            onChange={(star) => handleRatingChange(place.id, star)}
          />
        </div>

        <p className="mt-1 text-center text-xs text-white/40">
          {place.rating
            ? `${place.rating}/5 stars`
            : "Click a star to leave a rating"}
        </p>
      </div>
    </div>
  );
}
