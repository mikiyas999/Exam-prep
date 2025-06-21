import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, and, desc, count, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { questions, userProgress } from "@/db/schema";
import { Category, questionType } from "@/db/types";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId =
      typeof session.user.id === "string"
        ? parseInt(session.user.id)
        : session.user.id;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const questionType = searchParams.get("questionType");

    // Build conditions for filtering
    const conditions = [eq(userProgress.userId, userId)];

    if (category) {
      conditions.push(eq(questions.category, category as Category));
    }

    if (questionType) {
      conditions.push(eq(questions.questionType, questionType as questionType));
    }

    // Get overall progress statistics
    const overallStats = await db
      .select({
        totalAttempts: count(userProgress.id),
        correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
      })
      .from(userProgress)
      .leftJoin(questions, eq(userProgress.questionId, questions.id))
      .where(and(...conditions));

    // Get progress by category
    const categoryStats = await db
      .select({
        category: questions.category,
        totalAttempts: count(userProgress.id),
        correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
      })
      .from(userProgress)
      .leftJoin(questions, eq(userProgress.questionId, questions.id))
      .where(eq(userProgress.userId, userId))
      .groupBy(questions.category);

    // Get progress by question type
    const typeStats = await db
      .select({
        questionType: questions.questionType,
        totalAttempts: count(userProgress.id),
        correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
      })
      .from(userProgress)
      .leftJoin(questions, eq(userProgress.questionId, questions.id))
      .where(eq(userProgress.userId, userId))
      .groupBy(questions.questionType);

    // Get recent activity
    const recentActivity = await db
      .select({
        id: userProgress.id,
        questionId: userProgress.questionId,
        isCorrect: userProgress.isCorrect,
        attemptedAt: userProgress.attemptedAt,
        questionText: questions.questionText,
        category: questions.category,
        questionType: questions.questionType,
        difficulty: questions.difficulty,
      })
      .from(userProgress)
      .leftJoin(questions, eq(userProgress.questionId, questions.id))
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.attemptedAt))
      .limit(10);

    const overall = overallStats[0];
    const overallPercentage =
      overall.totalAttempts > 0
        ? Math.round((overall.correctAnswers / overall.totalAttempts) * 100)
        : 0;

    return NextResponse.json({
      overall: {
        totalAttempts: overall.totalAttempts,
        correctAnswers: overall.correctAnswers,
        percentage: overallPercentage,
      },
      byCategory: categoryStats.map((stat) => ({
        category: stat.category,
        totalAttempts: stat.totalAttempts,
        correctAnswers: stat.correctAnswers,
        percentage:
          stat.totalAttempts > 0
            ? Math.round((stat.correctAnswers / stat.totalAttempts) * 100)
            : 0,
      })),
      byType: typeStats.map((stat) => ({
        questionType: stat.questionType,
        totalAttempts: stat.totalAttempts,
        correctAnswers: stat.correctAnswers,
        percentage:
          stat.totalAttempts > 0
            ? Math.round((stat.correctAnswers / stat.totalAttempts) * 100)
            : 0,
      })),
      recentActivity,
    });
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
