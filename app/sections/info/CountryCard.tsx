"use client";

import Image from "next/image";

export type CountryInfoType = {
  type: "country";
  data: {
    name: string;
    independent: boolean;
    region: string;
    subregion: string;
    population: number;
    capital: string[];
    startOfTheWeek: string;
    currencies: string;
    languages: string;
    flag: string;
  };
};

type Props = {
  data: CountryInfoType["data"];
};

export default function CountryCard({ data }: Props) {
  return (
    <div
      className="
        relative w-full max-w-md overflow-hidden rounded-3xl
        border border-[rgb(45,213,255)]
         bg-[linear-gradient(135deg,rgba(5,30,45,0.96),rgba(10,55,65,0.92),rgba(0,20,30,0.88))]
        p-6 text-white backdrop-blur-md
        transition-all duration-300
        hover:scale-[1.02]
        md:h-135
      "
    >
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(17, 44, 51, 0.18),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(3, 8, 10, 0.12),transparent_45%)] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5 flex items-center gap-4 border-b border-white/20 pb-4">
          <Image
            src={data.flag}
            alt="flag"
            width={80}
            height={55}
            className="rounded-xl border border-white/10 object-cover shadow-md"
          />

          <div>
            <p className="text-xl md:text-3xl ml-3 font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-300 bg-clip-text text-transparent animate-gradient">
              Country Information
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <span className="text-cyan-100/70">Name</span>
            <span className="font-semibold">{data.name}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <span className="text-cyan-100/70">Capital</span>
            <span className="font-semibold">{data.capital.join(", ")}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <span className="text-cyan-100/70">Region</span>
            <span className="font-semibold">{data.region}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <span className="text-cyan-100/70">Subregion</span>
            <span className="font-semibold">{data.subregion}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <span className="text-cyan-100/70">Population</span>
            <span className="font-semibold">
              {data.population.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <span className="text-cyan-100/70">Languages</span>
            <span className="font-semibold">{data.languages}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <span className="text-cyan-100/70">Currencies</span>
            <span className="font-semibold">{data.currencies}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
