"use client";

import { User } from "@supabase/supabase-js"; //importam tipul User pentru a putea specifica tipul variabilei userul care tine informatii despre userul logat
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation"; // il folosim pt a face redirect catre pagina de login/register daca userul nu e logat
import { supabase } from "@/lib/supabase"; //import supabase clientul pentru a putea folosi functiile de autentificare si inregistrare

import { WeatherType } from "./sections/weather/MainCard";

import Navbar from "./components/Navbar";
import Search from "./sections/Search";
import WeatherOutlet from "./sections/weather/WeatherOutlet";
import Info from "./sections/info/Info";
import Images from "./sections/images/Images";
import dynamic from "next/dynamic";

import { getWeather } from "./getDataApi";

import addVisited from "./databaseFunctions/visited/addVisited";
import removeVisited from "./databaseFunctions/visited/removeVisited";
import checkVisited from "./databaseFunctions/visited/checkVisited";
import addFavourite from "./databaseFunctions/favourite/addFavourite";
import removeFavourite from "./databaseFunctions/favourite/removeFavourite";
import checkFavourite from "./databaseFunctions/favourite/checkFavourite";

import { getImages } from "./getDataApi";

const Map = dynamic(() => import("./sections/map/Map"), {
  ssr: false,
});

//prettier-ignore
export default function Home() {
  const [inputVal, setInputVal] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherType | null>(null); 

  const [search, setSearch] = useState("London"); //asta e inputul full,  practic reprezinta orasul/tara scrisa in input in totalitate si asta e folosit pentru a face cerere la api-uri 

  const [isVisited, setIsVisited] = useState(false);  //asta e pt a sti ce stare sa ii dau butonului fie addVisited fie removeFromVisited, fac asta pentru a putea adauga la visited si a sterge de la visited si din pagina orasului/tarii nu doar din pagina visited
  const [isFavourite, setIsFavourite] = useState(false); //asta e pt a sti ce stare sa ii dau butonului de addFavourite, fac asta pentru a putea adauga la favourite si din pagina orasului/tarii nu doar din pagina favourite

  const searchParams = useSearchParams(); //aici stochez numele locului(daca exista) primit prin URL de la visited sau favorite

  const router = useRouter(); //il folosim pentru a face redirect catre pagina de register/login daca utilizatorul nu e logat

  const [userul, setUserul] = useState<User | null>(null);

  const [placeNotFound, setPlaceNotFound] = useState(false);




//asta o apelez doar daca apas efectiv pe butoanele de addVisited sau addFav sau pe paginile visited si fav
async function checkAuth(){ 
  const { data: { user } } = await supabase.auth.getUser();

  if(!user){
    router.push("/login");
    return null;
  }
  return user;
}

//asta verifca daca avem sau nu user logat fara sa faca redirect, e pt logica useEffect-ului urmator:
//adica daca nu am user nu va fi nevoie sa stiu ce stare are butonul de addVisited sau addFav deci doar ies din functie si ca sa vad daca am user, trebuie sa vb cu supabase si asta face practic acest useEffect
useEffect(() => {
  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUserul(user);
  }
  loadUser();
}, []);

//aflu daca orasul/tara pe care sunt acum e sau nu vizitata ==> ca sa stiu de denumire dau la butonul de addVisited
  useEffect(()=>{
    async function verifyVisited(){
      if (!userul) {  //daca userul nu e logat, el nu are nevoie de logica de switch pe butoane deci setez isVisited pe false si ies din functie
        setIsVisited(false);
        return;
      }
        const visited = await checkVisited(search, userul.id);
        setIsVisited(visited);
      }
      verifyVisited();

  }, [search, userul]) //aici am adaugat userul ca si dependinta pentru ca atunci cand se schimba starea userului (de ex cand se logheaza sau delogheaza) sa se verifice din nou daca locul e vizitat sau nu si sa se seteze corect butonul de addVisited




