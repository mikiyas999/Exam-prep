"use client";
import { use } from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
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
}

interface Subject {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  questionCount: number;
}

export default function PracticeSessionPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const router = useRouter();
  const { subjectId } = use(params);
  // State
  const [subject, setSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate progress
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  // Fetch subject and questions
  const fetchSubjectData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/practice/subjects/${subjectId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subject data");
      }

      setSubject(data.subject);
      setQuestions(data.questions);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load practice session");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  // Move to the previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  // Jump to specific question
  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowExplanation(false);
  };

  // Finish practice session
  const finishPractice = () => {
    // Calculate results
    const results = questions.map((question, index) => {
      const userAnswer = selectedAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    const correctAnswers = results.filter((r) => r.isCorrect).length;
    const scorePercentage = Math.round(
      (correctAnswers / questions.length) * 100
    );

    // Store results in localStorage
    const sessionResults = {
      subject,
      results,
      score: {
        correct: correctAnswers,
        total: questions.length,
        percentage: scorePercentage,
      },
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem("practiceResults", JSON.stringify(sessionResults));

    // Navigate to results page
    router.push("/practice/results");
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Time's up - auto finish
      finishPractice();
    }
  }, [timeRemaining]);

  // Fetch data on component mount
  useEffect(() => {
    fetchSubjectData();
  }, [subjectId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading practice session...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !subject || !currentQuestion) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Subject or questions not found"}
          </AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <Button onClick={() => router.push("/practice")}>
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 md:py-8 px-4">
      <div className="mb-4 md:mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <Button
          variant="ghost"
          onClick={() => router.push("/practice")}
          className="flex items-center w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Practice
        </Button>

        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <Badge variant="outline" className="flex items-center w-fit">
            <Clock className="mr-1 h-4 w-4" />
            {formatTime(timeRemaining)}
          </Badge>
          <Badge className="w-fit">
            {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
      </div>

      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">{subject.name}</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {subject.description}
        </p>
      </div>

      <div className="mb-4">
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-4 md:mb-6">
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <Badge variant="outline" className="mb-2 capitalize">
                {currentQuestion.questionType}
              </Badge>
              <CardTitle className="text-lg md:text-xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
            </div>
            <Badge
              className={
                currentQuestion.difficulty === "easy"
                  ? "bg-green-500"
                  : currentQuestion.difficulty === "medium"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }
            >
              {currentQuestion.difficulty}
            </Badge>
          </div>
          <CardDescription className="text-sm md:text-base font-medium text-foreground mt-2">
            {currentQuestion.questionText}
          </CardDescription>
        </CardHeader>

        {currentQuestion.imageUrl && (
          <CardContent className="pb-0">
            <div className="overflow-hidden rounded-md">
              <img
                src={currentQuestion.imageUrl}
                alt="Question diagram"
                className="w-full object-cover max-h-64 md:max-h-96"
              />
            </div>
          </CardContent>
        )}

        <CardContent className="pt-6">
          <RadioGroup
            value={selectedAnswers[currentQuestionIndex]}
            onValueChange={handleAnswerSelect}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => {
              const optionKey = String.fromCharCode(65 + index); // A, B, C...
              const isSelected =
                selectedAnswers[currentQuestionIndex] === optionKey;
              const isCorrect =
                showExplanation && optionKey === currentQuestion.correctAnswer;
              const isWrong = showExplanation && isSelected && !isCorrect;

              return (
                <div
                  key={optionKey}
                  className={`flex items-center rounded-md border p-3 md:p-4 ${
                    isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : isWrong
                      ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                      : isSelected
                      ? "border-primary"
                      : ""
                  }`}
                >
                  <RadioGroupItem
                    value={optionKey}
                    id={`option-${optionKey}`}
                    disabled={showExplanation}
                  />
                  <Label
                    htmlFor={`option-${optionKey}`}
                    className="flex-1 cursor-pointer pl-3 text-sm md:text-base"
                  >
                    <span className="font-medium mr-2">{optionKey}.</span>
                    {option}
                  </Label>
                  {showExplanation && isCorrect && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showExplanation && isWrong && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              );
            })}
          </RadioGroup>

          {showExplanation && currentQuestion.explanation && (
            <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
              <h3 className="mb-2 font-medium">Explanation</h3>
              <p className="text-sm md:text-base">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="w-full md:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            {!showExplanation && selectedAnswers[currentQuestionIndex] && (
              <Button
                variant="secondary"
                onClick={() => setShowExplanation(true)}
                className="w-full md:w-auto"
              >
                Check Answer
              </Button>
            )}

            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNextQuestion} className="w-full md:w-auto">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={finishPractice} className="w-full md:w-auto">
                Finish Practice
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {questions.map((_, index) => (
          <Button
            key={index}
            variant={index === currentQuestionIndex ? "default" : "outline"}
            className={`h-10 w-full p-0 text-xs ${
              selectedAnswers[index] ? "border-primary bg-primary/10" : ""
            }`}
            onClick={() => jumpToQuestion(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
