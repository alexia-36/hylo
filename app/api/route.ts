export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const city = searchParams.get("city") || "";
    if (!city) {
      return new Response(JSON.stringify({ error: "Missing city" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const encodeCity = encodeURIComponent(city); //elimina spatiile din oras ex New York
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeCity}`;

    const res = await fetch(url);
    // dacă wikipedia returnează 404 sau alt status, propagăm eroarea
    if (!res.ok) {
      const text = await res.text();
      return new Response(text, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();

    //trimitem json catre frontend
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
