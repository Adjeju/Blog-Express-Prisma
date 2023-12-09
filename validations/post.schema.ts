import { z } from "zod";
import { validationMessages } from "../constants";

export const createPostSchema = z
  .object({
    content: z.string().min(1, { message: validationMessages.required }),
    title: z.string().min(1, { message: validationMessages.required }),
    authorId: z.number({ required_error: validationMessages.required }),
    categoryIds: z.array(z.number()).or(z.undefined()),
    tagIds: z.array(z.number()).or(z.undefined()),
  })
  .superRefine(({ categoryIds }, ctx) => {
    if (categoryIds && categoryIds.length === 0) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Categories must include at least one category!",
        path: ["categoryIds"],
      });
    }
  });

export type CreatePostBody = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, { message: validationMessages.required })
    .or(z.undefined()),
  title: z
    .string()
    .min(1, { message: validationMessages.required })
    .or(z.undefined()),
  categoryIds: z.array(z.number()).or(z.undefined()),
  tagIds: z.array(z.number()).or(z.undefined()),
});

export type UpdatePostBody = z.infer<typeof updatePostSchema>;
