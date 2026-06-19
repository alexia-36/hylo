//pt sectiunea de info, aici fac cerere la doua api-uri diferite, unul pentru tara si unul pentru oras, in functie de ce returneaza primul api (daca returneaza 404 inseamna ca nu a gasit o tara cu numele respectiv si atunci fac cerere la api-ul de oras)

type Country = {
  names: {
    common: string;
  };
  region: string;
  subregion?: string;
  population: number;
  capitals?: { name: string }[];
  date?: {
    start_of_week?: string;
  };
  currencies?: { code: string }[];
  languages?: { name: string }[];
  flag?: {
    url_png?: string;
  };
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    if (!location) {
      return Response.json({ error: "Location required" }, { status: 400 });
    }

    // pt tara
    const countryRes = await fetch(
      `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(location)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.RESTCOUNTRIES_API_KEY}`,
        },
      },
    );

    const dataCountries = await countryRes.json();
    const countries = dataCountries.data?.objects ?? [];

    if (countryRes.ok && countries.length > 0) {
      const c =
        countries.find(
          (country: Country) =>
            country.names.common.toLowerCase() === location.toLowerCase(),
        ) || countries[0];

      return Response.json({
        type: "country",
        data: {
          name: c.names.common,
          region: c.region,
          subregion: c.subregion,
          population: c.population,

          capital:
            c.capitals?.map((capital: { name: string }) => capital.name) || [],

          startOfTheWeek: c.date?.start_of_week || "",

          currencies:
            c.currencies
              ?.map((currency: { code: string }) => currency.code)
              .join(", ") || "",

          languages:
            c.languages
              ?.map((language: { name: string }) => language.name)
              .join(", ") || "",

          flag: c.flag?.url_png || "",
        },
      });
    }

    // 2. Dacă nu e țară, încearcă oraș
    const cityRes = await fetch(
      `http://api.geonames.org/searchJSON?q=${encodeURIComponent(
        location,
      )}&maxRows=1&username=alexia123`,
    );

    if (!cityRes.ok) {
      return Response.json(
        { error: "Failed to fetch city info" },
        { status: 500 },
      );
    }

    const cityData = await cityRes.json();

    if (cityData.geonames?.length > 0) {
      const city = cityData.geonames[0];

      return Response.json({
        type: "city",
        data: {
          name: city.name,
          countryName: city.countryName,
          fcodeName: city.fcodeName,
          population: city.population,
        },
      });
    }

    return Response.json({ error: "Location not found" }, { status: 404 });
  } catch (err) {
    console.log(err);

    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
