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
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function QuestionsPage() {
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
              <Input placeholder="Search questions..." className="w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:flex lg:items-center lg:space-x-2">
              <Select>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="amt">AMT</SelectItem>
                  <SelectItem value="hostess">Hostess</SelectItem>
                  <SelectItem value="pilot">Pilot</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Question Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="math">Math</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="abstract">Abstract Reasoning</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 rounded-md border overflow-x-auto">
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
                      <div className="max-w-xs truncate" title={question.text}>
                        {question.text}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {question.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {question.type}
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
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Showing 10 of 42 questions
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </DashboardShell>
  );
}

const questions = [
  {
    id: 1,
    text: "Find 32% of 897",
    category: "amt",
    type: "math",
    difficulty: "medium",
  },
  {
    id: 2,
    text: "75 is what percent of 6,200?",
    category: "amt",
    type: "math",
    difficulty: "medium",
  },
  {
    id: 3,
    text: "350 is 35% of what?",
    category: "amt",
    type: "math",
    difficulty: "medium",
  },
  {
    id: 4,
    text: "The sum of +24 +(-19) + (+8) + (+7) + (-13) equals",
    category: "amt",
    type: "math",
    difficulty: "easy",
  },
  {
    id: 5,
    text: "Express 7/8 as a percent",
    category: "amt",
    type: "math",
    difficulty: "easy",
  },
  {
    id: 6,
    text: "The square root of 96 equals",
    category: "amt",
    type: "math",
    difficulty: "medium",
  },
  {
    id: 7,
    text: "Convert the scientific notation (8.56 X 106) into ordinary number",
    category: "amt",
    type: "math",
    difficulty: "medium",
  },
  {
    id: 8,
    text: "For the gear mechanism shown, if Y moves left at constant speed, which direction and at what speed does X move in relation to Y?",
    category: "amt",
    type: "mechanical",
    difficulty: "hard",
  },
  {
    id: 9,
    text: "From paragraph 1, Service delivery efficiency has reduced companies' will to franchise.",
    category: "hostess",
    type: "reading",
    difficulty: "medium",
  },
  {
    id: 10,
    text: "From paragraph 2, supervisors should monitor employees' e-mail accounts to minimize the leak of exclusive information",
    category: "hostess",
    type: "reading",
    difficulty: "medium",
  },
];
