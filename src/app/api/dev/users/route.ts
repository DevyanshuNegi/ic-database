import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const users = await prisma.user.findMany({
    orderBy: { role: "asc" }
  });
  const activeUser = await getCurrentUser();
  return NextResponse.json({
    users,
    activeUserId: activeUser?.id,
  });
}
