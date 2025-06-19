import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const questionTypeEnum = pgEnum("question_type", [
  "math",
  "reading",
  "mechanical",
  "abstract",
]);
export const categoryEnum = pgEnum("category", ["pilot", "hostess", "amt"]);
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Questions table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  imageUrl: text("image_url"),
  questionType: questionTypeEnum("question_type").notNull(),
  category: categoryEnum("category").notNull(),
  difficulty: difficultyEnum("difficulty").default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

// User progress table
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  questionId: integer("question_id")
    .references(() => questions.id)
    .notNull(),
  isCorrect: boolean("is_correct").notNull(),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
});

// Exams table
export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: categoryEnum("category").notNull(),
  questionTypes: questionTypeEnum("question_types").array(),
  difficulty: difficultyEnum("difficulty"),
  timeLimit: integer("time_limit"), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Exam questions junction table
export const examQuestions = pgTable("exam_questions", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id")
    .references(() => exams.id)
    .notNull(),
  questionId: integer("question_id")
    .references(() => questions.id)
    .notNull(),
  order: integer("order").notNull(),
});

// User exam attempts table
export const userExamAttempts = pgTable("user_exam_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  examId: integer("exam_id")
    .references(() => exams.id)
    .notNull(),
  score: integer("score"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  examAttempts: many(userExamAttempts),
  questions: many(questions, { relationName: "createdQuestions" }),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  creator: one(users, {
    fields: [questions.createdBy],
    references: [users.id],
    relationName: "createdQuestions",
  }),
  examQuestions: many(examQuestions),
  userProgress: many(userProgress),
}));

export const examsRelations = relations(exams, ({ many }) => ({
  examQuestions: many(examQuestions),
  userExamAttempts: many(userExamAttempts),
}));

export const examQuestionsRelations = relations(examQuestions, ({ one }) => ({
  exam: one(exams, {
    fields: [examQuestions.examId],
    references: [exams.id],
  }),
  question: one(questions, {
    fields: [examQuestions.questionId],
    references: [questions.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [userProgress.questionId],
    references: [questions.id],
  }),
}));

export const userExamAttemptsRelations = relations(
  userExamAttempts,
  ({ one }) => ({
    user: one(users, {
      fields: [userExamAttempts.userId],
      references: [users.id],
    }),
    exam: one(exams, {
      fields: [userExamAttempts.examId],
      references: [exams.id],
    }),
  })
);
