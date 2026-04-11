import { requireRole } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const user = await requireRole(["ADMIN", "MENTOR"]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {user.name}!</p>
      {/* placeholder for stats cards and quick action tables */}
    </div>
  );
}
