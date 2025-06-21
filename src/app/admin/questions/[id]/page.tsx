"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
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
  ArrowLeft,
  Edit,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  imageUrl?: string;
  questionType: string;
  category: string;
  difficulty: string;
  createdAt: string;
}

export default function ViewQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: questionId } = use(params);

  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch question data
  const fetchQuestion = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/questions/${questionId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch question");
      }

      setQuestion(data.question);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load question");
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

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-500",
      medium: "bg-yellow-500",
      hard: "bg-red-500",
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-500";
  };

  // Fetch question on component mount
  useEffect(() => {
    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  // Loading state
  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading question...</span>
        </div>
      </DashboardShell>
    );
  }

  // Error state
  if (error || !question) {
    return (
      <DashboardShell>
        <Alert variant="destructive" className="max-w-md mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Question not found"}</AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <Button onClick={() => router.push("/admin/questions")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="View Question"
        text="Review question details and options."
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/questions")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Button>
          <Button asChild>
            <Link href={`/admin/questions/${question.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Question
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <div className="mt-6 space-y-6">
        {/* Question Details */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle className="text-xl">
                  Question #{question.id}
                </CardTitle>
                <CardDescription>
                  Created on {new Date(question.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="capitalize">
                  {getCategoryDisplayName(question.category)}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {getTypeDisplayName(question.questionType)}
                </Badge>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Text */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Question</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-base leading-relaxed">
                  {question.questionText}
                </p>
              </div>
            </div>

            {/* Question Image */}
            {question.imageUrl && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Image</h3>
                <div className="border rounded-lg overflow-hidden max-w-md">
                  <img
                    src={question.imageUrl}
                    alt="Question diagram"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Answer Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Answer Options</h3>
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const optionKey = String.fromCharCode(65 + index); // A, B, C...
                  const isCorrect = optionKey === question.correctAnswer;

                  return (
                    <div
                      key={optionKey}
                      className={`flex items-center p-4 rounded-lg border ${
                        isCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                          : "border-gray-200 bg-gray-50 dark:bg-gray-950/20"
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full font-medium ${
                            isCorrect
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {optionKey}
                        </div>
                        <span className="text-base">{option}</span>
                      </div>
                      {isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Correct Answer */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Correct Answer</h3>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500 text-white">
                  Option {question.correctAnswer}
                </Badge>
                <span className="text-muted-foreground">
                  {question.options[question.correctAnswer.charCodeAt(0) - 65]}
                </span>
              </div>
            </div>

            {/* Explanation */}
            {question.explanation && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Explanation</h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <p className="text-base leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Question Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">
                      {getCategoryDisplayName(question.category)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">
                      {getTypeDisplayName(question.questionType)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className="font-medium capitalize">
                      {question.difficulty}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Question ID:</span>
                    <span className="font-medium">#{question.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Has Image:</span>
                    <span className="font-medium">
                      {question.imageUrl ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
