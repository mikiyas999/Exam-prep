"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Trophy,
  Target,
  Clock,
  Award,
  Users,
  FileText,
  Play,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Zap,
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
  TooltipProps,
} from "recharts";
import { toast } from "sonner";

interface DashboardStats {
  overview: {
    totalPracticeAttempts: number;
    totalExamsCompleted: number;
    averageScore: number;
    bestScore: number;
    currentStreak: number;
    totalStudyTime: number;
    rank: number;
    totalUsers: number;
  };
  recentActivity: Array<{
    id: number;
    type: "practice" | "exam" | "achievement";
    title: string;
    description: string;
    score?: number;
    timestamp: string;
    category?: string;
  }>;
  performance: {
    weeklyProgress: Array<{
      day: string;
      score: number;
      attempts: number;
    }>;
    categoryBreakdown: Array<{
      category: string;
      score: number;
      attempts: number;
      color: string;
    }>;
  };
  upcomingExams: Array<{
    id: number;
    title: string;
    category: string;
    difficulty: string;
    questionCount: number;
    timeLimit: number;
  }>;
  achievements: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
    rarity: "common" | "rare" | "epic" | "legendary";
  }>;
  recommendations: Array<{
    type: "practice" | "exam" | "study";
    title: string;
    description: string;
    action: string;
    href: string;
  }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe] = useState("week");

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/dashboard/stats?timeframe=${timeframe}`
      );
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
  }, [timeframe]);

  // Get achievement rarity color
  const getAchievementColor = (rarity: string) => {
    const colors = {
      common: "bg-gray-500",
      rare: "bg-blue-500",
      epic: "bg-purple-500",
      legendary: "bg-yellow-500",
    };
    return colors[rarity as keyof typeof colors] || "bg-gray-500";
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

  // Format study time
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Custom tooltip for charts with dark mode support
  interface CustomTooltipProps extends TooltipProps<any, any> {
    showPercentage?: boolean;
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
    showPercentage = true,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="text-foreground font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${
                showPercentage &&
                (entry.name === "Score" || entry.name === "Accuracy")
                  ? "%"
                  : ""
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Fetch stats on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome back! Here's your learning progress overview."
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild>
            <Link href="/practice">
              <Play className="mr-2 h-4 w-4" />
              Start Practice
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/exams">
              <FileText className="mr-2 h-4 w-4" />
              Take Exam
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
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">
                      Keep up the great work!
                    </h2>
                    <p className="text-blue-100">
                      You are ranked #{stats.overview.rank} out of{" "}
                      {stats.overview.totalUsers} learners
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Zap className="mr-1 h-4 w-4" />
                        <span>{stats.overview.currentStreak} day streak</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>
                          {formatStudyTime(stats.overview.totalStudyTime)}{" "}
                          studied
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Trophy className="h-16 w-16 text-yellow-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.overview.averageScore}%
                  </div>
                  <Progress
                    value={stats.overview.averageScore}
                    className="mt-2 h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Best: {stats.overview.bestScore}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Practice Sessions
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalPracticeAttempts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total practice attempts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Exams Completed
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalExamsCompleted}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Full exams taken
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Global Rank
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    #{stats.overview.rank}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Out of {stats.overview.totalUsers} users
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analytics */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Weekly Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>
                    Your performance over the last 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.performance.weeklyProgress.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.performance.weeklyProgress}>
                        <XAxis
                          dataKey="day"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                          name="Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No progress data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                  <CardDescription>
                    Your scores across different categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.performance.categoryBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.performance.categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, score }) =>
                            `${getCategoryDisplayName(category)}: ${score}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="score"
                        >
                          {stats.performance.categoryBreakdown.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
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

            {/* Recent Activity and Achievements - Scrollable Sections */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Activity - Scrollable */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest practice sessions and exams
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] w-full">
                    <div className="space-y-4 p-6">
                      {stats.recentActivity.length > 0 ? (
                        stats.recentActivity.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div
                              className={`p-2 rounded-full ${
                                activity.type === "practice"
                                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                  : activity.type === "exam"
                                  ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                              }`}
                            >
                              {activity.type === "practice" ? (
                                <BookOpen className="h-4 w-4" />
                              ) : activity.type === "exam" ? (
                                <FileText className="h-4 w-4" />
                              ) : (
                                <Award className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                {activity.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.description}
                              </p>
                            </div>
                            <div className="text-right">
                              {activity.score && (
                                <Badge variant="outline">
                                  {activity.score}%
                                </Badge>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(
                                  activity.timestamp
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No recent activity</p>
                          <p className="text-sm">
                            Start practicing to see your activity here
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Recent Achievements - Scrollable */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>
                    Your latest unlocked achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] w-full">
                    <div className="space-y-4 p-6">
                      {stats.achievements.length > 0 ? (
                        stats.achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div
                              className={`p-2 rounded-full ${getAchievementColor(
                                achievement.rarity
                              )} text-white`}
                            >
                              <Award className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                {achievement.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {achievement.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="capitalize">
                                {achievement.rarity}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(
                                  achievement.unlockedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No achievements yet</p>
                          <p className="text-sm">
                            Complete practice sessions to unlock achievements
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations and Upcoming Exams - Scrollable Sections */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Personalized Recommendations - Scrollable */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>
                    Personalized suggestions to improve your performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[350px] w-full">
                    <div className="space-y-4 p-6">
                      {stats.recommendations.length > 0 ? (
                        stats.recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1 flex-1">
                                <h4 className="font-medium">{rec.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {rec.description}
                                </p>
                              </div>
                              <Button asChild size="sm" className="ml-4">
                                <Link href={rec.href}>{rec.action}</Link>
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No recommendations available</p>
                          <p className="text-sm">
                            Complete more activities to get personalized
                            suggestions
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Available Exams - Scrollable */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Exams</CardTitle>
                  <CardDescription>
                    Exams you can take to test your knowledge
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[350px] w-full">
                    <div className="space-y-4 p-6">
                      {stats.upcomingExams.length > 0 ? (
                        stats.upcomingExams.map((exam) => (
                          <div
                            key={exam.id}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <h4 className="font-medium">{exam.title}</h4>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <FileText className="mr-1 h-3 w-3" />
                                    <span>{exam.questionCount} questions</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    <span>{exam.timeLimit} min</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {getCategoryDisplayName(exam.category)}
                                  </Badge>
                                  <Badge
                                    className={
                                      exam.difficulty === "easy"
                                        ? "bg-green-500"
                                        : exam.difficulty === "medium"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }
                                  >
                                    {exam.difficulty}
                                  </Badge>
                                </div>
                              </div>
                              <Button asChild size="sm" className="ml-4">
                                <Link href={`/exams/${exam.id}`}>
                                  <Play className="mr-1 h-3 w-3" />
                                  Start
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No exams available</p>
                          <p className="text-sm">
                            Check back later for new exams
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Continue Learning</CardTitle>
                  <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Mathematics</span>
                      <span className="text-muted-foreground">
                        75% complete
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button asChild className="w-full" size="sm">
                    <Link href="/practice/amt-math">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Continue Practice
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">View Progress</CardTitle>
                  <CardDescription>
                    Detailed analytics and insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>This Week</span>
                      <span className="text-green-600">+12%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Accuracy</span>
                      <span className="font-medium">
                        {stats.overview.averageScore}%
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
                    <Link href="/progress">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Leaderboard</CardTitle>
                  <CardDescription>See how you rank globally</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Your Rank</span>
                      <span className="font-medium">
                        #{stats.overview.rank}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Top 10%</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
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
                    <Link href="/leaderboard">
                      <Trophy className="mr-2 h-4 w-4" />
                      View Leaderboard
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
