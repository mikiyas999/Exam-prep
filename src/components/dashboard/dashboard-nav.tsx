"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Book,
  FileText,
  GraduationCap,
  Home,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const adminRoutes = [
  {
    href: "/admin",
    icon: ShieldCheck,
    title: "Admin Dashboard",
  },
  {
    href: "/admin/questions",
    icon: FileText,
    title: "Manage Questions",
  },
  {
    href: "/admin/exams",
    icon: Book,
    title: "Manage Exams",
  },
  {
    href: "/admin/users",
    icon: Users,
    title: "Manage Users",
  },
];

const userRoutes = [
  {
    href: "/dashboard",
    icon: Home,
    title: "Dashboard",
  },
  {
    href: "/practice",
    icon: Book,
    title: "Practice",
  },
  {
    href: "/exams",
    icon: FileText,
    title: "Exams",
  },
  {
    href: "/progress",
    icon: BarChart,
    title: "Progress",
  },
  {
    href: "/leaderboard",
    icon: GraduationCap,
    title: "Leaderboard",
  },
  {
    href: "/settings",
    icon: Settings,
    title: "Settings",
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  // For demonstration, we'll use a hardcoded role
  // In a real implementation, this would come from the authenticated user
  const isAdmin = pathname?.includes("/admin");
  const routes = isAdmin ? adminRoutes : userRoutes;

  return (
    <nav className="grid items-start gap-2 px-2 py-4">
      {routes.map((route) => (
        <Button
          key={route.href}
          asChild
          variant={pathname === route.href ? "default" : "ghost"}
          className={cn(
            "justify-start",
            pathname === route.href && "bg-accent text-accent-foreground"
          )}
        >
          <Link href={route.href}>
            <route.icon className="mr-2 h-4 w-4" />
            {route.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
