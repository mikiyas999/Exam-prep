"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  Loader2,
  AlertCircle,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string;
  totalAttempts?: number;
  correctAnswers?: number;
  averageScore: number;
  accuracy?: number;
  totalExams?: number;
  bestScore?: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  currentUserRank: number | null;
  category: string;
  type: string;
  totalUsers: number;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("practice");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      params.append("type", type);
      params.append("limit", "50");

      const response = await fetch(
        `/api/leaderboard/global?${params.toString()}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch leaderboard");
      }

      setData(result);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  // Get rank icon
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  // Get rank color
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600";
      default:
        return "bg-muted";
    }
  };

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    const names = {
      amt: "AMT",
      hostess: "Cabin Crew",
      pilot: "Pilot",
    };
    return names[category as keyof typeof names] || "All Categories";
  };

  // Get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchLeaderboard();
  }, [category, type]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Leaderboard"
        text="See how you rank against other learners."
      />

      <div className="mt-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard Filters</CardTitle>
            <CardDescription>
              Filter the leaderboard by category and ranking type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amt">AMT</SelectItem>
                    <SelectItem value="hostess">Cabin Crew</SelectItem>
                    <SelectItem value="pilot">Pilot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ranking Type</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practice">
                      Practice Performance
                    </SelectItem>
                    <SelectItem value="exam">Exam Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
            <span className="ml-2">Loading leaderboard...</span>
          </div>
        ) : !data || data.leaderboard.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No leaderboard data available for the selected filters.
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Participants
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryDisplayName(data.category)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Your Rank
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.currentUserRank ? `#${data.currentUserRank}` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {type === "practice" ? "Practice ranking" : "Exam ranking"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Top Score
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.leaderboard[0]?.averageScore || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leading performance
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top 3 Podium */}
            {data.leaderboard.length >= 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>
                    The top 3 performers in{" "}
                    {getCategoryDisplayName(data.category)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {data.leaderboard.slice(0, 3).map((entry, index) => (
                      <div
                        key={entry.userId}
                        className={`relative p-6 rounded-lg text-center ${
                          index === 0
                            ? "order-2 md:order-1"
                            : index === 1
                            ? "order-1 md:order-2"
                            : "order-3"
                        }`}
                        style={{
                          background: getRankColor(entry.rank),
                          color: entry.rank <= 3 ? "white" : "inherit",
                        }}
                      >
                        <div className="mb-4">{getRankIcon(entry.rank)}</div>
                        <Avatar className="mx-auto mb-4 h-16 w-16">
                          <AvatarFallback className="text-lg font-bold">
                            {getUserInitials(entry.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg mb-2">
                          {entry.userName}
                        </h3>
                        <div className="text-2xl font-bold mb-1">
                          {Math.round(entry.averageScore)}%
                        </div>
                        <p className="text-sm opacity-90">
                          {type === "practice"
                            ? `${entry.totalAttempts} attempts`
                            : `${entry.totalExams} exams`}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Full Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Full Rankings</CardTitle>
                <CardDescription>
                  Complete leaderboard for{" "}
                  {getCategoryDisplayName(data.category)} -{" "}
                  {type === "practice" ? "Practice" : "Exam"} performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.leaderboard.map((entry) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                        data.currentUserRank === entry.rank
                          ? "bg-primary/5 border-primary"
                          : ""
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10">
                          {getRankIcon(entry.rank)}
                        </div>
                        <Avatar>
                          <AvatarFallback>
                            {getUserInitials(entry.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{entry.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {type === "practice"
                              ? `${entry.totalAttempts} attempts • ${entry.accuracy}% accuracy`
                              : `${entry.totalExams} exams • Best: ${entry.bestScore}%`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {Math.round(entry.averageScore)}%
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {type === "practice" ? "Avg Score" : "Avg Exam"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
