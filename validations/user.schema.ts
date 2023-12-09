import { z } from "zod";
import { validationMessages } from "../constants";

export const updateUserSchema = z.object({
  email: z
    .string()
    .min(1, { message: validationMessages.required })
    .email({ message: validationMessages.invalidEmail })
    .or(z.undefined()),
  username: z
    .string()
    .min(1, { message: validationMessages.required })
    .or(z.undefined()),
});
