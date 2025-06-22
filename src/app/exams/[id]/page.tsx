"use client";

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
  Clock,
  Loader2,
  AlertCircle,
  Flag,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { use } from "react";
import Image from "next/image";

interface Question {
  questionId: number;
  order: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  imageUrl?: string;
  questionType: string;
  difficulty: string;
}

interface Exam {
  id: number;
  title: string;
  description?: string;
  category: string;
  questionTypes?: string[];
  difficulty?: string;
  timeLimit?: number;
  createdAt: string;
}

export default function ExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  // State
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [examStarted, setExamStarted] = useState(false);

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate progress
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  // Fetch exam and questions
  const fetchExamData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/exams/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch exam data");
      }

      setExam(data.exam);
      setQuestions(data.questions);

      // Set timer if exam has time limit
      if (data.exam.timeLimit) {
        setTimeRemaining(data.exam.timeLimit * 60); // Convert minutes to seconds
      }
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load exam");
    } finally {
      setIsLoading(false);
    }
  };

  // Start exam
  const startExam = () => {
    setExamStarted(true);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.questionId]: answer,
    });
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Move to the previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Jump to specific question
  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  // Submit exam
  const submitExam = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/exams/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: selectedAnswers,
          timeSpent: exam?.timeLimit
            ? exam.timeLimit * 60 - (timeRemaining || 0)
            : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit exam");
      }

      toast.success("Exam submitted successfully");
      console.log(data);
      // Store results and navigate to results page
      localStorage.setItem(
        "examResults",
        JSON.stringify({
          exam,
          ...data.results,
        })
      );

      router.push("/exams/results");
    } catch (error) {
      toast.error("Failed to submit exam");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
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
    if (examStarted && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (examStarted && timeRemaining === 0) {
      // Time's up - auto submit
      submitExam();
    }
  }, [examStarted, timeRemaining]);

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchExamData();
    }
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading exam...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !exam) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Exam not found"}</AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <Button onClick={() => router.push("/exams")}>Back to Exams</Button>
        </div>
      </div>
    );
  }

  // Pre-exam screen
  if (!examStarted) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/exams")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exams
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{exam.title}</CardTitle>
            {exam.description && (
              <CardDescription className="text-base">
                {exam.description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="font-medium">Questions:</span>
                  <span className="ml-1">{questions.length}</span>
                </div>

                {exam.timeLimit && (
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4" />
                    <span className="font-medium">Time Limit:</span>
                    <span className="ml-1">{exam.timeLimit} minutes</span>
                  </div>
                )}

                <div className="flex items-center text-sm">
                  <Badge variant="outline" className="capitalize">
                    {exam.category}
                  </Badge>
                </div>
              </div>

              {exam.questionTypes && exam.questionTypes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Question Types:</div>
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

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Instructions:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    • Read each question carefully before selecting your answer
                  </li>
                  <li>
                    • You can navigate between questions using the navigation
                    buttons
                  </li>
                  <li>• Make sure to answer all questions before submitting</li>
                  {exam.timeLimit && (
                    <li>• The exam will auto-submit when time expires</li>
                  )}
                  <li>• Once submitted, you cannot change your answers</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter>
            <Button onClick={startExam} className="w-full" size="lg">
              Start Exam
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Exam interface
  return (
    <div className="container mx-auto py-4 md:py-8 px-4">
      <div className="mb-4 md:mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{exam.title}</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          {timeRemaining !== null && (
            <Badge variant="outline" className="flex items-center w-fit">
              <Clock className="mr-1 h-4 w-4" />
              {formatTime(timeRemaining)}
            </Badge>
          )}
          <Badge className="w-fit">
            {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
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
              <Image
                src={currentQuestion.imageUrl}
                alt="Question diagram"
                width={800} // or your preferred dimensions
                height={400}
                className="w-full object-cover max-h-64 md:max-h-96"
              />
            </div>
          </CardContent>
        )}

        <CardContent className="pt-6">
          <RadioGroup
            key={currentQuestion.questionId} // force re-mount on question change
            value={selectedAnswers[currentQuestion.questionId] ?? ""}
            onValueChange={handleAnswerSelect}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => {
              const optionKey = String.fromCharCode(65 + index); // A, B, C...
              const isSelected =
                selectedAnswers[currentQuestion.questionId] === optionKey;

              return (
                <div
                  key={optionKey}
                  className={`flex items-center rounded-md border p-3 md:p-4 ${
                    isSelected ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <RadioGroupItem
                    value={optionKey}
                    id={`option-${optionKey}`}
                  />
                  <Label
                    htmlFor={`option-${optionKey}`}
                    className="flex-1 cursor-pointer pl-3 text-sm md:text-base"
                  >
                    <span className="font-medium mr-2">{optionKey}.</span>
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
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
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={handleNextQuestion}
                className="w-full md:w-auto"
                disabled={!selectedAnswers[currentQuestion.questionId]}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={submitExam}
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag className="mr-2 h-4 w-4" />
                    Submit Exam
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Question Navigation */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {questions.map((_, index) => (
          <Button
            key={index}
            variant={index === currentQuestionIndex ? "default" : "outline"}
            className={`h-10 w-full p-0 text-xs ${
              selectedAnswers[questions[index].questionId]
                ? "border-primary bg-primary/10"
                : ""
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
