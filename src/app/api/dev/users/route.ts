import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH?.trim() !== "true") {
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
