import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { eq, and } from "drizzle-orm";
import { questions } from "@/db/schema";
import { db } from "@/db/drizzle";

export async function GET(
  request: NextRequest,
  { params }: { params: { subjectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const subjectId = params.subjectId;

    // Parse subject ID (format: "category-questionType")
    const [category, questionType] = subjectId.split("-");

    if (!category || !questionType) {
      return NextResponse.json(
        { message: "Invalid subject ID format" },
        { status: 400 }
      );
    }

    // Validate category and questionType
    const validCategories = ["pilot", "hostess", "amt"];
    const validQuestionTypes = ["math", "reading", "mechanical", "abstract"];

    if (
      !validCategories.includes(category) ||
      !validQuestionTypes.includes(questionType)
    ) {
      return NextResponse.json(
        { message: "Invalid category or question type" },
        { status: 400 }
      );
    }

    // Get subject info and questions
    const conditions = [
      eq(questions.category, category as any),
      eq(questions.questionType, questionType as any),
    ];

    const subjectQuestions = await db
      .select({
        id: questions.id,
        questionText: questions.questionText,
        options: questions.options,
        correctAnswer: questions.correctAnswer,
        explanation: questions.explanation,
        imageUrl: questions.imageUrl,
        questionType: questions.questionType,
        category: questions.category,
        difficulty: questions.difficulty,
      })
      .from(questions)
      .where(and(...conditions))
      .limit(25); // Limit to 25 questions for practice session

    if (subjectQuestions.length === 0) {
      return NextResponse.json(
        { message: "No questions found for this subject" },
        { status: 404 }
      );
    }

    // Create subject info
    const subject = {
      id: subjectId,
      name: getSubjectName(questionType, category),
      description: getSubjectDescription(questionType, category),
      category,
      type: questionType,
      questionCount: subjectQuestions.length,
    };

    return NextResponse.json({
      success: true,
      subject,
      questions: subjectQuestions,
    });
  } catch (error) {
    console.error("Get subject questions error:", error);
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
