"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  Target,
  Trophy,
  BookOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { toast } from "sonner";

interface ProgressStats {
  practice: {
    totalAttempts: number;
    correctAnswers: number;
    percentage: number;
  };
  exams: {
    totalExams: number;
    averageScore: number;
    bestScore: number;
  };
  byCategory: Array<{
    category: string;
    totalAttempts: number;
    correctAnswers: number;
    percentage: number;
  }>;
  byType: Array<{
    questionType: string;
    totalAttempts: number;
    correctAnswers: number;
    percentage: number;
  }>;
  recentExams: Array<{
    id: number;
    examId: number;
    score: number;
    completedAt: string;
  }>;
  dailyProgress: Array<{
    date: string;
    attempts: number;
    accuracy: number;
  }>;
  timeframe: string;
}

export default function ProgressPage() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [timeframe, setTimeframe] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch progress stats
  const fetchProgressStats = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (timeframe !== "all") params.append("timeframe", timeframe);

      const response = await fetch(`/api/progress/stats?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch progress stats");
      }

      setStats(data);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load progress data");
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    const names = {
      amt: "AMT",
      hostess: "Cabin Crew",
      pilot: "Pilot",
    };
    return names[category as keyof typeof names] || category;
  };

  // Get question type display name
  const getTypeDisplayName = (type: string) => {
    const names = {
      math: "Mathematics",
      reading: "Reading Comprehension",
      mechanical: "Mechanical Principles",
      abstract: "Abstract Reasoning",
    };
    return names[type as keyof typeof names] || type;
  };

  // Get performance color
  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Fetch stats on component mount and when timeframe changes
  useEffect(() => {
    fetchProgressStats();
  }, [fetchProgressStats]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Progress"
        text="Track your learning progress and performance analytics."
      >
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
          </SelectContent>
        </Select>
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
            <span className="ml-2">Loading progress data...</span>
          </div>
        ) : !stats ? (
          <div className="text-center p-8 text-muted-foreground">
            No progress data available.
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Practice Accuracy
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getPerformanceColor(
                      stats.practice.percentage
                    )}`}
                  >
                    {stats.practice.percentage}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.practice.correctAnswers} of{" "}
                    {stats.practice.totalAttempts} correct
                  </p>
                  <Progress
                    value={stats.practice.percentage}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Exam Average
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getPerformanceColor(
                      stats.exams.averageScore
                    )}`}
                  >
                    {stats.exams.averageScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.exams.totalExams} exams completed
                  </p>
                  <Progress
                    value={stats.exams.averageScore}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Best Score
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getPerformanceColor(
                      stats.exams.bestScore
                    )}`}
                  >
                    {stats.exams.bestScore}%
                  </div>
                  <p className="text-xs text-muted-foreground">Personal best</p>
                  <Progress
                    value={stats.exams.bestScore}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Practice
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.practice.totalAttempts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Questions attempted
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Daily Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Progress</CardTitle>
                  <CardDescription>
                    Your accuracy over the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.dailyProgress.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.dailyProgress}>
                        <XAxis
                          dataKey="date"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          }
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Accuracy"]}
                          labelFormatter={(value) =>
                            new Date(value).toLocaleDateString()
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="accuracy"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No daily progress data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Category</CardTitle>
                  <CardDescription>
                    Your accuracy across different exam categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.byCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.byCategory}>
                        <XAxis
                          dataKey="category"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) =>
                            getCategoryDisplayName(value)
                          }
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Accuracy"]}
                          labelFormatter={(value) =>
                            getCategoryDisplayName(value)
                          }
                        />
                        <Bar
                          dataKey="percentage"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No category data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>
                    Detailed performance by exam category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.byCategory.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {getCategoryDisplayName(category.category)}
                          </span>
                          <Badge
                            variant="outline"
                            className={getPerformanceColor(category.percentage)}
                          >
                            {category.percentage}%
                          </Badge>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{category.correctAnswers} correct</span>
                          <span>{category.totalAttempts} total</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Question Type Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Question Type Breakdown</CardTitle>
                  <CardDescription>
                    Performance by question type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.byType.map((type) => (
                      <div key={type.questionType} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {getTypeDisplayName(type.questionType)}
                          </span>
                          <Badge
                            variant="outline"
                            className={getPerformanceColor(type.percentage)}
                          >
                            {type.percentage}%
                          </Badge>
                        </div>
                        <Progress value={type.percentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{type.correctAnswers} correct</span>
                          <span>{type.totalAttempts} total</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Exam Results */}
            {stats.recentExams.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Exam Results</CardTitle>
                  <CardDescription>
                    Your latest exam performances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentExams.map((exam, index) => (
                      <div
                        key={exam.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                            <span className="text-sm font-medium">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">Exam #{exam.examId}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(exam.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            exam.score >= 80
                              ? "default"
                              : exam.score >= 60
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-lg px-3 py-1"
                        >
                          {exam.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}
