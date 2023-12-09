import { z } from "zod";
import { validationMessages } from "../constants";

export const createCommentShema = z.object({
  content: z.string().min(1, { message: validationMessages.required }),
  postId: z.number({ required_error: validationMessages.required }),
  authorId: z.number({ required_error: validationMessages.required }),
});

export type CreateCommentBody = z.infer<typeof createCommentShema>;

export const updateCommentSchema = createCommentShema.omit({
  authorId: true,
  postId: true,
});

export type UpdateCommentBody = z.infer<typeof updateCommentSchema>;
