//e o functie care trimite cerere de la /api/visited
//asta va fi apelata cand dau click pe add visited
//o puteam lasa in page.tsx dar ocupa prea mult loc
export default async function addFavourite({
  name,
  imageUrl,
  userId,
}: {
  name: string;
  imageUrl: string;
  userId: string;
}) {
  try {
    await fetch("/api/favourite", {
      //aici puteam sa am const response = cu ala, dar nu vreau sa transmit nimic inapoi
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        imageUrl: imageUrl,
        userId: userId,
      }),
    });

    //voi returna un raspuns true ca sa stiu ce stare sa pun la butonul de add visited
    return true;
  } catch (err) {
    console.log(err);
  }
}
