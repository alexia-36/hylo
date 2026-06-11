//pt sectiunea de info, aici fac cerere la doua api-uri diferite, unul pentru tara si unul pentru oras, in functie de ce returneaza primul api (daca returneaza 404 inseamna ca nu a gasit o tara cu numele respectiv si atunci fac cerere la api-ul de oras)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    if (!location) {
      return Response.json({ error: "Location required" }, { status: 400 });
    }

    // pt tara
    const countryRes = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(location)}?fullText=true`,
    );

    if (countryRes.ok) {
      const data = await countryRes.json();
      const c = data[0];

      return Response.json({
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
