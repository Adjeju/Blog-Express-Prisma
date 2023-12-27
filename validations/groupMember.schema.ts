import { z } from "zod";
import { validationMessages } from "../constants";

export const createGroupMemberSchema = z.object({
  groupId: z.number({ required_error: validationMessages.required }),
  userId: z.number({ required_error: validationMessages.required }),
  roleIds: z.array(z.number()),
  groupRequestId: z.number({ required_error: validationMessages.required }),
});

export type CreateGroupMemberBody = z.infer<typeof createGroupMemberSchema>;

export const updateGroupMemberSchema = z.object({
  roleIds: z.array(z.number()),
});

export type UpdateGroupMemberBody = z.infer<typeof updateGroupMemberSchema>;
