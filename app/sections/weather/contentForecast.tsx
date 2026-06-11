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
    relativehumidity_2m: number[];
    windspeed_10m: number[];
    weathercode: number[];
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
      humidity: data.hourly.relativehumidity_2m[index],
      wind: data.hourly.windspeed_10m[index],
      weatherCode: data.hourly.weathercode[index],
    });
  });

  return result;
}

// din 4 in 4 ore
function filterHours(hours: HourData[]): HourData[] {
  return hours.filter((_, index) => index % 4 === 0);
}

export default function ContentForecast({ forecast }: Props) {
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
      />
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3  gap-y-6 md:gap-7 ">
      {compEl}
    </div>
  );
}
