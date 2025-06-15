import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <h1>Welcome, {session.user?.email}</h1>
      <h1>Welcome, {session.user?.role}</h1>
    </div>
  );
}
