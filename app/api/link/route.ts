// /app/api/hello/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST(request: NextRequest, response: NextResponse) {
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

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const prisma = new PrismaClient();
    const links = await prisma.link.findMany();
    return NextResponse.json({ links });
  } catch (e) {
    console.log(e);
  }
}
