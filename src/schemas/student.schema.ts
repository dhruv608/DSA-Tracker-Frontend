import { z } from "zod";

/**
 * Create Student Schema (Admin creates student)
 * For create student modal in admin/students page
 */
export const createStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  username: z.string().optional(),
  password: z.union([z.string().min(8, "Password must be at least 8 characters"), z.literal("")]).optional(),
  enrollment_id: z.string().min(1, "Enrollment ID is required"),
  batch_id: z.number().int().positive("Batch is required"),
  leetcode_id: z.string().optional(),
  gfg_id: z.string().optional(),
});

/**
 * Update Student Schema
 * For edit student modal
 */
export const updateStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  username: z.string().optional(),
  enrollment_id: z.string().min(1, "Enrollment ID is required"),
  leetcode_id: z.string().optional(),
  gfg_id: z.string().optional(),
});
/**
 * Update Student Profile Schema
 * For EditProfileModal component
 */
export const updateProfileSchema = z.object({
  leetcode_id: z.string().optional(),
  gfg_id: z.string().optional(),
});

/**
 * Update Username Schema
 * For username update form
 */
export const updateUsernameSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

/**
 * Create Bookmark Schema
 * For BookmarkModal component
 */
export const createBookmarkSchema = z.object({
  question_id: z.number().int().positive("Question ID is required"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
});

/**
 * Update Bookmark Schema
 * For EditBookmarkModal component
 */
export const updateBookmarkSchema = z.object({
  description: z.string().max(500, "Description must be 500 characters or less"),
});

// Type exports
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateUsernameInput = z.infer<typeof updateUsernameSchema>;
export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
