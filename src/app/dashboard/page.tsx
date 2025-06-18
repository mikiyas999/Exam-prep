import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  // In a real implementation, you would check auth state server-side
  // For now, we'll assume the user is authenticated
  // If not authenticated, redirect to login
  // const session = await getSession();
  // if (!session) redirect("/auth/login");

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome to your dashboard." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tests
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">
              +5% since last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Practice Hours
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2</div>
            <p className="text-xs text-muted-foreground">
              +2.1 since last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Leaderboard Rank
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#7</div>
            <p className="text-xs text-muted-foreground">
              +3 spots since last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent test attempts and practice sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Practice Tests</CardTitle>
            <CardDescription>
              Take practice tests to improve your skills.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Math</span>
                <span className="text-sm text-muted-foreground">
                  24 questions
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reading</span>
                <span className="text-sm text-muted-foreground">
                  32 questions
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mechanical</span>
                <span className="text-sm text-muted-foreground">
                  18 questions
                </span>
              </div>
            </div>
          </CardContent>
          <div className="p-4 pt-0">
            <Button asChild className="w-full">
              <Link href="/practice">Start Practice</Link>
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Full Mock Exams</CardTitle>
            <CardDescription>
              Test yourself with complete timed exams.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AMT Entrance</span>
                <span className="text-sm text-muted-foreground">2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cabin Crew</span>
                <span className="text-sm text-muted-foreground">
                  90 minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pilot Assessment</span>
                <span className="text-sm text-muted-foreground">3 hours</span>
              </div>
            </div>
          </CardContent>
          <div className="p-4 pt-0">
            <Button asChild variant="outline" className="w-full">
              <Link href="/exams">View Exams</Link>
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Study Resources</CardTitle>
            <CardDescription>
              Access study materials to help you prepare.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Study Guides</span>
                <span className="text-sm text-muted-foreground">12 guides</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Video Tutorials</span>
                <span className="text-sm text-muted-foreground">8 videos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Flashcards</span>
                <span className="text-sm text-muted-foreground">120 cards</span>
              </div>
            </div>
          </CardContent>
          <div className="p-4 pt-0">
            <Button asChild variant="outline" className="w-full">
              <Link href="/resources">Browse Resources</Link>
            </Button>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
