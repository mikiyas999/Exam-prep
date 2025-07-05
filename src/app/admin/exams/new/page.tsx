"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Search,
  Plus,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  category: z.enum(["amt", "hostess", "pilot"], {
    required_error: "Please select a category.",
  }),
  questionTypes: z
    .array(z.enum(["math", "reading", "mechanical", "abstract"]))
    .optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  timeLimit: z.number().min(1).max(300).optional(),
});

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

interface QuestionsResponse {
  success: boolean;
  message?: string;
  questions: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function NewExamPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState("");

  const [questionCategory, setQuestionCategory] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("");
  const [questionDifficulty, setQuestionDifficulty] = useState<string>("");
  const [questionSearch, setQuestionSearch] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      questionTypes: [],
      difficulty: undefined,
      timeLimit: 60,
    },
  });

  const watchedCategory = form.watch("category");

  const fetchQuestions = useCallback(async () => {
    setIsLoadingQuestions(true);
    setQuestionsError("");
    try {
      const params = new URLSearchParams();
      if (questionCategory) params.append("category", questionCategory);
      if (questionType) params.append("questionType", questionType);
      if (questionDifficulty) params.append("difficulty", questionDifficulty);
      if (questionSearch) params.append("search", questionSearch);
      params.append("limit", "50");

      const response = await fetch(`/api/questions?${params.toString()}`);
      const data: QuestionsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch questions");
      }

      setAvailableQuestions(data.questions);
    } catch (error) {
      setQuestionsError((error as Error).message);
      toast.error("Failed to load questions");
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [questionCategory, questionType, questionDifficulty, questionSearch]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (watchedCategory) {
      setQuestionCategory(watchedCategory);
    }
  }, [watchedCategory]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question for the exam");
      return;
    }

    setIsSubmitting(true);
    try {
      const examData = {
        ...values,
        questionIds: selectedQuestions,
      };

      const response = await fetch("/api/admin/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create exam");
      }

      toast.success("Exam created successfully");
      router.push("/admin/exams");
    } catch (error) {
      toast.error("Failed to create exam");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleQuestionSelect = (questionId: number, checked: boolean) => {
    setSelectedQuestions((prev) =>
      checked ? [...prev, questionId] : prev.filter((id) => id !== questionId)
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === availableQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(availableQuestions.map((q) => q.id));
    }
  };

  const getCategoryDisplayName = (category: string) => {
    const names = {
      amt: "AMT",
      hostess: "Cabin Crew",
      pilot: "Pilot",
    };
    return names[category as keyof typeof names] || category;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-500",
      medium: "bg-yellow-500",
      hard: "bg-red-500",
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create New Exam"
        text="Set up a new exam with selected questions."
      >
        <Button variant="outline" onClick={() => router.push("/admin/exams")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exams
        </Button>
      </DashboardHeader>

      <div className="mt-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Exam Details */}
            <Card>
              <CardHeader>
                <CardTitle>Exam Details</CardTitle>
                <CardDescription>
                  Configure the basic information for your exam.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter exam title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="amt">AMT</SelectItem>
                            <SelectItem value="hostess">Cabin Crew</SelectItem>
                            <SelectItem value="pilot">Pilot</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter exam description..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Difficulty (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="300"
                            placeholder="60"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) || undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Question Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Questions</CardTitle>
                <CardDescription>
                  Choose questions to include in this exam.{" "}
                  {selectedQuestions.length} questions selected.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question Filters */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Search Questions</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={questionSearch}
                        onChange={(e) => setQuestionSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select
                      value={questionType || "all"}
                      onValueChange={(val) =>
                        setQuestionType(val === "all" ? "" : val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="mechanical">Mechanical</SelectItem>
                        <SelectItem value="abstract">Abstract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      value={questionDifficulty || "all"}
                      onValueChange={(val) =>
                        setQuestionDifficulty(val === "all" ? "" : val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Actions</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSelectAll}
                      className="w-full"
                    >
                      {selectedQuestions.length === availableQuestions.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>
                </div>

                {/* Selected Questions Summary */}
                {selectedQuestions.length > 0 && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>
                        {selectedQuestions.length} questions selected
                      </strong>
                      {form.watch("timeLimit") && (
                        <span>
                          {" "}
                          • Estimated time: {form.watch("timeLimit")} minutes
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Questions Error */}
                {questionsError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{questionsError}</AlertDescription>
                  </Alert>
                )}

                {/* Questions Table */}
                <div className="rounded-md border">
                  {isLoadingQuestions ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading questions...</span>
                    </div>
                  ) : availableQuestions.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      No questions found.{" "}
                      {watchedCategory
                        ? `Try selecting a different category or `
                        : ""}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => router.push("/admin/questions/new")}
                      >
                        create some questions first
                      </Button>
                      .
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                selectedQuestions.length ===
                                  availableQuestions.length &&
                                availableQuestions.length > 0
                              }
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead className="min-w-[300px]">
                            Question
                          </TableHead>
                          <TableHead className="min-w-[100px]">Type</TableHead>
                          <TableHead className="min-w-[100px]">
                            Difficulty
                          </TableHead>
                          <TableHead className="min-w-[100px]">
                            Category
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableQuestions.map((question) => (
                          <TableRow key={question.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedQuestions.includes(
                                  question.id
                                )}
                                onCheckedChange={(checked) =>
                                  handleQuestionSelect(
                                    question.id,
                                    checked as boolean
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="max-w-md">
                                <div
                                  className="truncate"
                                  title={question.questionText}
                                >
                                  {question.questionText}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ID: {question.id}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize">
                                {question.questionType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getDifficultyColor(
                                  question.difficulty
                                )}
                              >
                                {question.difficulty}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {getCategoryDisplayName(question.category)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Card>
              <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/exams")}
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting || selectedQuestions.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Exam...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Exam ({selectedQuestions.length} questions)
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </DashboardShell>
  );
}
