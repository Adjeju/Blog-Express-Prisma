import { z } from "zod";
import { validationMessages } from "../constants";

//TODO: add validation by title if exists for tags, categories and roles
export const createGroupRoleSchema = z.object({
  name: z.string().min(1, { message: validationMessages.required }),
});

export type CreateGroupRoleBody = z.infer<typeof createGroupRoleSchema>;

export const updateGroupRoleSchema = z.object({
  name: z.string().min(1, { message: validationMessages.required }),
});

export type UpdateGroupRoleBody = z.infer<typeof updateGroupRoleSchema>;
