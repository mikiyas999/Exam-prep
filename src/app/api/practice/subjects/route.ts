import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, and, count } from "drizzle-orm";
import { z } from "zod";
import { questions } from "@/db/schema";
import { db } from "@/db/drizzle";

const querySchema = z.object({
  category: z.enum(["pilot", "hostess", "amt"]).optional(),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
    });

    // Build conditions for filtering
    const conditions = [];

    if (query.category) {
      conditions.push(eq(questions.category, query.category));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get subjects grouped by questionType and category
    const subjectsData = await db
      .select({
        questionType: questions.questionType,
        category: questions.category,
        difficulty: questions.difficulty,
        questionCount: count(questions.id),
      })
      .from(questions)
      .where(whereClause)
      .groupBy(questions.questionType, questions.category, questions.difficulty)
      .orderBy(questions.questionType, questions.category);

    // Transform data into subjects format
    const subjectsMap = new Map();

    subjectsData.forEach((item) => {
      const key = `${item.category}-${item.questionType}`;

      if (!subjectsMap.has(key)) {
        subjectsMap.set(key, {
          id: `${item.category}-${item.questionType}`,
          name: getSubjectName(item.questionType, item.category),
          description: getSubjectDescription(item.questionType, item.category),
          category: item.category,
          type: item.questionType,
          difficulty: item.difficulty,
          questionCount: 0,
        });
      }

      const subject = subjectsMap.get(key);
      subject.questionCount += item.questionCount;
    });

    let subjects = Array.from(subjectsMap.values());

    // Apply search filter if provided
    if (query.search) {
      subjects = subjects.filter(
        (subject) =>
          subject.name.toLowerCase().includes(query.search!.toLowerCase()) ||
          subject.description
            .toLowerCase()
            .includes(query.search!.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      subjects,
    });
  } catch (error) {
    console.error("Get subjects error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function getSubjectName(questionType: string, category: string): string {
  const typeNames = {
    math: "Mathematics",
    reading: "Reading Comprehension",
    mechanical: "Mechanical Principles",
    abstract: "Abstract Reasoning",
  };

  const categoryNames = {
    amt: "AMT",
    hostess: "Cabin Crew",
    pilot: "Pilot",
  };

  return `${typeNames[questionType as keyof typeof typeNames]} - ${
    categoryNames[category as keyof typeof categoryNames]
  }`;
}

function getSubjectDescription(questionType: string, category: string): string {
  const descriptions = {
    math: "Core mathematical concepts and calculations",
    reading: "Text comprehension and interpretation skills",
    mechanical: "Understanding of mechanical systems and principles",
    abstract: "Pattern recognition and logical reasoning",
  };

  return `${
    descriptions[questionType as keyof typeof descriptions]
  } for ${category.toUpperCase()} preparation`;
}
