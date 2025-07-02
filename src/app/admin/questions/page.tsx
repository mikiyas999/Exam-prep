"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { PlusCircle, Search, Loader2, Trash2, Edit, Eye } from "lucide-react";
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

interface QuestionsResponse {
  success: boolean;
  questions: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [category, setCategory] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (questionType) params.append("questionType", questionType);
      if (difficulty) params.append("difficulty", difficulty);
      if (search) params.append("search", search);
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const response = await fetch(`/api/questions?${params.toString()}`);
      const data: QuestionsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch questions");
      }

      setQuestions(data.questions);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to fetch questions");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [
    pagination.page,
    category,
    questionType,
    difficulty,
    search,
    pagination.limit,
  ]);

  // Delete question
  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete question");
      }

      toast.success("Question deleted successfully");

      // Refresh questions list
      fetchQuestions();
    } catch (error) {
      toast.error("Failed to delete question");
      console.log(error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle filter change
  const handleFilterChange = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Fetch questions on component mount and when filters change
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return (
    <DashboardShell>
      <DashboardHeader heading="Questions" text="Manage your question bank.">
        <Button asChild>
          <Link href="/admin/questions/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Question
          </Link>
        </Button>
      </DashboardHeader>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Question Bank</CardTitle>
          <CardDescription>
            Manage and organize your questions for different exams.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                className="w-full"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:flex lg:items-center lg:space-x-2">
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amt">AMT</SelectItem>
                  <SelectItem value="hostess">Hostess</SelectItem>
                  <SelectItem value="pilot">Pilot</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={questionType}
                onValueChange={(value) => {
                  setQuestionType(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Question Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Math</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="abstract">Abstract Reasoning</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={difficulty}
                onValueChange={(value) => {
                  setDifficulty(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 rounded-md border overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading questions...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Question</TableHead>
                    <TableHead className="min-w-[100px]">Category</TableHead>
                    <TableHead className="min-w-[100px]">Type</TableHead>
                    <TableHead className="min-w-[100px]">Difficulty</TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">
                        <div
                          className="max-w-xs truncate"
                          title={question.questionText}
                        >
                          {question.questionText}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {question.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {question.questionType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            question.difficulty === "easy"
                              ? "bg-green-500"
                              : question.difficulty === "medium"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        >
                          {question.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <Link href={`/admin/questions/${question.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <Link href={`/admin/questions/${question.id}/edit`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full sm:w-auto text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the question.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(question.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={isDeleting === question.id}
                                >
                                  {isDeleting === question.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            {pagination.total > 0 ? (
              <>
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} questions
              </>
            ) : (
              "No questions found"
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages || isLoading}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </DashboardShell>
  );
}
