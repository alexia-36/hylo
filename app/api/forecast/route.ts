export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    console.log("lat =", lat);
    console.log("lon =", lon);

    // const res = await fetch(
    //   `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode&daily=temperature_2m_max,weathercode&current_weather=true&timezone=auto`,
    // );

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,weather_code&current=temperature_2m&timezone=auto`,
      { signal: AbortSignal.timeout(10000) },
    );

    const text = await res.text();

    return Response.json(JSON.parse(text));
  } catch (err) {
    console.error("FORECAST ERROR:");
    console.error(err);

    return Response.json(
      {
        error: "Forecast failed",
        details: String(err),
      },
      { status: 500 },
    );
  }
}
