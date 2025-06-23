import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { questions, userExamAttempts, userProgress } from "@/db/schema";

const submitExamSchema = z.object({
  answers: z.record(z.string(), z.string()), // questionId -> selectedAnswer
  timeSpent: z.number().optional(), // in seconds
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const path = request.nextUrl.pathname; // "/api/exams/3/submit"
    const parts = path.split("/"); // ["", "api", "exams", "3", "submit"]
    const examId = parseInt(parts[3]); // 3
    // 3

    console.log(examId);
    if (isNaN(examId)) {
      return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 });
    }

    const body = await request.json();
    const { answers, timeSpent } = submitExamSchema.parse(body);

    const userId =
      typeof session.user.id === "string"
        ? parseInt(session.user.id)
        : session.user.id;
    const questionIds = Object.keys(answers).map((id) => parseInt(id));

    // Get the correct answers for all questions
    const allQuestionsData = await Promise.all(
      questionIds.map(async (id) => {
        const result = await db
          .select({
            id: questions.id,
            correctAnswer: questions.correctAnswer,
            questionText: questions.questionText,
            explanation: questions.explanation,
          })
          .from(questions)
          .where(eq(questions.id, id))
          .limit(1);
        return result[0];
      })
    );

    // Calculate results and save progress
    const results = [];
    const progressEntries = [];

    for (const question of allQuestionsData) {
      if (!question) continue;

      const userAnswer = answers[question.id.toString()];

      const isCorrect = userAnswer === question.correctAnswer;

      results.push({
        questionId: question.id,
        questionText: question.questionText,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      });

      progressEntries.push({
        userId,
        questionId: question.id,
        isCorrect,
      });
    }

    // Save user progress
    if (progressEntries.length > 0) {
      await db.insert(userProgress).values(progressEntries);
    }

    // Calculate score
    const correctAnswers = results.filter((r) => r.isCorrect).length;
    const totalQuestions = results.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Save exam attempt
    const examAttempt = await db
      .insert(userExamAttempts)
      .values({
        userId,
        examId,
        score: scorePercentage,
        completedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      message: "Exam submitted successfully",
      results: {
        attemptId: examAttempt[0].id,
        score: {
          correct: correctAnswers,
          total: totalQuestions,
          percentage: scorePercentage,
        },
        timeSpent,
        questions: results,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Submit exam error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
