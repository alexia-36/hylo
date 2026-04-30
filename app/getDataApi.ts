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
export async function getForecast(
  lat: number | undefined,
  long: number | undefined,
) {
  try {
    if (lat === undefined || long === undefined) return null;
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode&daily=temperature_2m_max,weathercode&current_weather=true&timezone=auto`,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch forecast data");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

//pt sectiunea de info, aici fac cerere la doua api-uri diferite, unul pentru tara si unul pentru oras, in functie de ce returneaza primul api (daca returneaza 404 inseamna ca nu a gasit o tara cu numele respectiv si atunci fac cerere la api-ul de oras)
export async function getInfo(location: string) {
  //aici am pus location pentru ca fac cerere la doua api-uri in functie de tara sau oras
  try {
    const res = await fetch(
      //asta face cere la tara
      `https://restcountries.com/v3.1/name/${location}?fullText=true`,
    );

    if (res.ok) {
      const data_country = await res.json();
      const c = data_country[0];
      console.log(data_country);
      return {
        type: "country",
        data: {
          name: c.name.common,
          independent: c.independent,
          region: c.region,
          subregion: c.subregion,
          population: c.population,
          capital: c.capital,
          startOfTheWeek: c.startOfWeek,
          currencies: Object.keys(c.currencies || {}).join(", "),
          languages: Object.values(c.languages || {}).join(", "),
          flag: c.flags.png,
        },
      };
    } else {
      //aici face cerere la oras
      const res = await fetch(
        `http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=alexia123`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch location info");
      }
      const data_city = await res.json();

      if (data_city.geonames && data_city.geonames.length > 0) {
        const location = data_city.geonames[0];

        // returnează exact structura așteptată de CityInfoType (returnez direct obiectul pt ca altfel trebuie sa fac data.geonames[0] in componenta si dupa trebuie sa modific si type InfoCity)
        return {
          type: "city",
          data: {
            name: location.name,
            countryName: location.countryName,
            fcodeName: location.fcodeName,
            population: location.population,
          },
        };
      }
    }
  } catch (err) {
    console.log(err);
  }
}
