"use client";

type HourData = {
  time: string;
  temp: number;
  humidity: number;
  wind: number;
  weatherCode: number;
};

type Props = {
  day: string;
  dayName: string;
  formattedDate: string;
  mainHour: HourData;
  hoverHours: HourData[];
  isOpen: boolean;
  onToggle: () => void;
};

function getWeatherIcon(code: number) {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "☁️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

export default function ForecastCard({
  dayName,
  formattedDate,
  mainHour,
  hoverHours,
  isOpen,
  onToggle,
}: Props) {
  return (
    <div
      onClick={() => onToggle()}
      className="group min-h-50 w-70 md:w-50 relative bg-gradient-to-br from-[rgba(15,116,121,0.55)] via-[rgba(20,140,140,0.45)] to-[rgba(10,80,85,0.4)] p-5 rounded-xl cursor-pointer  transition-all duration-300   shadow-md shadow-black/30  hover:scale-[1.02] border-2 border-[rgb(45,213,255)]"
    >
      <div className="group-hover:hidden">
        <div className="text-center">
          <p className="text-white font-bold text-lg">{dayName}</p>
          <p className="text-white/60 text-xs mt-1">{formattedDate}</p>
        </div>

        <div className="text-4xl text-center mt-2">
          {getWeatherIcon(mainHour?.weatherCode)}
        </div>

        <p className="text-white text-lg text-center mt-2 font-semibold">
          {Math.round(mainHour?.temp)}°C
        </p>

        <div className="flex justify-between text-xs text-white/70 mt-3">
          <span>{mainHour?.humidity}% 💧</span>
          <span>{Math.round(mainHour?.wind)} km/h 💨</span>
        </div>
      </div>

      {/* HOVER */}
      <div className="absolute inset-0 hidden group-hover:flex flex-col justify-center items-center bg-[rgba(8,49,59,0.8)] rounded-xl p-4 z-10">
        <div className="flex flex-col gap-1 w-full">
          {hoverHours.slice(0, 8).map((h, i) => (
            <div
              key={i}
              className="flex justify-between text-white text-sm border-b border-white/20 py-1"
            >
              <span>{h.time}</span>
              <span>{Math.round(h.temp)}°C</span>
            </div>
          ))}
        </div>
      </div>

      {/*logica cu vreme pentru telefoane */}
      {isOpen && (
        <div className="absolute inset-0 flex md:hidden flex-col justify-center items-center bg-[rgba(8,49,59,0.8)] rounded-xl p-4 z-10">
          <div className="flex flex-col gap-1 w-full">
            {hoverHours.slice(0, 8).map((h, i) => (
              <div
                key={i}
                className="flex justify-between text-white text-sm border-b border-white/20 py-1"
              >
                <span>{h.time}</span>
                <span>{Math.round(h.temp)}°C</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
