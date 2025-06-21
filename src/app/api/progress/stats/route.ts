import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, and, desc, count, sql, avg } from "drizzle-orm";
import { questions, userExamAttempts, userProgress } from "@/db/schema";
import { db } from "@/db/drizzle";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "all"; // all, week, month

    // Calculate date filter
    let dateFilter;
    const now = new Date();
    if (timeframe === "week") {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === "month") {
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Build conditions
    const progressConditions = [eq(userProgress.userId, userId)];
    const examConditions = [eq(userExamAttempts.userId, userId)];

    if (dateFilter) {
      progressConditions.push(
        sql`${userProgress.attemptedAt} >= ${dateFilter}`
      );
      examConditions.push(
        sql`${userExamAttempts.completedAt} >= ${dateFilter}`
      );
    }

    // Get overall practice statistics
    const practiceStats = await db
      .select({
        totalAttempts: count(userProgress.id),
        correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
      })
      .from(userProgress)
      .leftJoin(questions, eq(userProgress.questionId, questions.id))
      .where(and(...progressConditions));

    // Get exam statistics
    const examStats = await db
      .select({
        totalExams: count(userExamAttempts.id),
        averageScore: avg(userExamAttempts.score),
        bestScore: sql<number>`MAX(${userExamAttempts.score})`,
      })
      .from(userExamAttempts)
      .where(and(...examConditions));

    // Get progress by category
    const categoryStats = await db
      .select({
        category: questions.category,
        totalAttempts: count(userProgress.id),
        correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
      })
      .from(userProgress)
      .leftJoin(questions, eq(userProgress.questionId, questions.id))
      .where(and(...progressConditions))
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
      .where(and(...progressConditions))
      .groupBy(questions.questionType);

    // Get recent exam attempts
    const recentExams = await db
      .select({
        id: userExamAttempts.id,
        examId: userExamAttempts.examId,
        score: userExamAttempts.score,
        completedAt: userExamAttempts.completedAt,
      })
      .from(userExamAttempts)
      .where(eq(userExamAttempts.userId, userId))
      .orderBy(desc(userExamAttempts.completedAt))
      .limit(5);

    // Get daily progress for chart (last 30 days)
    const dailyProgress = await db
      .select({
        date: sql<string>`DATE(${userProgress.attemptedAt})`,
        attempts: count(userProgress.id),
        correct: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
      })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          sql`${userProgress.attemptedAt} >= ${new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
          )}`
        )
      )
      .groupBy(sql`DATE(${userProgress.attemptedAt})`)
      .orderBy(sql`DATE(${userProgress.attemptedAt})`);

    const practice = practiceStats[0];
    const exam = examStats[0];

    const practicePercentage =
      practice.totalAttempts > 0
        ? Math.round((practice.correctAnswers / practice.totalAttempts) * 100)
        : 0;

    return NextResponse.json({
      practice: {
        totalAttempts: practice.totalAttempts,
        correctAnswers: practice.correctAnswers,
        percentage: practicePercentage,
      },
      exams: {
        totalExams: exam.totalExams,
        averageScore: Math.round(exam.averageScore || 0),
        bestScore: exam.bestScore || 0,
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
      recentExams,
      dailyProgress: dailyProgress.map((day) => ({
        date: day.date,
        attempts: day.attempts,
        accuracy:
          day.attempts > 0 ? Math.round((day.correct / day.attempts) * 100) : 0,
      })),
      timeframe,
    });
  } catch (error) {
    console.error("Get progress stats error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
