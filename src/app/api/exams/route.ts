import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";
import { examQuestions, exams, questions } from "@/db/schema";
import { db } from "@/db/drizzle";
import { Category } from "@/db/types";

const createExamSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category: z.enum(["pilot", "hostess", "amt"]),
  questionTypes: z
    .array(z.enum(["math", "reading", "mechanical", "abstract"]))
    .optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  timeLimit: z.number().min(1).max(300).optional(), // in minutes
  questionIds: z.array(z.number()).min(1, "At least one question is required"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Build where conditions
    const conditions = [];

    if (category) {
      conditions.push(eq(exams.category, category as Category));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const examsList = await db
      .select({
        id: exams.id,
        title: exams.title,
        description: exams.description,
        category: exams.category,
        questionTypes: exams.questionTypes,
        difficulty: exams.difficulty,
        timeLimit: exams.timeLimit,
        createdAt: exams.createdAt,
      })
      .from(exams)
      .where(whereClause)
      .orderBy(desc(exams.createdAt));

    // Get question count for each exam
    const examsWithQuestionCount = await Promise.all(
      examsList.map(async (exam) => {
        const questionCount = await db
          .select({ count: examQuestions.id })
          .from(examQuestions)
          .where(eq(examQuestions.examId, exam.id));

        return {
          ...exam,
          questionCount: questionCount.length,
        };
      })
    );

    return NextResponse.json({
      exams: examsWithQuestionCount,
    });
  } catch (error) {
    console.error("Get exams error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      questionTypes,
      difficulty,
      timeLimit,
      questionIds,
    } = createExamSchema.parse(body);

    // Verify all questions exist

    const allQuestions = await Promise.all(
      questionIds.map(async (id) => {
        const result = await db
          .select({ id: questions.id })
          .from(questions)
          .where(eq(questions.id, id))
          .limit(1);
        return result[0];
      })
    );

    const validQuestionIds = allQuestions
      .filter((q) => q !== undefined)
      .map((q) => q!.id);

    if (validQuestionIds.length !== questionIds.length) {
      return NextResponse.json(
        { message: "Some questions do not exist" },
        { status: 400 }
      );
    }

    // Create exam
    const newExam = await db
      .insert(exams)
      .values({
        title,
        description,
        category,
        questionTypes,
        difficulty,
        timeLimit,
      })
      .returning();

    // Add questions to exam
    const examQuestionEntries = questionIds.map((questionId, index) => ({
      examId: newExam[0].id,
      questionId,
      order: index + 1,
    }));

    await db.insert(examQuestions).values(examQuestionEntries);

    return NextResponse.json(
      {
        message: "Exam created successfully",
        exam: {
          ...newExam[0],
          questionCount: questionIds.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Create exam error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
