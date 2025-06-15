"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardNav } from "./dashboard-nav";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile header */}
      <div className="flex h-14 items-center justify-between border-b px-4 md:hidden">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-14 items-center justify-between px-4 border-b">
                <span className="text-lg font-semibold">Menu</span>
              </div>
              <DashboardNav />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop layout */}
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Desktop sidebar */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full overflow-auto">
            <DashboardNav />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex w-full flex-col overflow-hidden py-4 md:py-8 px-4 md:px-0">
          {children}
        </main>
      </div>
    </div>
  );
}
