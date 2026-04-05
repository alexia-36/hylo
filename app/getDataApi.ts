export async function getWeather(city: string) {
  const res = await fetch(`/api/weather?city=${city}`);
  const data = await res.json();
  return data;
}
