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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";

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
  optionD: z.string().min(1, {
    message: "Option D is required.",
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

export default function NewQuestionPage() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: undefined,
      explanation: "",
      category: undefined,
      questionType: undefined,
      difficulty: "medium",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real implementation, this would submit to your API
    console.log(values);
    router.push("/admin/questions");
  }

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
                            setImage(e.target.files[0]);
                          }
                        }}
                      />
                      {image && (
                        <span className="text-sm text-muted-foreground truncate">
                          {image.name}
                        </span>
                      )}
                    </div>
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
                    <FormField
                      control={form.control}
                      name="optionD"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Option C</FormLabel>
                          <FormControl>
                            <Input placeholder="Option D" {...field} />
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
                            <SelectItem value="D">Option C</SelectItem>
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
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Save Question
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
                  />
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
                  <li>question_text (required)</li>
                  <li>option_a (required)</li>
                  <li>option_b (required)</li>
                  <li>option_c (required)</li>
                  <li>correct_answer (A, B, or C)</li>
                  <li>explanation (optional)</li>
                  <li>category (amt, hostess, or pilot)</li>
                  <li>
                    question_type (math, reading, mechanical, or abstract)
                  </li>
                  <li>difficulty (easy, medium, or hard)</li>
                </ul>
                <Button className="mt-4" variant="outline" size="sm">
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
              >
                Cancel
              </Button>
              <Button type="button" className="w-full sm:w-auto">
                Upload and Process
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
