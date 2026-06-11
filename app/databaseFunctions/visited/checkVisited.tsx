//e o functie care trimite cerere de la /api/visited/ check
//asta va fi apelata cand se incarca pagina ca sa stiu cum sa denumesc butonul de addVisited
//o puteam lasa in page.tsx dar ocupa prea mult loc

export default async function checkVisited(name: string, userId: string) {
  try {
    const res = await fetch(
      `/api/visited/check?name=${encodeURIComponent(name)}&userId=${userId}`,
    );
    const data = await res.json();
    return data.exists;
  } catch (err) {
    console.log(err);
    return null;
  }
}
