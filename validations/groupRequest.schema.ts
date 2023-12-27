import { z } from "zod";
import { GroupRequestStatuses, validationMessages } from "../constants";

export const createGroupRequestSchema = z.object({
  groupId: z.number({ required_error: validationMessages.required }),
});

export type CreateGroupRequestBody = z.infer<typeof createGroupRequestSchema>;

export const updateGroupRequestSchema = z.object({
  status: z.nativeEnum(GroupRequestStatuses),
});

export type UpdateGroupRequestBody = z.infer<typeof updateGroupRequestSchema>;
