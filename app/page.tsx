"use client";

import Navbar from "./components/Navbar";
import Search from "./sections/Search";
import { useState } from "react";

export default function Home() {
  const [inputVal, setInputVal] = useState("");

  return (
    <div className=" flex flex-col items-center justify-center gap-20 ">
      <Navbar />
      <Search inputVal={inputVal} setInputVal={setInputVal} />
    </div>
  );
}
