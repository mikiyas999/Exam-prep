import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { questions, userProgress } from "@/db/schema";
import { db } from "@/db/drizzle";

const submitPracticeSchema = z.object({
  sessionId: z.string(),
  answers: z.record(z.string(), z.string()), // questionId -> selectedAnswer
  timeSpent: z.number().optional(), // in seconds
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, answers, timeSpent } = submitPracticeSchema.parse(body);

    const userId =
      typeof session.user.id === "string"
        ? parseInt(session.user.id)
        : session.user.id;
    const questionIds = Object.keys(answers).map((id) => parseInt(id));

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

    return NextResponse.json({
      message: "Practice session submitted successfully",
      results: {
        sessionId,
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

    console.error("Submit practice session error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
