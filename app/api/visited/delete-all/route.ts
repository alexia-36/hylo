import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();
    await prisma.visited.deleteMany({
      where: {
        userId,
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { err: "Failed to delete all visited places" },
      { status: 500 },
    );
  }
}
