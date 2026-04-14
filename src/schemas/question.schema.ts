import { z } from "zod";

/**
 * Platform enum
 */
export const PlatformEnum = z.enum(["LEETCODE", "GFG", "INTERVIEWBIT", "OTHER"]);

/**
 * Level enum
 */
export const LevelEnum = z.enum(["EASY", "MEDIUM", "HARD"]);

/**
 * Create Question Schema
 * For CreateQuestion component
 */
export const createQuestionSchema = z.object({
  question_name: z.string().min(1, "Question name is required"),
  question_link: z.string().url("Question link must be a valid URL"),
  topic_id: z.number().int().min(1, "Topic is required"),
  platform: PlatformEnum,
  level: LevelEnum,
});

/**
 * Update Question Schema
 * For UpdateQuestion component
 */
export const updateQuestionSchema = z.object({
  question_name: z.string().min(1, "Question name is required").optional(),
  question_link: z.string().url("Question link must be a valid URL").optional(),
  topic_id: z.number().int().positive().optional(),
  platform: PlatformEnum.optional(),
  level: LevelEnum.optional(),
});

// Type exports
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
