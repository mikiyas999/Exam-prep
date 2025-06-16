import { pgTable, serial, text, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const questionTypeEnum = pgEnum("question_type", ["math", "reading", "mechanical", "abstract"]);
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