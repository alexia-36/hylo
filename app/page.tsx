"use client";

import { useState } from "react";

import { WeatherType } from "./sections/weather/MainCard";

import Navbar from "./components/Navbar";
import Search from "./sections/Search";
import WeatherOutlet from "./sections/weather/WeatherOutlet";
import Info from "./sections/info/Info";

//prettier-ignore
export default function Home() {
  const [inputVal, setInputVal] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherType | null>(null);


  const [search, setSearch] = useState("London"); //asta e inputul full,  practic reprezinta orasul/tara scrisa in input in totalitate si asta e folosit pentru a face cerere la api-uri 


  return (
    <div className=" flex flex-col items-center justify-center gap-20 ">
      <Navbar />
      <Search
        inputVal={inputVal}
        setInputVal={setInputVal}
        setCurrentWeather={setCurrentWeather}
        setSearch={setSearch}
      />

      {/*weather section*/}
      <div className="flex flex-col justify-center items-center mt-5">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white">The Weather in 
         <span className="text-2xl md:text-4xl ml-3 font-extrabold bg-gradient-to-r from-cyan-300 via-blue-400 to-teal-300 bg-clip-text text-transparent animate-gradient">
          {search.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
      
         </span>
        </h1>
        <WeatherOutlet currentWeather={currentWeather} />
      </div>

      {/*info section */}
      <Info search={search}/>


    </div>
  );
}
