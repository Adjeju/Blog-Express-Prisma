import { z } from "zod";
import { validationMessages } from "../constants";

export const createGroupSchema = z.object({
  name: z.string().min(1, { message: validationMessages.required }),
  description: z.string().min(1, { message: validationMessages.required }),
});

export type CreateGroupBody = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = z.object({
  name: z
    .string()
    .min(1, { message: validationMessages.required })
    .or(z.undefined()),
  description: z
    .string()
    .min(1, { message: validationMessages.required })
    .or(z.undefined()),
});
export type UpdateGroupBody = z.infer<typeof updateGroupSchema>;
