// /app/api/hello/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const body = await request.json();
    const newLink = await prisma.link.create({
      data: {
        link: body.link,
      },
    });

    console.log(newLink);
    console.log("it worked");
    return NextResponse.json({ message: "Link added successfully", newLink });
  } catch (e) {
    return NextResponse.json({ e }, { status: 500 });
  }
}
