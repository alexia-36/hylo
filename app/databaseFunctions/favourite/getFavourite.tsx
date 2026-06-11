export default async function getFavourite(userId: string) {
  const res = await fetch(`/api/favourite?userId=${userId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch favourite places");
  }

  return await res.json();
}
