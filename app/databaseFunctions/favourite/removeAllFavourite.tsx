export default async function removeAllFavourite(userId: string) {
  await fetch("/api/favourite/delete-all", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  });
}
