import { z } from "zod";
import { validationMessages } from "../constants";

export const loginUserSchema = z.object({
  email: z
    .string()
    .email(validationMessages.invalidEmail)
    .min(1, { message: validationMessages.required }),
  password: z.string().min(1, { message: validationMessages.required }),
});

export const signUpUserSchema = z
  .object({
    email: z
      .string()
      .email(validationMessages.invalidEmail)
      .min(1, { message: validationMessages.required }),
    password: z.string().min(1, { message: validationMessages.required }),
    username: z.string().min(1, { message: validationMessages.required }),
    confirmPassword: z
      .string()
      .min(1, { message: validationMessages.required }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationMessages.confirmPassword,
        path: ["password", "confirmPassword"],
      });
    }
  });
