//e o functie care trimite fetch de la /api/visited delete
//asta va fi apelata cand dau click pe remove visited
//o puteam lasa in page.tsx dar ocupa prea mult loc

export default async function deleteAllVisited({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) {
  try {
    await fetch("/api/visited", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, userId: userId }),
    });
    //puteam sa fac response.json() si sa preiau raspunsul de la server, dar in cazul meu nu am nevoie de el, asa ca il ignor
  } catch (err) {
    console.log(err);
  }
}
