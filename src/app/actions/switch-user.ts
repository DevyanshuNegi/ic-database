"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ESIM_USER_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function switchUserAction(userId: string) {
  if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH !== "true") {
    return;
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const jar = await cookies();
  jar.set(
    ESIM_USER_COOKIE,
    JSON.stringify({ userId: user.id, role: user.role }),
    {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
    },
  );
  if (user.role === "INTERN") {
    redirect("/intern/dashboard");
  }
  redirect("/admin/dashboard");
}
