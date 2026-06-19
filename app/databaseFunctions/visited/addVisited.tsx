//e o functie care trimite cerere de la /api/visited
//asta va fi apelata cand dau click pe add visited
//o puteam lasa in page.tsx dar ocupa prea mult loc
export default async function addVisited({
  name,
  imageUrl,
  userId,
}: {
  name: string;
  imageUrl: string;
  userId: string;
}) {
  try {
    //asta preia latitudinea si longitudinea locului pe care il adaug la visit
    //fac asta pt ca vreau sa plasez un marker pe harta in locul respectiv
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`,
    );
    const data = await res.json();
    const lat = Number(data[0].lat);
    const lon = Number(data[0].lon);

    await fetch("/api/visited", {
      //aici puteam sa am const response = cu ala, dar nu vreau sa transmit nimic inapoi
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        imageUrl: imageUrl,
        userId: userId,
        latitude: lat,
        longitude: lon,
      }),
    });

    //voi returna un raspuns true ca sa stiu ce stare sa pun la butonul de add visited
    return true;
  } catch (err) {
    console.log(err);
  }
}
