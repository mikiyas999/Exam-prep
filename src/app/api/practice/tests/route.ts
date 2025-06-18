import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, and, count } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { questions } from "@/db/schema";

const querySchema = z.object({
  category: z.enum(["pilot", "hostess", "amt"]).optional(),
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
    });

    // Build conditions for filtering
    const conditions = [];

    if (query.category) {
      conditions.push(eq(questions.category, query.category));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get question counts by category and type
    const questionCounts = await db
      .select({
        category: questions.category,
        questionType: questions.questionType,
        questionCount: count(questions.id),
      })
      .from(questions)
      .where(whereClause)
      .groupBy(questions.category, questions.questionType);

    // Generate practice tests based on available questions
    const practiceTests = [];

    // Group by category
    const categoryCounts = new Map();
    questionCounts.forEach((item) => {
      if (!categoryCounts.has(item.category)) {
        categoryCounts.set(item.category, { total: 0, types: [] });
      }
      const categoryData = categoryCounts.get(item.category);
      categoryData.total += item.questionCount;
      categoryData.types.push(item.questionType);
    });

    // Create comprehensive tests for each category
    categoryCounts.forEach((data, category) => {
      if (data.total >= 30) {
        practiceTests.push({
          id: `${category}-comprehensive`,
          name: `${getCategoryDisplayName(category)} Comprehensive Exam`,
          description: `Complete practice exam covering all ${getCategoryDisplayName(
            category
          )} topics`,
          category,
          difficulty: "medium",
          questions: Math.min(data.total, 60),
          timeLimit: Math.min(data.total * 2, 120),
          questionTypes: data.types,
        });
      }

      // Create focused tests for each question type
      questionCounts
        .filter(
          (item) => item.category === category && item.questionCount >= 10
        )
        .forEach((item) => {
          practiceTests.push({
            id: `${category}-${item.questionType}`,
            name: `${getCategoryDisplayName(category)} ${getTypeDisplayName(
              item.questionType
            )}`,
            description: `Focused practice on ${getTypeDisplayName(
              item.questionType
            ).toLowerCase()} for ${getCategoryDisplayName(category)}`,
            category,
            difficulty: getDifficultyForType(item.questionType),
            questions: Math.min(item.questionCount, 30),
            timeLimit: Math.min(item.questionCount * 1.5, 60),
            questionTypes: [item.questionType],
          });
        });
    });

    // Filter by category if specified
    const filteredTests = query.category
      ? practiceTests.filter((test) => test.category === query.category)
      : practiceTests;

    return NextResponse.json({
      success: true,
      practiceTests: filteredTests,
    });
  } catch (error) {
    console.error("Get practice tests error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function getCategoryDisplayName(category: string): string {
  const names = {
    amt: "AMT",
    hostess: "Cabin Crew",
    pilot: "Pilot",
  };
  return names[category as keyof typeof names] || category;
}

function getTypeDisplayName(questionType: string): string {
  const names = {
    math: "Mathematics",
    reading: "Reading Comprehension",
    mechanical: "Mechanical Principles",
    abstract: "Abstract Reasoning",
  };
  return names[questionType as keyof typeof names] || questionType;
}

function getDifficultyForType(questionType: string): string {
  const difficulties = {
    math: "medium",
    reading: "easy",
    mechanical: "hard",
    abstract: "hard",
  };
  return difficulties[questionType as keyof typeof difficulties] || "medium";
}
