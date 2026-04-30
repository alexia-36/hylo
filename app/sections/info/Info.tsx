"use client";

import { useEffect, useState } from "react";

import { getInfo } from "@/app/getDataApi";
import CountryCard from "./CountryCard";
import CityCard from "./CityCard";

//aici dau import la tipuri
import { CountryInfoType } from "./CountryCard";
import { CityInfoType } from "./CityCard";

type InfoType = CountryInfoType | CityInfoType | null;

type Props = {
  search: string;
};

export default function Info({ search }: Props) {
  const [info, setInfo] = useState<InfoType>(null);

  useEffect(() => {
    async function getLocationInfo() {
      const data = await getInfo(search);
      if (data) {
        setInfo(data as InfoType);
      }
    }
    getLocationInfo();
  }, [search]);

  return (
    <div>
      {info ? (
        <div>
          {info.type === "country" && <CountryCard data={info.data} />}
          {info.type === "city" && <CityCard data={info.data} />}
        </div>
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </div>
  );
}