//aflu daca orasul/tara pe care sunt acum e sau nu adaugata la favourite ==> ca sa stiu de denumire dau la butonul de addFavourite
  useEffect(()=>{
    async function verifyFavourite(){
      if (!userul) {  //daca userul nu e logat, el nu are nevoie de logica de switch pe butoane deci setez isVisited pe false si ies din functie
        setIsFavourite(false);
        return;
      }
        const favourite = await checkFavourite(search, userul.id);
        setIsFavourite(favourite);
      }
      verifyFavourite();

  }, [search, userul]) //aici am adaugat userul ca si dependinta pentru ca atunci cand se schimba starea userului (de ex cand se logheaza sau delogheaza) sa se verifice din nou daca locul e adaugat la favorite sau nu si sa se seteze corect butonul de addFavourite


  //asta initializeaza inputul, cu info din url (daca vin de pe visited sau fav) sau cu London by default
  useEffect(()=>{
    async function initializeSearch(){
      const place = searchParams.get("city") || "London";

      setInputVal(place);
      setSearch(place);

      const data = await getWeather(place);
    setCurrentWeather(data);
    }
    initializeSearch();
  }, [searchParams])



  async function addVisitedInSupabase(){
    const user = await checkAuth();
    if (!user) return;

    //preiau o imagine cu acea tara/oras
    const imagesData = await getImages(search);

    let stare;
    if(imagesData && imagesData.length > 0){
      const imageUrl = imagesData[0].small; //aici iau prima imagine din rezultate
       stare = await addVisited({ name: search, imageUrl: imageUrl,   userId: user.id}); //aici trimit numele si url-ul imaginii catre functia care face cererea catre api-ul de visited si primesc nimic inapoi
    }else{
      console.log("No images found for this location");
    }
    if(stare){
      setIsVisited(true);
    }
  }
  async function removeVisitedFromSupabase(){
    const user = await checkAuth();
    if (!user) return;

    await removeVisited({name: search, userId: user.id});
    setIsVisited(false);
  }

  async function addFavouriteInSupabase() {
      const user = await checkAuth();
    if (!user) return;

    //preiau o imagine cu acea tara/oras
    const imagesData = await getImages(search);

    let stare;
    if(imagesData && imagesData.length > 0){
      const imageUrl = imagesData[0].small;; //aici iau prima imagine din rezultate
       stare = await addFavourite({ name: search, imageUrl: imageUrl,   userId: user.id}); //aici trimit numele si url-ul imaginii catre functia care face cererea catre api-ul de favourite si primesc nimic inapoi
    }else{
      console.log("No images found for this location");
    }
    if(stare){
      setIsFavourite(true);
    }


}
async function removeFavouriteFromSupabase(){
   const user = await checkAuth();
    if (!user) return;

    await removeFavourite({name: search, userId: user.id});
    setIsFavourite(false);
}


if (placeNotFound) {
  return (
    <div className="flex flex-col items-center justify-center gap-20">
      <Navbar />
      <Search
        inputVal={inputVal}
        setInputVal={setInputVal}
        setCurrentWeather={setCurrentWeather}
        setSearch={setSearch}
        setPlaceNotFound={setPlaceNotFound}
      />

      <div className="flex justify-center items-center ">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">
            This place can not be found
          </h2>
          <p className="mt-2 text-white/70">
            Try searching for another city or country.
          </p>
        </div>
      </div>
    </div>
  );
}

  return (
       <div className=" flex flex-col items-center justify-center gap-20 ">
      <Navbar />
      <Search
        inputVal={inputVal}
        setInputVal={setInputVal}
        setCurrentWeather={setCurrentWeather}
        setSearch={setSearch}
        setPlaceNotFound={setPlaceNotFound}
      />

      {/**buttons database section*/}
      <div className="flex space-x-4 -mt-10">
        {isVisited ? (
            <button onClick={() => removeVisitedFromSupabase()} className="text-black px-5 py-2 ml-5  rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer  font-medium">
              Remove from visited
            </button>
          ) : (
            <button onClick={() => addVisitedInSupabase()} className="text-black px-5 py-2 ml-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer  font-medium">
              Add visited
            </button>
          )}
        
        {isFavourite ? (
            <button onClick={() => removeFavouriteFromSupabase()} className="px-5 py-2 mr-5 rounded-xl bg-amber-500 hover:bg-amber-400 transition-all cursor-pointer">
              Remove from favourite
            </button>
          ) : (
            <button onClick={() => addFavouriteInSupabase()} className="px-5 py-2 mr-5  rounded-xl bg-amber-500 hover:bg-amber-400 transition-all cursor-pointer">
              Add to favourite
            </button>
          )}
      </div>

      {/*weather section*/}
      <div className="flex flex-col justify-center items-center mt-5">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          The Weather in 
          <span className="text-3xl md:text-4xl ml-3 font-extrabold bg-linear-to-r from-cyan-300 via-blue-400 to-teal-300 bg-clip-text text-transparent animate-gradient">
            {search.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
          </span>
        </h1>
        <WeatherOutlet currentWeather={currentWeather} />
      </div>

         <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:-mt-5 -mt-20 mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
              <div className="w-full flex justify-center">
                <Info search={search} />
              </div>

              <div className="w-full flex justify-center">
                <Images name={search} />
              </div>

              <div className="w-full flex justify-center">
                <Map cityName={search} />
              </div>
            </div>
          </div>

    </div>
   
  );
}
