"use client";

import { getWeather } from "../../app/getDataApi";
import { WeatherType } from "./weather/MainCard";

type Props = {
  inputVal: string;
  setInputVal: (value: string) => void;
  setCurrentWeather: (value: WeatherType | null) => void;
  setSearch: (value: string) => void; //asta e pt titlul sectiunii weather
  setPlaceNotFound: (value: boolean) => void;
};
//prettier-ignore
export default function Search({inputVal, setInputVal, setCurrentWeather, setSearch, setPlaceNotFound}: Props) {

  //functie care face fetch la api cu numele orasului/tarii
  async function getInfoWeather() {
    const data = await getWeather(inputVal);
    if(data.cod === "404"){
      setPlaceNotFound(true);
      setCurrentWeather(null);
      return;

    }
    setPlaceNotFound(false);
    setSearch(inputVal);
    setCurrentWeather(data);
  }

  //asta se apeleaza o singura daca la montarea componentei, ca sa am ceva afisat inainte sa caut eu un oras
  // useEffect(() => {
  //   async function getFirstWeather() {
  //     const data = await getWeather("London");
  //     setInputVal("London");
  //     setCurrentWeather(data);
  //   }
  //   getFirstWeather();
  // }, [setCurrentWeather, setInputVal]);

  return (
    <form className="flex items-center justify-between gap-2 w-full sm:-mt-5 md:mt-0 max-w-xs sm:max-w-md mx-auto bg-white/5 backdrop-blur-md border border-[rgb(41,86,122)] rounded-xl px-3 py-2">
      <input
        type="text"
        placeholder="Enter a city..."
        required
        value={inputVal}
        className="bg-transparent outline-none text-[#e6f1f1] placeholder:text-gray-400 text-sm px-2 w-full"
        onChange={(e) => setInputVal(e.currentTarget.value)}
      />

      <button
        onClick={(e) => {
          e.preventDefault();
          getInfoWeather();
          
        }}
        className="cursor-pointer bg-linear-to-br from-[#0f3a34] to-[#02111f] hover:opacity-80 transition-all duration-200 rounded-lg p-2 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          fill="currentColor"
          viewBox="0 0 24 24"
          className="text-[#b8cfd0]"
        >
          <path d="M18 10c0-4.41-3.59-8-8-8s-8 3.59-8 8 3.59 8 8 8c1.85 0 3.54-.63 4.9-1.69l5.1 5.1L21.41 20l-5.1-5.1A8 8 0 0 0 18 10M4 10c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6" />
        </svg>
      </button>
    </form>
  );
}
