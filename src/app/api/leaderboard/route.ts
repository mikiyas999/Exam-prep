import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, and, desc, count, sql } from "drizzle-orm";
import { questions, userProgress, users } from "@/db/schema";
import { db } from "@/db/drizzle";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build conditions for filtering
    const conditions = [];

    if (category) {
      conditions.push(eq(questions.category, category as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get leaderboard data
    const leaderboardData = await db
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
      .having(sql`COUNT(${userProgress.id}) >= 5`) // Minimum 5 attempts to appear on leaderboard
      .orderBy(
        desc(sql`AVG(CASE WHEN ${userProgress.isCorrect} THEN 100 ELSE 0 END)`)
      )
      .limit(limit);

    // Add rank to each user
    const leaderboard = leaderboardData.map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      userName: user.userName,
      totalAttempts: user.totalAttempts,
      correctAnswers: user.correctAnswers,
      averageScore: user.averageScore,
      accuracy:
        user.totalAttempts > 0
          ? Math.round((user.correctAnswers / user.totalAttempts) * 100)
          : 0,
    }));

    // Get current user's position if not in top results
    const currentUserId = parseInt(session.user.id);
    const currentUserInTop = leaderboard.find(
      (user) => user.userId === currentUserId
    );

    let currentUserRank = null;
    if (!currentUserInTop) {
      // Find current user's rank
      const allUsers = await db
        .select({
          userId: users.id,
          averageScore: sql<number>`ROUND(AVG(CASE WHEN ${userProgress.isCorrect} THEN 100 ELSE 0 END), 2)`,
        })
        .from(userProgress)
        .leftJoin(questions, eq(userProgress.questionId, questions.id))
        .leftJoin(users, eq(userProgress.userId, users.id))
        .where(whereClause)
        .groupBy(users.id)
        .having(sql`COUNT(${userProgress.id}) >= 5`)
        .orderBy(
          desc(
            sql`AVG(CASE WHEN ${userProgress.isCorrect} THEN 100 ELSE 0 END)`
          )
        );

      const userIndex = allUsers.findIndex(
        (user) => user.userId === currentUserId
      );
      if (userIndex !== -1) {
        currentUserRank = userIndex + 1;
      }
    }

    return NextResponse.json({
      leaderboard,
      currentUserRank: currentUserInTop
        ? currentUserInTop.rank
        : currentUserRank,
      category: category || "all",
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
