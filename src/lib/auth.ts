import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import type { Role, User } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const ESIM_USER_COOKIE = "esim_user";

export type EsimUserCookie = {
  userId: string;
  role: Role;
};

export function parseEsimUserCookie(raw: string | undefined): EsimUserCookie | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as EsimUserCookie;
    if (typeof parsed.userId === "string" && typeof parsed.role === "string") {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const jar = await cookies();
  const payload = parseEsimUserCookie(jar.get(ESIM_USER_COOKIE)?.value);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.role !== payload.role) return null;
  return user;
});

export async function requireRole(allowed: Role | Role[]): Promise<User> {
  const user = await getCurrentUser();
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  if (!user || !roles.includes(user.role)) {
    redirect("/");
  }
  return user;
}
