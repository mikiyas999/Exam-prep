import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { questions } from "@/lib/db/schema";
import { z } from "zod";

const bulkQuestionSchema = z.object({
  questions: z.array(z.object({
    questionText: z.string().min(5, "Question text must be at least 5 characters"),
    optionA: z.string().min(1, "Option A is required"),
    optionB: z.string().min(1, "Option B is required"),
    optionC: z.string().min(1, "Option C is required"),
    correctAnswer: z.enum(["A", "B", "C"]),
    explanation: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
    questionType: z.enum(["math", "reading", "mechanical", "abstract"]),
    category: z.enum(["pilot", "hostess", "amt"]),
    difficulty: z.enum(["easy", "medium", "hard"]),
  })).min(1, "At least one question is required"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { questions: questionsData } = bulkQuestionSchema.parse(body);

    const formattedQuestions = questionsData.map((q) => ({
      questionText: q.questionText,
      options: [q.optionA, q.optionB, q.optionC],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      imageUrl: q.imageUrl || null,
      questionType: q.questionType,
      category: q.category,
      difficulty: q.difficulty,
      createdBy: parseInt(session.user.id),
    }));

    const createdQuestions = await db
      .insert(questions)
      .values(formattedQuestions)
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: `${createdQuestions.length} questions created successfully`,
        questions: createdQuestions,
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

    console.error("Bulk create questions error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}