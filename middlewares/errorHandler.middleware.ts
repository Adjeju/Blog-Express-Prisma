import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { serverMessages } from "../constants";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof z.ZodError)
    return res.status(400).json({ errors: err.issues });

  res.status(500).json({ message: serverMessages.serverError, error: err });
};
