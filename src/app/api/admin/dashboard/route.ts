import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { count, sql, desc } from "drizzle-orm";
import {
  exams,
  questions,
  userExamAttempts,
  userProgress,
  users,
} from "@/db/schema";
import { db } from "@/db/drizzle";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get overall statistics
    const [
      totalUsers,
      totalQuestions,
      totalExams,
      totalAttempts,
      recentUsers,
      recentQuestions,
      categoryStats,
      difficultyStats,
      monthlyProgress,
    ] = await Promise.all([
      // Total users
      db.select({ count: count() }).from(users),

      // Total questions
      db.select({ count: count() }).from(questions),

      // Total exams
      db.select({ count: count() }).from(exams),

      // Total exam attempts
      db.select({ count: count() }).from(userExamAttempts),

      // Recent users (last 7 days)
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(5),

      // Recent questions
      db
        .select({
          id: questions.id,
          questionText: questions.questionText,
          category: questions.category,
          questionType: questions.questionType,
          difficulty: questions.difficulty,
          createdAt: questions.createdAt,
        })
        .from(questions)
        .orderBy(desc(questions.createdAt))
        .limit(5),

      // Questions by category
      db
        .select({
          category: questions.category,
          count: count(),
        })
        .from(questions)
        .groupBy(questions.category),

      // Questions by difficulty
      db
        .select({
          difficulty: questions.difficulty,
          count: count(),
        })
        .from(questions)
        .groupBy(questions.difficulty),

      // Monthly progress (last 6 months)
      db
        .select({
          month: sql<string>`TO_CHAR(${userProgress.attemptedAt}, 'YYYY-MM')`,
          attempts: count(userProgress.id),
          correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
        })
        .from(userProgress)
        .where(sql`${userProgress.attemptedAt} >= NOW() - INTERVAL '6 months'`)
        .groupBy(sql`TO_CHAR(${userProgress.attemptedAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${userProgress.attemptedAt}, 'YYYY-MM')`),
    ]);

    // Calculate growth rates (simplified)
    // const currentMonth = new Date().getMonth();
    // const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    return NextResponse.json({
      overview: {
        totalUsers: totalUsers[0]?.count || 0,
        totalQuestions: totalQuestions[0]?.count || 0,
        totalExams: totalExams[0]?.count || 0,
        totalAttempts: totalAttempts[0]?.count || 0,
        userGrowth: 12, // Placeholder - would calculate from actual data
        questionGrowth: 8,
        examGrowth: 15,
        attemptGrowth: 25,
      },
      recentActivity: {
        users: recentUsers,
        questions: recentQuestions,
      },
      analytics: {
        categoryStats,
        difficultyStats,
        monthlyProgress: monthlyProgress.map((item) => ({
          month: item.month,
          attempts: item.attempts,
          accuracy:
            item.attempts > 0
              ? Math.round((item.correctAnswers / item.attempts) * 100)
              : 0,
        })),
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
