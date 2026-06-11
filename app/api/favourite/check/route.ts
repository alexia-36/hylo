//functie pentru a verifica daca am un loc la favourite pt a sti ce denumire dau butonului addFavourite

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"; //asta e pt a trimie raspunsuri in format json catre client si a seta status code-ul raspunsului

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("name") || "";
    const userId = searchParams.get("userId") || "";

    const favourite = await prisma.favourite.findFirst({
      where: {
        name: city,
        userId: userId,
      },
    });

    return NextResponse.json({
      exists: !!favourite, //semnele !! transforma valoarea intr-un boolean, daca favourite e null sau undefined va returna false, altfel va returna true
    });
  } catch (err) {
    return NextResponse.json(
      { err: "Failed to check favourite place" },
      { status: 500 },
    );
  }
}
