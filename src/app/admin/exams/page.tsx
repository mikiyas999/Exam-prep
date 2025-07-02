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

  const fetchExams = useCallback(async () => {
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
      setError((error as Error).message);
      toast.error("Failed to fetch exams");
    } finally {
      setIsLoading(false);
    }
  }, [category, search, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

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
      fetchExams();
    } catch (error) {
      toast.error("Failed to delete exam");
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const getCategoryDisplayName = (category: string) => {
    const names = {
      amt: "AMT",
      hostess: "Cabin Crew",
      pilot: "Pilot",
    };
    return names[category as keyof typeof names] || category;
  };

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return "bg-gray-500";
    const colors = {
      easy: "bg-green-500",
      medium: "bg-yellow-500",
      hard: "bg-red-500",
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-500";
  };

  // Rendering remains unchanged
  // You can paste the full JSX portion from your original code here
}
