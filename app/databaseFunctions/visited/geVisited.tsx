export default async function getVisited(userId: string) {
  const res = await fetch(`/api/visited?userId=${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch visited places");
  }

  return await res.json();
}
