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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import {
  Clock,
  FileText,
  Folder,
  Search,
  Settings,
  Tag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Subject {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  difficulty: string;
  questionCount: number;
}

interface PracticeTest {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  questions: number;
  timeLimit: number;
  questionTypes: string[];
}

export default function PracticePage() {
  const [category, setCategory] = useState("amt");
  const [questionType, setQuestionType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timedMode, setTimedMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questionCount, setQuestionCount] = useState(10);

  // State for subjects
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState("");

  // State for practice tests
  const [practiceTests, setPracticeTests] = useState<PracticeTest[]>([]);
  const [isLoadingTests, setIsLoadingTests] = useState(true);
  const [testsError, setTestsError] = useState("");

  // Fetch subjects
  const fetchSubjects = async () => {
    setIsLoadingSubjects(true);
    setSubjectsError("");
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(
        `/api/practice/subjects?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subjects");
      }

      setSubjects(data.subjects);
    } catch (error) {
      setSubjectsError(error.message);
      toast.error("Failed to fetch subjects");
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  // Fetch practice tests
  const fetchPracticeTests = async () => {
    setIsLoadingTests(true);
    setTestsError("");
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);

      const response = await fetch(`/api/practice/tests?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch practice tests");
      }

      setPracticeTests(data.practiceTests);
    } catch (error) {
      setTestsError(error.message);
      toast.error("Failed to fetch practice tests");
    } finally {
      setIsLoadingTests(false);
    }
  };

  // Start custom practice session
  const startCustomPractice = async () => {
    try {
      const params = new URLSearchParams();
      params.append("category", category);
      if (questionType) params.append("questionType", questionType);
      if (difficulty) params.append("difficulty", difficulty);
      params.append("limit", questionCount.toString());

      const response = await fetch(
        `/api/practice/questions?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to start practice session");
      }

      // Store practice session data in localStorage for the practice session
      const sessionData = {
        questions: data.questions,
        settings: {
          category,
          questionType,
          difficulty,
          timedMode,
          timeLimit: timedMode ? timeLimit : null,
          questionCount: data.questions.length,
        },
        startedAt: new Date().toISOString(),
      };

      localStorage.setItem("practiceSession", JSON.stringify(sessionData));

      // Navigate to practice session
      window.location.href = "/practice/session";
    } catch (error) {
      toast.error("Failed to start practice session");
      console.log(error);
    }
  };

  // Fetch data when component mounts or category changes
  useEffect(() => {
    fetchSubjects();
    fetchPracticeTests();
  }, [category]);

  // Fetch subjects when search query changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSubjects();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Practice"
        text="Improve your skills with targeted practice."
      />

      <Tabs defaultValue="subject" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="subject">Practice by Subject</TabsTrigger>
          <TabsTrigger value="test">Full Practice Test</TabsTrigger>
        </TabsList>

        <TabsContent value="subject">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Practice Settings</CardTitle>
                <CardDescription>
                  Customize your practice session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amt">AMT</SelectItem>
                      <SelectItem value="hostess">Hostess</SelectItem>
                      <SelectItem value="pilot">Pilot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger id="questionType">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Math</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="mechanical">Mechanical</SelectItem>
                      <SelectItem value="abstract">
                        Abstract Reasoning
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="timed-mode"
                    checked={timedMode}
                    onCheckedChange={setTimedMode}
                  />
                  <Label htmlFor="timed-mode">Timed Mode</Label>
                </div>

                {timedMode && (
                  <div className="space-y-2">
                    <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                    <Input
                      id="time-limit"
                      type="number"
                      min="1"
                      max="120"
                      value={timeLimit}
                      onChange={(e) =>
                        setTimeLimit(parseInt(e.target.value) || 30)
                      }
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="question-count">Number of Questions</Label>
                  <Input
                    id="question-count"
                    type="number"
                    min="5"
                    max="50"
                    value={questionCount}
                    onChange={(e) =>
                      setQuestionCount(parseInt(e.target.value) || 10)
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={startCustomPractice}>
                  Start Practice
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                  <CardTitle>Available Subjects</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search subjects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full md:w-[200px]"
                    />
                  </div>
                </div>
                <CardDescription>
                  Select a subject to practice specific topics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subjectsError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{subjectsError}</AlertDescription>
                  </Alert>
                )}

                {isLoadingSubjects ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading subjects...</span>
                  </div>
                ) : subjects.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No subjects found for the selected category.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {subjects.map((subject) => (
                      <Card key={subject.id} className="overflow-hidden">
                        <div className="bg-primary h-1.5"></div>
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">
                              {subject.name}
                            </CardTitle>
                            <Badge variant="outline" className="ml-2 shrink-0">
                              {subject.questionCount} Q
                            </Badge>
                          </div>
                          <CardDescription className="text-sm">
                            {subject.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center text-sm text-muted-foreground space-x-4">
                            <div className="flex items-center">
                              <Tag className="mr-1 h-3.5 w-3.5" />
                              <span className="capitalize">{subject.type}</span>
                            </div>
                            <div className="flex items-center">
                              <Settings className="mr-1 h-3.5 w-3.5" />
                              <span className="capitalize">
                                {subject.difficulty}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button asChild variant="ghost" className="w-full">
                            <Link href={`/practice/${subject.id}`}>
                              Start Practice
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="test">
          {testsError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{testsError}</AlertDescription>
            </Alert>
          )}

          {isLoadingTests ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading practice tests...</span>
            </div>
          ) : practiceTests.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No practice tests available for the selected category.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {practiceTests.map((test) => (
                <Card key={test.id} className="overflow-hidden">
                  <div
                    className={`h-1.5 ${
                      test.difficulty === "easy"
                        ? "bg-green-500"
                        : test.difficulty === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <FileText className="mr-1 h-4 w-4" />
                          <span>{test.questions} questions</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{test.timeLimit} minutes</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Question Types
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {test.questionTypes.map((type) => (
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
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Folder className="mr-1 h-4 w-4" />
                      <span className="capitalize">{test.category}</span>
                    </div>
                    <Button asChild>
                      <Link href={`/practice/test/${test.id}`}>Start Test</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
