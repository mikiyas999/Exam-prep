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
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Loader2,
  Trash2,
  Edit,
  Eye,
  Clock,
  FileText,
  AlertCircle,
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

interface ExamsResponse {
  success: boolean;
  exams: Exam[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Fetch exams
  const fetchExams = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (search) params.append("search", search);
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const response = await fetch(`/api/admin/exams?${params.toString()}`);
      const data: ExamsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch exams");
      }

      setExams(data.exams);
      setPagination(data.pagination);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch exams");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete exam
  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/admin/exams/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete exam");
      }

      toast.success("Exam deleted successfully");

      // Refresh exams list
      fetchExams();
    } catch (error) {
      toast.error("Failed to delete exam");
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

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    const names = {
      amt: "AMT",
      hostess: "Cabin Crew",
      pilot: "Pilot",
    };
    return names[category as keyof typeof names] || category;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return "bg-gray-500";
    const colors = {
      easy: "bg-green-500",
      medium: "bg-yellow-500",
      hard: "bg-red-500",
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-500";
  };

  // Fetch exams on component mount and when filters change
  useEffect(() => {
    fetchExams();
  }, [pagination.page, category, search]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manage Exams"
        text="Create and manage exams for your platform."
      >
        <Button asChild>
          <Link href="/admin/exams/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Exam
          </Link>
        </Button>
      </DashboardHeader>

      <div className="mt-6 space-y-6">
        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Exam Management</CardTitle>
            <CardDescription>
              Manage and organize exams for different categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exams..."
                  className="w-full"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
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
                  <SelectItem value="hostess">Cabin Crew</SelectItem>
                  <SelectItem value="pilot">Pilot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6 rounded-md border overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading exams...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Title</TableHead>
                      <TableHead className="min-w-[100px]">Category</TableHead>
                      <TableHead className="min-w-[100px]">Questions</TableHead>
                      <TableHead className="min-w-[100px]">
                        Time Limit
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        Difficulty
                      </TableHead>
                      <TableHead className="text-right min-w-[150px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div
                              className="max-w-xs truncate font-medium"
                              title={exam.title}
                            >
                              {exam.title}
                            </div>
                            {exam.description && (
                              <div
                                className="text-xs text-muted-foreground max-w-xs truncate"
                                title={exam.description}
                              >
                                {exam.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {getCategoryDisplayName(exam.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{exam.questionCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {exam.timeLimit ? (
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                              <span>{exam.timeLimit}m</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              No limit
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {exam.difficulty ? (
                            <Badge
                              className={getDifficultyColor(exam.difficulty)}
                            >
                              {exam.difficulty}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Mixed</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2">
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              <Link href={`/admin/exams/${exam.id}`}>
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
                              <Link href={`/admin/exams/${exam.id}/edit`}>
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
                                    permanently delete the exam and all
                                    associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(exam.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={isDeleting === exam.id}
                                  >
                                    {isDeleting === exam.id ? (
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
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} exams
                </>
              ) : (
                "No exams found"
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
      </div>
    </DashboardShell>
  );
}
