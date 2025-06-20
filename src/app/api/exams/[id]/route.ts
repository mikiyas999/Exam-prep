import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { examQuestions, exams, questions } from "@/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
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

    // Get exam questions with question details
    const examQuestionsData = await db
      .select({
        questionId: examQuestions.questionId,
        order: examQuestions.order,
        questionText: questions.questionText,
        options: questions.options,
        correctAnswer: questions.correctAnswer,
        explanation: questions.explanation,
        imageUrl: questions.imageUrl,
        questionType: questions.questionType,
        difficulty: questions.difficulty,
      })
      .from(examQuestions)
      .leftJoin(questions, eq(examQuestions.questionId, questions.id))
      .where(eq(examQuestions.examId, examId))
      .orderBy(examQuestions.order);

    return NextResponse.json({
      exam: exam[0],
      questions: examQuestionsData,
    });
  } catch (error) {
    console.error("Get exam error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
