"use client"; //componenta asta e practic ca un page.tsx in care combin si mainCard si contentForecast

import { useEffect, useState } from "react";

import MainCard from "./MainCard";
import ContentForecast from "./ContentForecast";
import { WeatherType } from "./MainCard";

import { getForecast } from "@/app/getDataApi";

type Props = {
  currentWeather: WeatherType | null;
};

export default function WeatherOutlet({ currentWeather }: Props) {
  const [forecast, setForecast] = useState(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  useEffect(() => {
    try {
      const lat = currentWeather?.coord.lat;
      const lon = currentWeather?.coord.lon;

      if (lat === undefined || lon === undefined) return;

      async function getForecastData() {
        setIsLoadingForecast(true);
        const data = await getForecast(lat!, lon!);
        setForecast(data);

        // console.log("DATA FROM API =", data);

        setIsLoadingForecast(false);
      }
      getForecastData();
    } catch (err) {
      console.log(err);
    }
  }, [currentWeather]);

  // Loading complet - când nu avem currentWeather deloc
  if (!currentWeather) {
    return (
      <div className="w-60  h-80  rounded-lg mt-6 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900">
        {/* Container animat */}
        <div className="relative">
          {/* Inel de încărcare rotativ */}
          <div className="relative w-20 h-20">
            <div className="w-full h-full rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
          </div>
        </div>

        <div className="text-center">
          <p className="mt-4 text-white/80">loading weather</p>
        </div>
      </div>
    );
  }

  // Loading parțial - avem currentWeather dar încă se încarcă prognoza
  if (isLoadingForecast) {
    return (
      <div className="flex flex-col justify-center items-center sm:flex-row p-6 rounded-2xl mx-4 my-4 gap-5">
        {/* MainCard - afișat imediat cu datele curente */}
        <MainCard currentWeather={currentWeather} forecast={null} />

        {/* Skeleton pentru ContentForecast cu același stil de loading */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md">
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="relative">
              <div className="relative w-16 h-16">
                <div className="w-full h-full rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="mt-4 text-white/80 text-sm">loading forecast...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center sm:flex-col lg:flex-row p-6 rounded-2xl  my-4 gap-5">
      <MainCard currentWeather={currentWeather} forecast={forecast} />
      <ContentForecast forecast={forecast} />
    </div>
  );
}
