import { z } from "zod";
import { validationMessages } from "../constants";

export const categorySchema = z.object({
  name: z
    .string({ required_error: validationMessages.required })
    .min(1, { message: validationMessages.required }),
});
