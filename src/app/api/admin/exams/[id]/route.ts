import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { examQuestions, exams } from "@/db/schema";
import { db } from "@/db/drizzle";

const updateExamSchema = z.object({
  title: z.string().min(3).optional(),
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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const examId = parseInt(id);
    if (isNaN(examId)) {
      return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 });
    }

    const exam = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!exam[0]) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

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
        questionIds: examQuestionsData.map((q) => q.questionId),
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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const examId = parseInt(id);
    if (isNaN(examId)) {
      return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 });
    }

    const body = await request.json();
    const { questionIds, ...examData } = updateExamSchema.parse(body);

    const existingExam = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!existingExam[0]) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    const updatedExam = await db
      .update(exams)
      .set({
        ...examData,
        updatedAt: new Date(),
      })
      .where(eq(exams.id, examId))
      .returning();

    if (questionIds) {
      await db.delete(examQuestions).where(eq(examQuestions.examId, examId));

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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const examId = parseInt(id);
    if (isNaN(examId)) {
      return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 });
    }

    const existingExam = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!existingExam[0]) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 });
    }

    await db.delete(examQuestions).where(eq(examQuestions.examId, examId));
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
