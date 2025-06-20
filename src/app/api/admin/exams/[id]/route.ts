import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { examQuestions, exams } from "@/db/schema";
import { db } from "@/db/drizzle";

const updateExamSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().optional(),
  category: z.enum(["pilot", "hostess", "amt"]).optional(),
  questionTypes: z
    .array(z.enum(["math", "reading", "mechanical", "abstract"]))
    .optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  timeLimit: z.number().min(1).max(300).optional(),
  questionIds: z.array(z.number()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const examId = parseInt(params.id);
    if (isNaN(examId)) {
      return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 });
    }

    // Get exam details
    const exam = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!exam[0]) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    // Get exam questions
    const examQuestionsData = await db
      .select({
        questionId: examQuestions.questionId,
        order: examQuestions.order,
      })
      .from(examQuestions)
      .where(eq(examQuestions.examId, examId))
      .orderBy(examQuestions.order);

    return NextResponse.json({
      success: true,
      exam: {
        ...exam[0],
        questionIds: examQuestionsData.map((eq) => eq.questionId),
      },
    });
  } catch (error) {
    console.error("Get exam error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const examId = parseInt(params.id);
    if (isNaN(examId)) {
      return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 });
    }

    const body = await request.json();
    const { questionIds, ...examData } = updateExamSchema.parse(body);

    // Check if exam exists
    const existingExam = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!existingExam[0]) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    // Update exam
    const updatedExam = await db
      .update(exams)
      .set({
        ...examData,
        updatedAt: new Date(),
      })
      .where(eq(exams.id, examId))
      .returning();

    // Update questions if provided
    if (questionIds) {
      // Delete existing exam questions
      await db.delete(examQuestions).where(eq(examQuestions.examId, examId));

      // Add new questions
      if (questionIds.length > 0) {
        const examQuestionEntries = questionIds.map((questionId, index) => ({
          examId,
          questionId,
          order: index + 1,
        }));

        await db.insert(examQuestions).values(examQuestionEntries);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Exam updated successfully",
      exam: updatedExam[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Update exam error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const examId = parseInt(params.id);
    if (isNaN(examId)) {
      return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 });
    }

    // Check if exam exists
    const existingExam = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!existingExam[0]) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    // Delete exam questions first
    await db.delete(examQuestions).where(eq(examQuestions.examId, examId));

    // Delete exam
    await db.delete(exams).where(eq(exams.id, examId));

    return NextResponse.json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("Delete exam error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
