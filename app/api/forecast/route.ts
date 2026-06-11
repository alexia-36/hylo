export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get("lat");
  const long = searchParams.get("long");

  if (!lat || !long) {
    return Response.json(
      { error: "Latitude and longitude required" },
      { status: 400 },
    );
  }

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode&daily=temperature_2m_max,weathercode&current_weather=true&timezone=auto`,
  );

  const data = await res.json();

  return Response.json(data);
}
