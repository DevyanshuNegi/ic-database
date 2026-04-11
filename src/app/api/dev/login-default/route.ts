import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ESIM_USER_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH?.trim() !== "true") {
    return new NextResponse("Not found", { status: 404 });
  }
  
  const firstIntern = await prisma.user.findFirst({
    where: { role: "INTERN" },
    orderBy: { email: "asc" },
  });

  const url = request.nextUrl.clone();
  url.pathname = "/intern/dashboard";
  const response = NextResponse.redirect(url);

  if (firstIntern) {
    response.cookies.set({
      name: ESIM_USER_COOKIE,
      value: JSON.stringify({ userId: firstIntern.id, role: firstIntern.role }),
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return response;
}
