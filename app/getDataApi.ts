//aici e pt vremea curenta
export async function getWeather(city: string) {
  try {
    const res = await fetch(`/api/weather?city=${city}`);
    if (!res.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

//aici e pt vremea pe 7 zile
export async function getForecast(lat: number, long: number) {
  const res = await fetch(`/api/forecast?lat=${lat}&long=${long}`);
  return res.json();
}

//pt sectiunea de info, aici fac cerere la doua api-uri diferite, unul pentru tara si unul pentru oras, in functie de ce returneaza primul api (daca returneaza 404 inseamna ca nu a gasit o tara cu numele respectiv si atunci fac cerere la api-ul de oras)
export async function getInfo(location: string) {
  try {
    const res = await fetch(
      `/api/info?location=${encodeURIComponent(location)}`, //elimina spatiile
    );

    if (!res.ok) {
      throw new Error("Failed to fetch info");
    }

    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}

//pt imagini din sectiunea de imagini
export async function getImages(name: string) {
  const res = await fetch(`/api/images?query=${encodeURIComponent(name)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch images");
  }

  return await res.json();
}
