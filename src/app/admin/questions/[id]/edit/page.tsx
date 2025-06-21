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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Upload, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  questionText: z.string().min(5, {
    message: "Question text must be at least 5 characters.",
  }),
  optionA: z.string().min(1, {
    message: "Option A is required.",
  }),
  optionB: z.string().min(1, {
    message: "Option B is required.",
  }),
  optionC: z.string().min(1, {
    message: "Option C is required.",
  }),
  correctAnswer: z.enum(["A", "B", "C"], {
    required_error: "Please select the correct answer.",
  }),
  explanation: z.string().optional(),
  category: z.enum(["amt", "hostess", "pilot"], {
    required_error: "Please select a category.",
  }),
  questionType: z.enum(["math", "reading", "mechanical", "abstract"], {
    required_error: "Please select a question type.",
  }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Please select a difficulty level.",
  }),
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
}

export default function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: questionId } = use(params);

  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      correctAnswer: undefined,
      explanation: "",
      category: undefined,
      questionType: undefined,
      difficulty: "medium",
    },
  });

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

      const questionData = data.question;
      setQuestion(questionData);
      setImageUrl(questionData.imageUrl || "");

      // Populate form with existing data
      form.reset({
        questionText: questionData.questionText,
        optionA: questionData.options[0] || "",
        optionB: questionData.options[1] || "",
        optionC: questionData.options[2] || "",
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation || "",
        category: questionData.category,
        questionType: questionData.questionType,
        difficulty: questionData.difficulty,
      });
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load question");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const questionData = {
        ...values,
        imageUrl: imageUrl || undefined,
      };

      const response = await fetch(`/api/questions/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update question");
      }

      toast.success("update Question successfully");

      router.push("/admin/questions");
    } catch (error) {
      toast.error("Failed to update question");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      // In a real implementation, you would upload to a service like UploadThing
      // For now, we'll create a mock URL
      const mockUrl = `https://example.com/images/${file.name}`;
      setImageUrl(mockUrl);

      toast.success("Image has been uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.log(error);
    }
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
        heading="Edit Question"
        text="Update the question details and options."
      >
        <Button
          variant="outline"
          onClick={() => router.push("/admin/questions")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Questions
        </Button>
      </DashboardHeader>

      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Question Details</CardTitle>
                <CardDescription>
                  Update the question information and options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="questionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the question text..."
                          {...field}
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label>Question Image (Optional)</Label>
                  <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                      className="w-full sm:w-auto"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setImage(file);
                          handleImageUpload(file);
                        }
                      }}
                    />
                    {image && (
                      <span className="text-sm text-muted-foreground truncate">
                        {image.name}
                      </span>
                    )}
                  </div>
                  {imageUrl && (
                    <div className="mt-2">
                      <img
                        src={imageUrl}
                        alt="Question preview"
                        className="max-w-xs rounded-md border"
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="optionA"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option A</FormLabel>
                        <FormControl>
                          <Input placeholder="Option A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="optionB"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option B</FormLabel>
                        <FormControl>
                          <Input placeholder="Option B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="optionC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option C</FormLabel>
                        <FormControl>
                          <Input placeholder="Option C" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="correctAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correct Answer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">Option A</SelectItem>
                          <SelectItem value="B">Option B</SelectItem>
                          <SelectItem value="C">Option C</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explanation (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain why this answer is correct..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-3">
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
                            <SelectItem value="hostess">Hostess</SelectItem>
                            <SelectItem value="pilot">Pilot</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="questionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="math">Math</SelectItem>
                            <SelectItem value="reading">Reading</SelectItem>
                            <SelectItem value="mechanical">
                              Mechanical
                            </SelectItem>
                            <SelectItem value="abstract">
                              Abstract Reasoning
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
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
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/questions")}
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Question"
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
