import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"; //asta e pt a trimie raspunsuri in format json catre client si a seta status code-ul raspunsului

//functia asta adauga locurile in visited
export async function POST(req: Request) {
  try {
    const body = await req.json(); //aici preiau datele trimise de client in corpul cererii (request-ului) si le parsez ca JSON, asta cere metoda POST

    await prisma.favourite.create({
      //asta insereaza un nou rand un tabela favourite
      data: {
        //asta specifica datele ce vor fi inserate in tabel
        name: body.name, //name si imageUrl sunt preluate din corpul requestului care e primit prin parametrul req si stocat in body dupa ce e parsat ca json
        imageUrl: body.imageUrl,
        userId: body.userId,
      },
    });

    // return NextResponse.json(visited);  //aici puteam trimite inapoi obiectul creat in baza de date, dar in cazul meu nu imi folosea
    return new NextResponse(null, { status: 201 }); //aici returnez un raspuns gol cu status 201 care inseamna ca resursa a fost creata cu succes
  } catch (err) {
    return NextResponse.json(
      { err: "Failed to create visited place" },
      { status: 500 },
    );
  }
}

//functia asta preia toate locurile din visited
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const favourite = await prisma.favourite.findMany({
      where: {
        userId,
      },
    });
    return NextResponse.json(favourite);
  } catch (err) {
    return NextResponse.json(
      { err: "Failed to fetch favourite places" },
      { status: 500 },
    );
  }
}

//functia asta sterge un loc din favourite dupa nume
export async function DELETE(req: Request) {
  try {
    const { userId, name } = await req.json();

    await prisma.favourite.deleteMany({
      where: {
        userId,
        name,
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch {
    return NextResponse.json(
      { err: "Failed to delete favourite places" },
      { status: 500 },
    );
  }
}

//PATCH - actualizeaza doar o parte din tabel, spre deosebire de post care actualizeaza tot tabelul
export async function PATCH(req: Request) {
  try {
    const { id, note } = await req.json();

    const favourite = await prisma.favourite.update({
      where: {
        id,
      },
      data: {
        note,
      },
    });

    return NextResponse.json(favourite);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}
