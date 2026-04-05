export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city");

  if (!city) {
    return Response.json({ error: "City required" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=metric`,
  );

  const data = await res.json();

  return Response.json(data);
}
