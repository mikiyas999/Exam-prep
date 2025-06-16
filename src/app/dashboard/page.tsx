import { SignOutButton } from "@/components/sign-out";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth"; // ✅ Correct default import
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  console.log(session);
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      <h1>Welcome, {session?.user?.email}</h1>
      <h1>Welcome, {session.user?.role}</h1>
      <SignOutButton />
    </div>
  );
}
