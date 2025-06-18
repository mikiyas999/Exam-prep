"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Home,
  Trophy,
  Clock,
  Target,
} from "lucide-react";

interface PracticeResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface PracticeResults {
  subject: {
    id: string;
    name: string;
    description: string;
  };
  results: PracticeResult[];
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  completedAt: string;
}

export default function PracticeResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<PracticeResults | null>(null);

  useEffect(() => {
    // Get results from localStorage
    const storedResults = localStorage.getItem("practiceResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // No results found, redirect to practice page
      router.push("/practice");
    }
  }, [router]);

  if (!results) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  const { subject, score } = results;
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return "default";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/practice")}
          className="flex items-center mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Practice
        </Button>

        <div className="text-center mb-8">
          <div className="mb-4">
            <Trophy
              className={`h-16 w-16 mx-auto ${getScoreColor(score.percentage)}`}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Practice Complete!
          </h1>
          <p className="text-muted-foreground text-lg">{subject.name}</p>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getScoreColor(
                score.percentage
              )}`}
            >
              {score.percentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              {score.correct} out of {score.total} correct
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Correct Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {score.correct}
            </div>
            <Progress
              value={(score.correct / score.total) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              Incorrect Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {score.total - score.correct}
            </div>
            <Progress
              value={((score.total - score.correct) / score.total) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Performance Badge */}
      <div className="text-center mb-8">
        <Badge
          variant={getScoreBadgeVariant(score.percentage)}
          className="text-lg px-4 py-2"
        >
          {score.percentage >= 90
            ? "Excellent!"
            : score.percentage >= 80
            ? "Great Job!"
            : score.percentage >= 70
            ? "Good Work!"
            : score.percentage >= 60
            ? "Keep Practicing!"
            : "Need More Practice"}
        </Badge>
      </div>

      {/* Detailed Results */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
          <CardDescription>
            Review your answers and see the correct solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.isCorrect
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                    : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium">Question {index + 1}</span>
                  {result.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {!result.isCorrect && (
                    <>
                      <div>
                        <span className="font-medium text-red-600">
                          Your answer:{" "}
                        </span>
                        <span>{result.userAnswer || "Not answered"}</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-600">
                          Correct answer:{" "}
                        </span>
                        <span>{result.correctAnswer}</span>
                      </div>
                    </>
                  )}
                  {result.isCorrect && (
                    <div>
                      <span className="font-medium text-green-600">
                        Correct answer:{" "}
                      </span>
                      <span>{result.correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => router.push(`/practice/${subject.id}`)}
          className="flex items-center"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Practice Again
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push("/practice")}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Choose Different Subject
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="flex items-center"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Completion Time */}
      <div className="text-center mt-8 text-sm text-muted-foreground">
        <Clock className="inline mr-1 h-4 w-4" />
        Completed on {new Date(results.completedAt).toLocaleString()}
      </div>
    </div>
  );
}
