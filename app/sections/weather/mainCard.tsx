"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OpenMeteoForecast } from "./ContentForecast";

export type WeatherType = {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  main: {
    temp: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
  };
};

type Props = {
  currentWeather: WeatherType | null;
  forecast: OpenMeteoForecast | null;
};

export default function CardComp({ currentWeather, forecast }: Props) {
  function getIcon(weatherMain?: string) {
    switch (weatherMain) {
      case "Clear":
        return "☀️";
      case "Clouds":
        return "☁️";
      case "Rain":
        return "🌧️";
      case "Drizzle":
        return "🌦️";
      case "Thunderstorm":
        return "⛈️";
      case "Snow":
        return "❄️";
      case "Mist":
      case "Fog":
      case "Haze":
        return "🌫️";
      default:
        return "";
    }
  }

  const icon = getIcon(currentWeather?.weather?.[0]?.main);

  //functie care preia care preia orele din ziua curenta din forecast si le formateaza intr-un array frumos cu ora si temp
  function getTodayHourly(forecast: OpenMeteoForecast | null) {
    if (!forecast) return [];

    const today = new Date().toISOString().split("T")[0];
    const result: { time: string; temp: number }[] = [];

    forecast.hourly.time.forEach((t, i) => {
      const [date, hour] = t.split("T");

      if (date === today) {
        result.push({
          time: hour,
          temp: forecast.hourly.temperature_2m[i],
        });
      }
    });

    return result.filter((_, i) => i % 4 === 0).slice(0, 6);
  }
  const todayHours = getTodayHourly(forecast);

  //mai jos sunt comenzi ca sa se afiseze frumos Miercuri 4 aprilie 3094
  const days = [
    "Duminică",
    "Luni",
    "Marți",
    "Miercuri",
    "Joi",
    "Vineri",
    "Sâmbătă",
  ];
  const months = [
    "ianuarie",
    "februarie",
    "martie",
    "aprilie",
    "mai",
    "iunie",
    "iulie",
    "august",
    "septembrie",
    "octombrie",
    "noiembrie",
    "decembrie",
  ];
  const getFormattedDate = () => {
    const date = new Date(); // obține data curentă
    const dayName = days[date.getDay()]; // extrage numele zilei (ex: "Miercuri")
    const day = date.getDate(); // extrage ziua lunii (ex: 4)
    const month = months[date.getMonth()]; // extrage numele lunii (ex: "aprilie")
    const year = date.getFullYear(); // extrage anul (ex: 3476)

    return `${day} ${month} ${year} - ${dayName}`; // returnează "Miercuri 4 aprilie 3476"
  };
  const formattedDate = getFormattedDate();

  return (
    <Card className="w-full max-w-sm mx-auto rounded-2xl hover:scale-[1.02] transition-all duration-300  border-2 border-[rgb(45,213,255)] bg-gradient-to-br from-[rgba(15,116,121,0.55)] via-[rgba(20,140,140,0.45)] to-[rgba(10,80,85,0.4)]">
      {currentWeather ? (
        <>
          {/* HEADER */}
          <CardHeader className="pb-2">
            <CardTitle className="text-center space-y-1">
              <h1 className="text-xl font-semibold text-white tracking-wide">
                {formattedDate}
              </h1>
              <p className="text-sm text-white/60 capitalize">
                {currentWeather?.weather?.[0]?.description}
              </p>
            </CardTitle>
          </CardHeader>

          {/* CONTENT */}
          <CardContent className="flex flex-col items-center gap-3 pt-2 mt-[-26px]">
            {/* ICON */}
            <div className="text-[80px] drop-shadow-lg">{icon}</div>

            {/* TEMP */}
            <h1 className="text-5xl font-bold text-white tracking-tight">
              {Math.round(currentWeather?.main?.temp)}°
            </h1>

            {/* DETAILS */}
            <div className="grid grid-cols-4 gap-4 mt-4 w-full text-center">
              <div className="flex flex-col">
                <span className="text-[11px] text-cyan-300 uppercase tracking-wider">
                  Humidity
                </span>
                <span className="text-white font-semibold">
                  {currentWeather?.main?.humidity}%
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-cyan-300 uppercase tracking-wider">
                  Wind
                </span>
                <span className="text-white font-semibold">
                  {currentWeather?.wind?.speed} km/h
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-cyan-300 uppercase tracking-wider">
                  Max
                </span>
                <span className="text-white font-semibold">
                  {Math.round(currentWeather?.main?.temp_max)}°
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-cyan-300 uppercase tracking-wider">
                  Min
                </span>
                <span className="text-white font-semibold">
                  {Math.round(currentWeather?.main?.temp_min)}°
                </span>
              </div>
            </div>

            {/* HOURLY STRIP */}
            {todayHours.length > 0 && (
              <div className="w-full mt-5 pt-3 border-t border-white/10">
                <div className="flex justify-between px-1">
                  {todayHours.map((h, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center text-xs group"
                    >
                      <span className="text-white/50 group-hover:text-white transition">
                        {h.time}
                      </span>
                      <span className="text-white font-medium">
                        {Math.round(h.temp)}°
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </>
      ) : (
        <div className="text-white text-center py-10 animate-pulse">
          Loading...
        </div>
      )}
    </Card>
  );
}
