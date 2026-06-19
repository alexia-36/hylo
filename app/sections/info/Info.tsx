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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getLocationInfo() {
      setIsLoading(true);
      try {
        const data = await getInfo(search);
        if (data) {
          setInfo(data as InfoType);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getLocationInfo();
  }, [search]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl mx-4 my-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md">
          <div className="flex flex-col items-center justify-center min-h-75">
            <div className="relative">
              <div className="relative w-16 h-16">
                <div className="w-full h-full rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="mt-4 text-white/80 text-sm">
                Loading information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {info && (
        <div>
          {info.type === "country" && <CountryCard data={info.data} />}
          {info.type === "city" && <CityCard data={info.data} />}
        </div>
      )}
    </div>
  );
}
