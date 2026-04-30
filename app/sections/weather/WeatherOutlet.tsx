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

  useEffect(() => {
    const lat = currentWeather?.coord.lat; //pt forecast imi trebuie lat si long nu numele orasului
    const long = currentWeather?.coord.lon;

    async function getForecastData() {
      const data = await getForecast(lat, long);
      setForecast(data);
    }
    getForecastData();
  }, [currentWeather]);

  return (
    <div className="flex flex-col justify-center items-center sm:flex-row p-6 rounded-2xl mx-4 my-4 gap-5">
      <MainCard currentWeather={currentWeather} forecast={forecast} />
      <ContentForecast forecast={forecast} />
    </div>
  );
}
