import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateQuestionSchema = z.object({
  questionText: z
    .string()
    .min(5, "Question text must be at least 5 characters")
    .optional(),
  options: z
    .array(z.string())
    .min(2, "At least 2 options required")
    .max(4, "Maximum 4 options allowed")
    .optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  questionType: z
    .enum(["math", "reading", "mechanical", "abstract"])
    .optional(),
  category: z.enum(["pilot", "hostess", "amt"]).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
});

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl;
    const idParam = url.pathname.split("/").pop();
    const questionId = parseInt(idParam ?? "");

    if (isNaN(questionId)) {
      return NextResponse.json(
        { message: "Invalid question ID" },
        { status: 400 }
      );
    }

    const question = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);

    if (!question[0]) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ question: question[0] });
  } catch (error) {
    console.error("Get question error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const questionId = parseInt(id);
    if (isNaN(questionId)) {
      return NextResponse.json(
        { message: "Invalid question ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateQuestionSchema.parse(body);

    // Check if question exists
    const existingQuestion = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);

    if (!existingQuestion[0]) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    const updatedQuestion = await db
      .update(questions)
      .set({
        ...validatedData,
        imageUrl: validatedData.imageUrl || null,
        updatedAt: new Date(),
      })
      .where(eq(questions.id, questionId))
      .returning();

    return NextResponse.json({
      message: "Question updated successfully",
      question: updatedQuestion[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Update question error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const questionId = parseInt(id);
    if (isNaN(questionId)) {
      return NextResponse.json(
        { message: "Invalid question ID" },
        { status: 400 }
      );
    }

    // Check if question exists
    const existingQuestion = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);

    if (!existingQuestion[0]) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    await db.delete(questions).where(eq(questions.id, questionId));

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Delete question error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
