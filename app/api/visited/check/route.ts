//functie pentru a verifica daca am un loc la visited pt a sti ce denumire dau butonului addVisited

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"; //asta e pt a trimie raspunsuri in format json catre client si a seta status code-ul raspunsului

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("name") || "";
    const userId = searchParams.get("userId") || "";

    const visited = await prisma.visited.findFirst({
      where: {
        name: city,
        userId: userId,
      },
    });

    return NextResponse.json({
      exists: !!visited, //semnele !! transforma valoarea intr-un boolean, daca visited e null sau undefined va returna false, altfel va returna true
    });
  } catch (err) {
    return NextResponse.json(
      { err: "Failed to check visited place" },
      { status: 500 },
    );
  }
}
