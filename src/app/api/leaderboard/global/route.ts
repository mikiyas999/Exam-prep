import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, and, desc, count, sql, avg } from "drizzle-orm";
import { questions, userExamAttempts, userProgress, users } from "@/db/schema";
import { db } from "@/db/drizzle";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type") || "practice"; // practice, exam, overall
    const limit = parseInt(searchParams.get("limit") || "20");

    let leaderboardData;

    if (type === "exam") {
      // Exam-based leaderboard
      const conditions = [sql`${userExamAttempts.completedAt} IS NOT NULL`];

      leaderboardData = await db
        .select({
          userId: users.id,
          userName: users.name,
          totalExams: count(userExamAttempts.id),
          averageScore: avg(userExamAttempts.score),
          bestScore: sql<number>`MAX(${userExamAttempts.score})`,
        })
        .from(userExamAttempts)
        .leftJoin(users, eq(userExamAttempts.userId, users.id))
        .where(and(...conditions))
        .groupBy(users.id, users.name)
        .having(sql`COUNT(${userExamAttempts.id}) >= 1`)
        .orderBy(desc(avg(userExamAttempts.score)))
        .limit(limit);
    } else {
      // Practice-based leaderboard
      const conditions = [];

      if (category) {
        conditions.push(eq(questions.category, category as any));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      leaderboardData = await db
        .select({
          userId: users.id,
          userName: users.name,
          totalAttempts: count(userProgress.id),
          correctAnswers: sql<number>`SUM(CASE WHEN ${userProgress.isCorrect} THEN 1 ELSE 0 END)`,
          averageScore: sql<number>`ROUND(AVG(CASE WHEN ${userProgress.isCorrect} THEN 100 ELSE 0 END), 2)`,
        })
        .from(userProgress)
        .leftJoin(questions, eq(userProgress.questionId, questions.id))
        .leftJoin(users, eq(userProgress.userId, users.id))
        .where(whereClause)
        .groupBy(users.id, users.name)
        .having(sql`COUNT(${userProgress.id}) >= 10`) // Minimum 10 attempts
        .orderBy(
          desc(
            sql`AVG(CASE WHEN ${userProgress.isCorrect} THEN 100 ELSE 0 END)`
          )
        )
        .limit(limit);
    }

    // Add rank and format data
    const leaderboard = leaderboardData.map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      userName: user.userName,
      ...(type === "exam"
        ? {
            totalExams: user.totalExams,
            averageScore: Math.round(user.averageScore || 0),
            bestScore: user.bestScore || 0,
          }
        : {
            totalAttempts: user.totalAttempts,
            correctAnswers: user.correctAnswers,
            averageScore: user.averageScore,
            accuracy:
              user.totalAttempts > 0
                ? Math.round((user.correctAnswers / user.totalAttempts) * 100)
                : 0,
          }),
    }));

    // Get current user's position if not in top results
    const currentUserId = parseInt(session.user.id);
    const currentUserInTop = leaderboard.find(
      (user) => user.userId === currentUserId
    );

    let currentUserRank = null;
    if (!currentUserInTop) {
      // Find current user's rank (simplified for performance)
      currentUserRank = leaderboard.length + 1; // Placeholder
    }

    return NextResponse.json({
      leaderboard,
      currentUserRank: currentUserInTop
        ? currentUserInTop.rank
        : currentUserRank,
      category: category || "all",
      type,
      totalUsers: leaderboardData.length,
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
