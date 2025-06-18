import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { questions } from "@/db/schema";
import { db } from "@/db/drizzle";

const practiceSessionSchema = z.object({
  category: z.enum(["pilot", "hostess", "amt"]),
  questionType: z
    .enum(["math", "reading", "mechanical", "abstract"])
    .optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  questionCount: z.number().min(5).max(50).default(10),
  timedMode: z.boolean().default(false),
  timeLimit: z.number().min(1).max(120).optional(), // in minutes
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      category,
      questionType,
      difficulty,
      questionCount,
      timedMode,
      timeLimit,
    } = practiceSessionSchema.parse(body);

    // Build where conditions
    const conditions = [eq(questions.category, category)];

    if (questionType) {
      conditions.push(eq(questions.questionType, questionType));
    }

    if (difficulty) {
      conditions.push(eq(questions.difficulty, difficulty));
    }

    const whereClause = and(...conditions);

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
      .limit(questionCount);

    if (practiceQuestions.length === 0) {
      return NextResponse.json(
        { message: "No questions found matching the criteria" },
        { status: 404 }
      );
    }

    // Create practice session data
    const sessionData = {
      sessionId: `practice_${Date.now()}_${session.user.id}`,
      questions: practiceQuestions,
      settings: {
        category,
        questionType,
        difficulty,
        questionCount: practiceQuestions.length,
        timedMode,
        timeLimit: timedMode ? timeLimit : null,
      },
      startedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: "Practice session created successfully",
      session: sessionData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Create practice session error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
