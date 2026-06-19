export default async function updateVisitedRating({
  id,
  rating,
}: {
  id: string;
  rating: number;
}) {
  await fetch("/api/visited", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      rating,
    }),
  });
}
