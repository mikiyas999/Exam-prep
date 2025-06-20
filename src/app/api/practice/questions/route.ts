import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { questions } from "@/db/schema";
import { Category, difficulty, questionType } from "@/db/types";

const querySchema = z.object({
  category: z.enum(["pilot", "hostess", "amt"]),
  questionType: z
    .enum(["math", "reading", "mechanical", "abstract"])
    .optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      category: searchParams.get("category") as Category,
      questionType:
        (searchParams.get("questionType") as questionType) || undefined,
      difficulty: (searchParams.get("difficulty") as difficulty) || undefined,
      limit: searchParams.get("limit") || "10",
    });

    // Build where conditions
    const conditions = [eq(questions.category, query.category)];

    if (query.questionType) {
      conditions.push(eq(questions.questionType, query.questionType));
    }

    if (query.difficulty) {
      conditions.push(eq(questions.difficulty, query.difficulty));
    }

    const whereClause = and(...conditions);
    const limit = Math.min(query.limit || 10, 50); // Max 50 questions

    // Get random questions
    const practiceQuestions = await db
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
      })
      .from(questions)
      .where(whereClause)
      .orderBy(sql`RANDOM()`)
      .limit(limit);

    if (practiceQuestions.length === 0) {
      return NextResponse.json(
        { message: "No questions found matching the criteria" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      questions: practiceQuestions,
      total: practiceQuestions.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid query parameters", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Get practice questions error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
