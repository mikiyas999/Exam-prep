import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, and, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { exams, userExamAttempts, users } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl;
    const idParam = url.pathname.split("/").pop();
    const attemptId = parseInt(idParam ?? "");

    if (isNaN(attemptId)) {
      return NextResponse.json(
        { message: "Invalid attempt ID" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Get exam attempt details
    const examAttempt = await db
      .select({
        id: userExamAttempts.id,
        score: userExamAttempts.score,
        completedAt: userExamAttempts.completedAt,
        examTitle: exams.title,
        examCategory: exams.category,
        examDifficulty: exams.difficulty,
        userName: users.name,
        userEmail: users.email,
      })
      .from(userExamAttempts)
      .leftJoin(exams, eq(userExamAttempts.examId, exams.id))
      .leftJoin(users, eq(userExamAttempts.userId, users.id))
      .where(
        and(
          eq(userExamAttempts.id, attemptId),
          eq(userExamAttempts.userId, userId),
          sql`${userExamAttempts.completedAt} IS NOT NULL`
        )
      )
      .limit(1);

    if (!examAttempt[0]) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    const attempt = examAttempt[0];

    // Generate certificate data
    const certificate = {
      id: attempt.id,
      examTitle: attempt.examTitle,
      examCategory: attempt.examCategory,
      examDifficulty: attempt.examDifficulty,
      studentName: attempt.userName,
      studentEmail: attempt.userEmail,
      score: attempt.score,
      completedAt: attempt.completedAt,
      certificateNumber: `ET-${attempt.id.toString().padStart(8, "0")}`,
      grade: getGrade(attempt.score || 0),
      issuedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error("Get certificate error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function getGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  return "F";
}
