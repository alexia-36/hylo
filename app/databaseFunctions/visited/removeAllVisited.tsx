export default async function removeAllVisited(userId: string) {
  await fetch("/api/visited/delete-all", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  });
}
