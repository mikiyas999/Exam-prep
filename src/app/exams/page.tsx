"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import {
  Search,
  Clock,
  FileText,
  Users,
  Trophy,
  Loader2,
  AlertCircle,
  Play,
} from "lucide-react";
import { toast } from "sonner";

interface Exam {
  id: number;
  title: string;
  description?: string;
  category: string;
  questionTypes?: string[];
  difficulty?: string;
  timeLimit?: number;
  questionCount: number;
  createdAt: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [category, setCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch exams
  const fetchExams = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);

      const response = await fetch(`/api/exams?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch exams");
      }

      setExams(data.exams);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load exams");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter exams based on search query
  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch exams on component mount and when category changes
  useEffect(() => {
    fetchExams();
  }, [category]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Exams"
        text="Take comprehensive exams to test your knowledge."
      />

      <div className="mt-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Find Exams</CardTitle>
            <CardDescription>
              Filter exams by category or search for specific topics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exams..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
            <span className="ml-2">Loading exams...</span>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            {searchQuery || category
              ? "No exams found matching your criteria."
              : "No exams available."}
          </div>
        ) : (
          /* Exams Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => (
              <Card
                key={exam.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className={`h-2 ${
                    exam.difficulty === "easy"
                      ? "bg-green-500"
                      : exam.difficulty === "medium"
                      ? "bg-yellow-500"
                      : exam.difficulty === "hard"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                ></div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      <Badge variant="outline" className="capitalize">
                        {exam.category}
                      </Badge>
                    </div>
                    {exam.difficulty && (
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
                    )}
                  </div>
                  {exam.description && (
                    <CardDescription className="mt-2">
                      {exam.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <FileText className="mr-1 h-4 w-4" />
                        <span>{exam.questionCount} questions</span>
                      </div>
                      {exam.timeLimit && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{exam.timeLimit} minutes</span>
                        </div>
                      )}
                    </div>

                    {exam.questionTypes && exam.questionTypes.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Question Types
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {exam.questionTypes.map((type) => (
                            <Badge
                              key={type}
                              variant="secondary"
                              className="capitalize text-xs"
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(exam.createdAt).toLocaleDateString()}
                  </div>
                  <Button asChild>
                    <Link href={`/exams/${exam.id}`}>
                      <Play className="mr-2 h-4 w-4" />
                      Start Exam
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Exams
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(exams.map((e) => e.category)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                AMT, Cabin Crew, Pilot
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Questions
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {exams.reduce((sum, exam) => sum + exam.questionCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for practice
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
