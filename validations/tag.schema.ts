import { z } from "zod";
import { validationMessages } from "../constants";

export const tagSchema = z.object({
  name: z.string().min(1, { message: validationMessages.required }),
});
