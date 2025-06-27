import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, count, sql, desc, and, gte } from "drizzle-orm";
import {
  exams,
  questions,
  userExamAttempts,
  userProgress,
  users,
} from "@/db/schema";
import { db } from "@/db/drizzle";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "week";
    const userId = session.user.id;

    // Calculate date filter
    let dateFilter;
    const now = new Date();
    if (timeframe === "week") {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === "month") {
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get overview statistics
    const [
      totalPracticeAttempts,
      totalExamsCompleted,
      userProgressStats,
      examStats,
      totalUsers,
      userRank,
    ] = await Promise.all([
      // Total practice attempts
      db
        .select({ count: count() })
        .from(userProgress)
        .where(eq(userProgress.userId, userId)),

      // Total exams completed
      db
        .select({ count: count() })
        .from(userExamAttempts)
        .where(
          and(
            eq(userExamAttempts.userId, userId),
            sql`${userExamAttempts.completedAt} IS NOT NULL`
          )
        ),

      // User progress statistics
      db
        .select({
          totalAttempts: count(userProgress.id),
          correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
        })
        .from(userProgress)
        .where(eq(userProgress.userId, userId)),

      // Exam statistics
      db
        .select({
          averageScore: sql<number>`AVG(${userExamAttempts.score})`,
          bestScore: sql<number>`MAX(${userExamAttempts.score})`,
        })
        .from(userExamAttempts)
        .where(
          and(
            eq(userExamAttempts.userId, userId),
            sql`${userExamAttempts.completedAt} IS NOT NULL`
          )
        ),

      // Total users for ranking
      db.select({ count: count() }).from(users),

      // User rank (simplified calculation)
      db.select({ count: count() }).from(userExamAttempts)
        .where(sql`${userExamAttempts.score} > (
          SELECT AVG(score) FROM user_exam_attempts 
          WHERE user_id = ${userId} AND completed_at IS NOT NULL
        )`),
    ]);

    // Calculate overview metrics
    const practiceCount = totalPracticeAttempts[0]?.count || 0;
    const examCount = totalExamsCompleted[0]?.count || 0;
    const progressStats = userProgressStats[0];
    const examStatsData = examStats[0];

    const averageScore =
      progressStats?.totalAttempts > 0
        ? Math.round(
            (progressStats.correctAnswers / progressStats.totalAttempts) * 100
          )
        : 0;

    const examAverageScore = Math.round(examStatsData?.averageScore || 0);
    const bestScore = examStatsData?.bestScore || 0;
    const rank = Math.max(
      1,
      (totalUsers[0]?.count || 1) - (userRank[0]?.count || 0)
    );

    // Get recent activity
    const recentActivity = await Promise.all([
      // Recent practice sessions
      db
        .select({
          id: userProgress.id,
          type: sql<string>`'practice'`,
          questionId: userProgress.questionId,
          isCorrect: userProgress.isCorrect,
          attemptedAt: userProgress.attemptedAt,
          questionText: questions.questionText,
          category: questions.category,
          questionType: questions.questionType,
        })
        .from(userProgress)
        .leftJoin(questions, eq(userProgress.questionId, questions.id))
        .where(eq(userProgress.userId, userId))
        .orderBy(desc(userProgress.attemptedAt))
        .limit(5),

      // Recent exam attempts
      db
        .select({
          id: userExamAttempts.id,
          type: sql<string>`'exam'`,
          examId: userExamAttempts.examId,
          score: userExamAttempts.score,
          completedAt: userExamAttempts.completedAt,
          examTitle: exams.title,
          examCategory: exams.category,
        })
        .from(userExamAttempts)
        .leftJoin(exams, eq(userExamAttempts.examId, exams.id))
        .where(
          and(
            eq(userExamAttempts.userId, userId),
            sql`${userExamAttempts.completedAt} IS NOT NULL`
          )
        )
        .orderBy(desc(userExamAttempts.completedAt))
        .limit(3),
    ]);

    // Format recent activity
    const formattedActivity = [
      ...recentActivity[0].map((item) => ({
        id: item.id,
        type: "practice" as const,
        title: `Practice: ${item.questionType}`,
        description: `${item.category?.toUpperCase()} question`,
        score: item.isCorrect ? 100 : 0,
        timestamp: item.attemptedAt.toISOString(),
        category: item.category,
      })),
      ...recentActivity[1].map((item) => ({
        id: item.id,
        type: "exam" as const,
        title: item.examTitle || "Exam",
        description: `${item.examCategory?.toUpperCase()} exam completed`,
        score: item.score || 0,
        timestamp: item.completedAt?.toISOString() || new Date().toISOString(),
        category: item.examCategory,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 8);

    // Get weekly progress
    const weeklyProgress = await db
      .select({
        day: sql<string>`TO_CHAR(${userProgress.attemptedAt}, 'Day')`,
        date: sql<string>`DATE(${userProgress.attemptedAt})`,
        attempts: count(userProgress.id),
        correct: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
      })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          gte(
            userProgress.attemptedAt,
            new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          )
        )
      )
      .groupBy(
        sql`DATE(${userProgress.attemptedAt})`,
        sql`TO_CHAR(${userProgress.attemptedAt}, 'Day')`
      )
      .orderBy(sql`DATE(${userProgress.attemptedAt})`);

    // Get category breakdown
    const categoryBreakdown = await db
      .select({
        category: questions.category,
        attempts: count(userProgress.id),
        correct: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
      })
      .from(userProgress)
      .leftJoin(questions, eq(userProgress.questionId, questions.id))
      .where(eq(userProgress.userId, userId))
      .groupBy(questions.category);

    // Get available exams
    const upcomingExams = await db
      .select({
        id: exams.id,
        title: exams.title,
        category: exams.category,
        difficulty: exams.difficulty,
        timeLimit: exams.timeLimit,
        questionCount: sql<number>`(
        SELECT COUNT(*) FROM exam_questions 
        WHERE exam_id = ${exams.id}
      )`,
      })
      .from(exams)
      .orderBy(desc(exams.createdAt))
      .limit(5);

    // Mock achievements and recommendations
    const achievements = [
      {
        id: 1,
        title: "First Steps",
        description: "Completed your first practice session",
        icon: "🎯",
        unlockedAt: new Date().toISOString(),
        rarity: "common" as const,
      },
      {
        id: 2,
        title: "Quick Learner",
        description: "Scored 80% or higher on 5 consecutive questions",
        icon: "⚡",
        unlockedAt: new Date().toISOString(),
        rarity: "rare" as const,
      },
    ];

    const recommendations = [
      {
        type: "practice" as const,
        title: "Focus on Mathematics",
        description:
          "Your math scores could use improvement. Practice more math questions.",
        action: "Practice Now",
        href: "/practice?type=math",
      },
      {
        type: "exam" as const,
        title: "Take a Mock Exam",
        description: "You're ready for a full exam simulation.",
        action: "Start Exam",
        href: "/exams",
      },
    ];

    return NextResponse.json({
      overview: {
        totalPracticeAttempts: practiceCount,
        totalExamsCompleted: examCount,
        averageScore: Math.max(averageScore, examAverageScore),
        bestScore,
        currentStreak: 5, // Mock data
        totalStudyTime: practiceCount * 2 + examCount * 60, // Estimated minutes
        rank,
        totalUsers: totalUsers[0]?.count || 1,
      },
      recentActivity: formattedActivity,
      performance: {
        weeklyProgress: weeklyProgress.map((day) => ({
          day: day.day,
          score:
            day.attempts > 0
              ? Math.round((day.correct / day.attempts) * 100)
              : 0,
          attempts: day.attempts,
        })),
        categoryBreakdown: categoryBreakdown.map((cat, index) => ({
          category: cat.category || "unknown",
          score:
            cat.attempts > 0
              ? Math.round((cat.correct / cat.attempts) * 100)
              : 0,
          attempts: cat.attempts,
          color: ["#0088FE", "#00C49F", "#FFBB28"][index] || "#8884D8",
        })),
      },
      upcomingExams: upcomingExams.map((exam) => ({
        id: exam.id,
        title: exam.title,
        category: exam.category,
        difficulty: exam.difficulty || "medium",
        questionCount: exam.questionCount || 0,
        timeLimit: exam.timeLimit || 60,
      })),
      achievements,
      recommendations,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
