import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { questions } from "@/db/schema";
import { eq, and, like, desc, count } from "drizzle-orm";
import { z } from "zod";

// Validation schema for creating a question
const createQuestionSchema = z.object({
  questionText: z
    .string()
    .min(5, "Question text must be at least 5 characters"),
  optionA: z.string().min(1, "Option A is required"),
  optionB: z.string().min(1, "Option B is required"),
  optionC: z.string().min(1, "Option C is required"),
  correctAnswer: z.enum(["A", "B", "C"], {
    required_error: "Please select the correct answer",
  }),
  explanation: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  questionType: z.enum(["math", "reading", "mechanical", "abstract"], {
    required_error: "Please select a question type",
  }),
  category: z.enum(["pilot", "hostess", "amt"], {
    required_error: "Please select a category",
  }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Please select a difficulty level",
  }),
});

// Validation schema for query filters
const querySchema = z.object({
  category: z.enum(["pilot", "hostess", "amt"]).optional(),
  questionType: z
    .enum(["math", "reading", "mechanical", "abstract"])
    .optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

// GET /api/questions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      category: searchParams.get("category") || undefined,
      questionType: searchParams.get("questionType") || undefined,
      difficulty: searchParams.get("difficulty") || undefined,
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
    });

    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.category) {
      conditions.push(eq(questions.category, query.category));
    }

    if (query.questionType) {
      conditions.push(eq(questions.questionType, query.questionType));
    }

    if (query.difficulty) {
      conditions.push(eq(questions.difficulty, query.difficulty));
    }

    if (query.search) {
      conditions.push(like(questions.questionText, `%${query.search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const questionsList = await db
      .select({
        id: questions.id,
        questionText: questions.questionText,
        options: questions.options,
        correctAnswer: questions.correctAnswer,
        explanation: questions.explanation,
        imageUrl: questions.imageUrl,
        questionType: questions.questionType,
        category: questions.category,
        difficulty: questions.difficulty,
        createdAt: questions.createdAt,
      })
      .from(questions)
      .where(whereClause)
      .orderBy(desc(questions.createdAt))
      .limit(limit)
      .offset(offset);

    const totalCountResult = await db
      .select({ count: count() })
      .from(questions)
      .where(whereClause);

    const totalCount = totalCountResult[0]?.count || 0;

    return NextResponse.json({
      success: true,
      questions: questionsList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Get questions error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/questions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      questionText,
      optionA,
      optionB,
      optionC,
      correctAnswer,
      explanation,
      questionType,
      category,
      difficulty,
      imageUrl,
    } = createQuestionSchema.parse(body);

    const options = [optionA, optionB, optionC];

    const newQuestion = await db
      .insert(questions)
      .values({
        questionText,
        options,
        correctAnswer,
        explanation,
        questionType,
        category,
        difficulty,
        imageUrl: imageUrl || null,
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Question created successfully",
        question: newQuestion[0],
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

    console.error("Create question error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
