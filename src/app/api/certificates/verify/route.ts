import { NextRequest, NextResponse } from "next/server";

import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { exams, userExamAttempts, users } from "@/db/schema";

const verifySchema = z.object({
  certificateNumber: z.string().min(1, "Certificate number is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { certificateNumber } = verifySchema.parse(body);

    // Extract attempt ID from certificate number (format: ET-00000123)
    const attemptId = parseInt(
      certificateNumber.replace("ET-", "").replace(/^0+/, "")
    );

    if (isNaN(attemptId)) {
      return NextResponse.json(
        { message: "Invalid certificate number format" },
        { status: 400 }
      );
    }

    // Verify certificate exists
    const certificate = await db
      .select({
        id: userExamAttempts.id,
        score: userExamAttempts.score,
        completedAt: userExamAttempts.completedAt,
        examTitle: exams.title,
        examCategory: exams.category,
        examDifficulty: exams.difficulty,
        userName: users.name,
      })
      .from(userExamAttempts)
      .leftJoin(exams, eq(userExamAttempts.examId, exams.id))
      .leftJoin(users, eq(userExamAttempts.userId, users.id))
      .where(
        and(
          eq(userExamAttempts.id, attemptId),
          sql`${userExamAttempts.completedAt} IS NOT NULL`
        )
      )
      .limit(1);

    if (!certificate[0]) {
      return NextResponse.json(
        {
          valid: false,
          message: "Certificate not found or invalid",
        },
        { status: 404 }
      );
    }

    const cert = certificate[0];

    return NextResponse.json({
      valid: true,
      certificate: {
        certificateNumber,
        studentName: cert.userName,
        examTitle: cert.examTitle,
        examCategory: cert.examCategory,
        score: cert.score,
        completedAt: cert.completedAt,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Certificate verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
