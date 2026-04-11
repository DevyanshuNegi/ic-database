import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const user = await getCurrentUser();
  if (!user) {
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === "true") {
      redirect("/api/dev/login-default");
    }
    return <div>Not authenticated</div>;
  }

  if (user.role === "INTERN") {
    redirect("/intern/dashboard");
  }

  if (user.role === "ADMIN" || user.role === "MENTOR") {
    redirect("/admin/dashboard");
  }

  return <div>Unknown role</div>;
}
