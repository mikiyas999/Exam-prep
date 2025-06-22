// app/unauthorized/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UnauthorizedPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 animate-pulse">
          <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-300" />
        </div>
        <h1 className="text-3xl font-bold text-destructive">
          403 - Unauthorized
        </h1>
        <p className="text-muted-foreground">
          {session?.user?.role
            ? `You are logged in as "${session.user.role}", but this page requires higher privileges.`
            : "You don’t have permission to view this page."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link href="/">
            <Button variant="outline">🏠 Home</Button>
          </Link>
          <Link href="/auth/login">
            <Button>🔐 Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
