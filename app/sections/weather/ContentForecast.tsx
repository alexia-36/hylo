"use client";
import { useState } from "react";

import ForecastCard from "./ForecastCard";

export type OpenMeteoForecast = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  hourly_units: {
    time: string;
    temperature_2m: string;
  };

  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    weather_code: number[];
  };

  daily_units: {
    time: string;
    temperature_2m_max: string;
  };

  daily: {
    time: string[];
    temperature_2m_max: number[];
  };
};

type Props = {
  forecast: OpenMeteoForecast | null;
};

type HourData = {
  time: string;
  temp: number;
  humidity: number;
  wind: number;
  weatherCode: number;
};

// functia de mai jos transforma
// "2026-04-05T12:00"
/// in //
//{ // "2026-04-05": [
// { time: "12:00", temp: 12.4 }
// ]}
function groupByDay(data: OpenMeteoForecast): Record<string, HourData[]> {
  const result: Record<string, HourData[]> = {};

  data.hourly.time.forEach((time, index) => {
    const [date, hour] = time.split("T");

    if (!result[date]) result[date] = [];

    result[date].push({
      time: hour,
      temp: data.hourly.temperature_2m[index],
      humidity: data.hourly.relative_humidity_2m[index],
      wind: data.hourly.wind_speed_10m[index],
      weatherCode: data.hourly.weather_code[index],
    });
  });
  return result;
}

// din 4 in 4 ore
function filterHours(hours: HourData[]): HourData[] {
  return hours.filter((_, index) => index % 4 === 0);
}

export default function ContentForecast({ forecast }: Props) {
  const [openedDay, setOpenedDay] = useState<string | null>(null);

  if (!forecast) return <div>loading...</div>;

  const grouped = groupByDay(forecast);
  const nextDays = forecast.daily.time.slice(1, 7);

  // ziua saptamanii
  const getDayName = (dateString: string) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  // format data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
    });
  }; // Output: "June 6"

  //cardurile
  const compEl = nextDays.map((day) => {
    const hours = grouped[day] || [];

    const mainHour = hours.find((h) => h.time === "12:00") || hours[0];

    const hoverHours = filterHours(hours);

    const dayName = getDayName(day);
    const formattedDate = formatDate(day);

    return (
      <ForecastCard
        key={day}
        day={day}
        dayName={dayName}
        formattedDate={formattedDate}
        mainHour={mainHour}
        hoverHours={hoverHours}
        isOpen={openedDay === day} //pentru a-l deschide
        onToggle={() => setOpenedDay((prev) => (prev === day ? null : day))} //pentru a-l inchide
      />
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-3  gap-y-6 md:gap-7 ">
      {compEl}
    </div>
  );
}
