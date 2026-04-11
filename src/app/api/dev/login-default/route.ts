import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ESIM_USER_COOKIE } from "@/lib/auth";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }
  const firstIntern = await prisma.user.findFirst({
    where: { role: "INTERN" },
    orderBy: { email: "asc" },
  });
  
  if (firstIntern) {
    const jar = await cookies();
    jar.set(
      ESIM_USER_COOKIE,
      JSON.stringify({ userId: firstIntern.id, role: firstIntern.role }),
      {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: "lax",
      }
    );
  }
  
  redirect("/intern/dashboard");
}
