import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const body = await request.json();
    console.log("body link", body.link);
    const existingLink = await prisma.link.findUnique({
      where: {
        link: body.link,
      },
    });

    console.log(existingLink);
    console.log("it worked");
    return NextResponse.json({ existingLink });
  } catch (e) {
    console.log("error", e);
  }
}
