"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  FileText,
  BookOpen,
  UserPlus,
  PlusCircle,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

interface DashboardStats {
  overview: {
    totalUsers: number;
    totalQuestions: number;
    totalExams: number;
    totalAttempts: number;
    userGrowth: number;
    questionGrowth: number;
    examGrowth: number;
    attemptGrowth: number;
  };
  recentActivity: {
    users: Array<{
      id: number;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
    questions: Array<{
      id: number;
      questionText: string;
      category: string;
      questionType: string;
      difficulty: string;
      createdAt: string;
    }>;
  };
  analytics: {
    categoryStats: Array<{
      category: string;
      count: number;
    }>;
    difficultyStats: Array<{
      difficulty: string;
      count: number;
    }>;
    monthlyProgress: Array<{
      month: string;
      attempts: number;
      accuracy: number;
    }>;
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard stats");
      }

      setStats(data);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    const names = {
      amt: "AMT",
      hostess: "Cabin Crew",
      pilot: "Pilot",
    };
    return names[category as keyof typeof names] || category;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-500",
      medium: "bg-yellow-500",
      hard: "bg-red-500",
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-500";
  };

  // Fetch stats on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Admin Dashboard"
        text="Manage your platform and monitor key metrics."
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild>
            <Link href="/admin/questions/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Question
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/users">
              <UserPlus className="mr-2 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="mt-6 space-y-6">
        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading dashboard...</span>
          </div>
        ) : !stats ? (
          <div className="text-center p-8 text-muted-foreground">
            No dashboard data available.
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalUsers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">
                      +{stats.overview.userGrowth}%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Questions
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalQuestions}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">
                      +{stats.overview.questionGrowth}%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Exams
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalExams}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">
                      +{stats.overview.examGrowth}%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Attempts
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalAttempts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">
                      +{stats.overview.attemptGrowth}%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Monthly Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity</CardTitle>
                  <CardDescription>
                    User attempts and accuracy over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.analytics.monthlyProgress.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.analytics.monthlyProgress}>
                        <XAxis
                          dataKey="month"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="attempts"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="accuracy"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No monthly data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions by Category</CardTitle>
                  <CardDescription>
                    Distribution of questions across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.analytics.categoryStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.analytics.categoryStats.map((item) => ({
                            name: getCategoryDisplayName(item.category),
                            value: item.count,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stats.analytics.categoryStats.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No category data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Question Management
                  </CardTitle>
                  <CardDescription>
                    Create and manage exam questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Questions</span>
                      <span className="font-medium">
                        {stats.overview.totalQuestions}
                      </span>
                    </div>
                    {stats.analytics.difficultyStats.map((item) => (
                      <div
                        key={item.difficulty}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getDifficultyColor(
                              item.difficulty
                            )}`}
                          ></div>
                          <span className="capitalize">{item.difficulty}</span>
                        </div>
                        <span>{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button asChild className="w-full" size="sm">
                    <Link href="/admin/questions">
                      <FileText className="mr-2 h-4 w-4" />
                      Manage Questions
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Exam Management</CardTitle>
                  <CardDescription>Create and organize exams</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Exams</span>
                      <span className="font-medium">
                        {stats.overview.totalExams}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Attempts</span>
                      <span className="font-medium">
                        {stats.overview.totalAttempts}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Growth Rate</span>
                      <span className="font-medium text-green-600">
                        +{stats.overview.examGrowth}%
                      </span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button
                    asChild
                    className="w-full"
                    size="sm"
                    variant="outline"
                  >
                    <Link href="/admin/exams">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Manage Exams
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">User Management</CardTitle>
                  <CardDescription>Manage platform users</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Users</span>
                      <span className="font-medium">
                        {stats.overview.totalUsers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>New This Month</span>
                      <span className="font-medium text-green-600">
                        +{stats.overview.userGrowth}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Active Users</span>
                      <span className="font-medium">
                        {Math.round(stats.overview.totalUsers * 0.7)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button
                    asChild
                    className="w-full"
                    size="sm"
                    variant="outline"
                  >
                    <Link href="/admin/users">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivity.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Questions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Questions</CardTitle>
                  <CardDescription>
                    Latest questions added to the bank
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivity.questions.map((question) => (
                      <div key={question.id} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium line-clamp-2">
                            {question.questionText}
                          </p>
                          <Badge
                            className={`ml-2 shrink-0 ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {getCategoryDisplayName(question.category)}
                            </Badge>
                            <span className="capitalize">
                              {question.questionType}
                            </span>
                          </div>
                          <span>
                            {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
