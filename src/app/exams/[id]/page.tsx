"use client";

import { useState, useEffect, use, useCallback } from "react";
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
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  Flag,
  FileText,
  Zap,
  Target,
  Brain,
  Timer,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
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
  const { id: examId } = use(params);

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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate progress
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;
  const answeredQuestions = Object.keys(selectedAnswers).length;

  // Fetch exam and questions
  const fetchExamData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/exams/${examId}`);
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
  }, [examId]);

  // Start exam with animation
  const startExam = () => {
    setExamStarted(true);
  };

  // Handle answer selection with animation
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.questionId]: answer,
    });
  };

  // Move to the next question with animation
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Move to the previous question with animation
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Jump to specific question with animation
  const jumpToQuestion = (index: number) => {
    if (index !== currentQuestionIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Submit exam
  const submitExam = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/exams/${examId}/submit`, {
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
  }, [examId, exam, router, selectedAnswers, timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Get time color based on remaining time
  const getTimeColor = (seconds: number) => {
    if (!exam?.timeLimit) return "text-blue-600";
    const totalTime = exam.timeLimit * 60;
    const percentage = (seconds / totalTime) * 100;

    if (percentage <= 10) return "text-red-600 animate-pulse";
    if (percentage <= 25) return "text-orange-600";
    if (percentage <= 50) return "text-yellow-600";
    return "text-green-600";
  };

  // Get question type icon
  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "math":
        return <Target className="h-4 w-4" />;
      case "reading":
        return <BookOpen className="h-4 w-4" />;
      case "mechanical":
        return <Zap className="h-4 w-4" />;
      case "abstract":
        return <Brain className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Timer effect
  useEffect(() => {
    if (examStarted && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (examStarted && timeRemaining === 0) {
      submitExam();
    }
  }, [examStarted, timeRemaining, submitExam]); // ✅ fixed

  // Fetch data on component mount
  useEffect(() => {
    if (examId) {
      fetchExamData();
    }
  }, [examId, fetchExamData]); // ✅ no warning

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1.5s",
                  }}
                ></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Loading Exam
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Preparing your questions...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-md mx-auto mt-20">
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:bg-red-950/20"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error || "Exam not found"}
              </AlertDescription>
            </Alert>
            <div className="text-center mt-6">
              <Button
                onClick={() => router.push("/exams")}
                className="bg-red-600 hover:bg-red-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Exams
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pre-exam screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/exams")}
            className="mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Button>

          <div className="text-center mb-8 space-y-4">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-800 p-4 rounded-full">
                <FileText className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Begin?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              You are about to start the {exam.title}. Take your time and do
              your best!
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {exam.title}
              </CardTitle>
              {exam.description && (
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                  {exam.description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Exam Stats */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {questions.length}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Questions
                  </div>
                </div>

                {exam.timeLimit && (
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <Timer className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {exam.timeLimit}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Minutes
                    </div>
                  </div>
                )}

                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <Star className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 capitalize">
                    {exam.difficulty || "Mixed"}
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Difficulty
                  </div>
                </div>
              </div>

              {/* Question Types */}
              {exam.questionTypes && exam.questionTypes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white">
                    Question Types
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {exam.questionTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border-0 capitalize"
                      >
                        {getQuestionTypeIcon(type)}
                        <span className="ml-2">{type}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <div className="space-y-2">
                    <p className="font-semibold">Exam Instructions:</p>
                    <ul className="space-y-1 text-sm ml-4">
                      <li>
                        • Read each question carefully before selecting your
                        answer
                      </li>
                      <li>
                        • You can navigate between questions using the
                        navigation buttons
                      </li>
                      <li>
                        • Make sure to answer all questions before submitting
                      </li>
                      {exam.timeLimit && (
                        <li>• The exam will auto-submit when time expires</li>
                      )}
                      <li>• Once submitted, you cannot change your answers</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="pt-6">
              <Button
                onClick={startExam}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                size="lg"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Exam
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Exam interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-4 md:py-6 px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {exam.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>•</span>
              <span>{answeredQuestions} answered</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {timeRemaining !== null && (
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md border ${getTimeColor(
                  timeRemaining
                )}`}
              >
                <Clock className="h-4 w-4" />
                <span className="font-mono font-semibold text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            <Badge className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              {currentQuestionIndex + 1} / {questions.length}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="relative">
            <Progress
              value={progress}
              className="h-3 bg-gray-200 dark:bg-gray-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`transition-all duration-300 ${
            isTransitioning
              ? "opacity-0 transform translate-x-4"
              : "opacity-100 transform translate-x-0"
          }`}
        >
          <Card className="mb-6 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
                      {getQuestionTypeIcon(currentQuestion.questionType)}
                      <span className="text-sm font-medium capitalize text-blue-700 dark:text-blue-300">
                        {currentQuestion.questionType}
                      </span>
                    </div>
                    <Badge
                      className={`${
                        currentQuestion.difficulty === "easy"
                          ? "bg-green-500 hover:bg-green-600"
                          : currentQuestion.difficulty === "medium"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white border-0`}
                    >
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-200 mt-4 leading-relaxed">
                {currentQuestion.questionText}
              </CardDescription>
            </CardHeader>

            {currentQuestion.imageUrl && (
              <CardContent className="pb-0">
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                  <Image
                    src={currentQuestion.imageUrl}
                    alt="Question diagram"
                    width={800} // adjust as needed
                    height={400} // adjust as needed
                    className="w-full object-cover max-h-80 md:max-h-96 transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </CardContent>
            )}

            <CardContent className="pt-6">
              <RadioGroup
                value={selectedAnswers[currentQuestion.questionId]}
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
                      className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                        isSelected
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center p-4 md:p-6">
                        <RadioGroupItem
                          value={optionKey}
                          id={`option-${optionKey}`}
                          className="mt-1 flex-shrink-0"
                        />
                        <Label
                          htmlFor={`option-${optionKey}`}
                          className="flex-1 cursor-pointer pl-4 text-base md:text-lg leading-relaxed"
                        >
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-sm font-bold mr-3 group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-900/50 dark:group-hover:to-purple-900/50 transition-all duration-300">
                            {optionKey}
                          </span>
                          {option}
                        </Label>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                      )}
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:space-y-0 pt-6">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="w-full lg:w-auto bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={submitExam}
                    className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200"
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
        </div>

        {/* Question Navigation */}
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Question Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2">
              {questions.map((_, index) => {
                const isAnswered = selectedAnswers[questions[index].questionId];
                const isCurrent = index === currentQuestionIndex;

                return (
                  <Button
                    key={index}
                    variant={isCurrent ? "default" : "outline"}
                    className={`h-12 w-full p-0 text-sm font-semibold transition-all duration-200 ${
                      isCurrent
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                        : isAnswered
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/30"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => jumpToQuestion(index)}
                  >
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <span>{index + 1}</span>
                      {isAnswered && !isCurrent && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  Current
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-950/20 border border-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  Answered
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  Unanswered
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
