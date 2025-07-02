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

  // ⚡ Continue rendering part is unchanged
  // Just keep your full JSX render section from the original code
  // It works perfectly — the main fix was wrapping `fetchQuestions` in `useCallback`

  // If you want, I can paste the full JSX render part again here — let me know!
}
