import {
  categoryEnum,
  userRoleEnum,
  questionTypeEnum,
  difficultyEnum,
} from "./schema"; // adjust the path

// ✅ TypeScript type from the enum
export type Category = (typeof categoryEnum.enumValues)[number];
export type userRole = (typeof userRoleEnum.enumValues)[number];
export type questionType = (typeof questionTypeEnum.enumValues)[number];
export type difficulty = (typeof difficultyEnum.enumValues)[number];
