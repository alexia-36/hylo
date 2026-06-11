//e o functie care trimite cerere de la /api/favourite/ check
//asta va fi apelata cand se incarca pagina ca sa stiu cum sa denumesc butonul de addFavourite
//o puteam lasa in page.tsx dar ocupa prea mult loc

export default async function checkFavourite(name: string, userId: string) {
  try {
    const res = await fetch(
      `/api/favourite/check?name=${encodeURIComponent(name)}&userId=${userId}`,
    );
    const data = await res.json();
    return data.exists;
  } catch (err) {
    console.log(err);
    return null;
  }
}
