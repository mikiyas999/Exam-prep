"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"; // ShadCN Button (optional)
import { toast } from "sonner"; // Optional toast lib

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" }); // redirect to login after sign out
    toast.success("Signed out");
  };

  return (
    <Button onClick={handleSignOut} variant="destructive">
      Sign Out
    </Button>
  );
}
