"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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

const bulkUploadSchema = z.object({
  questions: z
    .array(
      z.object({
        questionText: z.string().min(5),
        optionA: z.string().min(1),
        optionB: z.string().min(1),
        optionC: z.string().min(1),
        correctAnswer: z.enum(["A", "B", "C"]),
        explanation: z.string().optional(),
        category: z.enum(["amt", "hostess", "pilot"]),
        questionType: z.enum(["math", "reading", "mechanical", "abstract"]),
        difficulty: z.enum(["easy", "medium", "hard"]),
      })
    )
    .min(1, "At least one question is required"),
});

export default function NewQuestionPage() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [bulkQuestions, setBulkQuestions] = useState<any[]>([]);
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);

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

  // Handle single question submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const questionData = {
        ...values,
        imageUrl: imageUrl || undefined,
      };

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create question");
      }

      toast.success("create question successfully");

      router.push("/admin/questions");
    } catch (error) {
      toast.error("Failed to create questions");
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
      toast.error("Image has not been uploaded successfully");
    }
  };

  // Handle CSV file parsing
  const handleCsvUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());

        const expectedHeaders = [
          "questionText",
          "optionA",
          "optionB",
          "optionC",
          "correctAnswer",
          "explanation",
          "category",
          "questionType",
          "difficulty",
        ];

        // Validate headers
        const missingHeaders = expectedHeaders.filter(
          (h) => !headers.includes(h)
        );
        if (missingHeaders.length > 0) {
          setBulkErrors([`Missing headers: ${missingHeaders.join(", ")}`]);
          return;
        }

        const questions = [];
        const errors = [];

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === "") continue;

          const values = lines[i].split(",").map((v) => v.trim());
          const questionObj: any = {};

          headers.forEach((header, index) => {
            questionObj[header] = values[index] || "";
          });

          // Validate each question
          try {
            const validatedQuestion =
              bulkUploadSchema.shape.questions.element.parse(questionObj);
            questions.push(validatedQuestion);
          } catch (error) {
            errors.push(`Row ${i + 1}: Invalid data format`);
          }
        }

        setBulkQuestions(questions);
        setBulkErrors(errors);

        if (questions.length > 0) {
          toast.success(`Found ${questions.length} valid questions`);
        }
      } catch (error) {
        setBulkErrors(["Failed to parse CSV file"]);
        console.error("sd");
      }
    };
    reader.readAsText(file);
  };

  // Handle bulk upload submission
  const handleBulkSubmit = async () => {
    if (bulkQuestions.length === 0) {
      toast.success("Please upload a valid CSV file first");
      return;
    }

    setIsBulkSubmitting(true);
    try {
      const response = await fetch("/api/questions/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions: bulkQuestions }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create questions");
      }

      toast.success("questions create successfully ");

      router.push("/admin/questions");
    } catch (error) {
      toast.error("Failed to create questions");
    } finally {
      setIsBulkSubmitting(false);
    }
  };

  // Generate CSV template
  const downloadTemplate = () => {
    const headers = [
      "questionText",
      "optionA",
      "optionB",
      "optionC",
      "correctAnswer",
      "explanation",
      "category",
      "questionType",
      "difficulty",
    ];

    const sampleRow = [
      "Find 32% of 897",
      "287.04",
      "460",
      "345",
      "A",
      "To find 32% of 897, multiply 897 by 0.32",
      "amt",
      "math",
      "medium",
    ];

    const csvContent = [headers.join(","), sampleRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Add New Question"
        text="Create a new question for the exam bank."
      />

      <Tabs defaultValue="single" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="single">Single Question</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Question Details</CardTitle>
                  <CardDescription>
                    Enter the details for the new question.
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
                        <Image
                          src={imageUrl}
                          alt="Question preview"
                          width={400} // or any desired width
                          height={300} // maintain your image aspect ratio
                          className="max-w-xs rounded-md border object-contain"
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
                        Creating...
                      </>
                    ) : (
                      "Save Question"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Questions</CardTitle>
              <CardDescription>
                Upload multiple questions at once using a CSV file.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {bulkErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {bulkErrors.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {bulkQuestions.length > 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Successfully parsed {bulkQuestions.length} questions from
                    CSV file.
                  </AlertDescription>
                </Alert>
              )}

              <div className="rounded-md border border-dashed p-6 md:p-10">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <Upload className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                  <div>
                    <p className="text-base md:text-lg font-medium">
                      Drag and drop your CSV file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Or click to browse
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("csv-upload")?.click()
                    }
                  >
                    Browse Files
                  </Button>
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setCsvFile(file);
                        handleCsvUpload(file);
                      }
                    }}
                  />
                  {csvFile && (
                    <span className="text-sm text-muted-foreground">
                      Selected: {csvFile.name}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-base md:text-lg font-medium">
                  CSV Format
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your CSV file should have the following columns:
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>questionText (required)</li>
                  <li>optionA (required)</li>
                  <li>optionB (required)</li>
                  <li>optionC (required)</li>
                  <li>correctAnswer (A, B, or C)</li>
                  <li>explanation (optional)</li>
                  <li>category (amt, hostess, or pilot)</li>
                  <li>questionType (math, reading, mechanical, or abstract)</li>
                  <li>difficulty (easy, medium, or hard)</li>
                </ul>
                <Button
                  className="mt-4"
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                >
                  Download Template
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/questions")}
                className="w-full sm:w-auto"
                disabled={isBulkSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={handleBulkSubmit}
                disabled={isBulkSubmitting || bulkQuestions.length === 0}
              >
                {isBulkSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload and Process"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
