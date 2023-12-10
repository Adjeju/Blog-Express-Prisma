import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";
import { serverMessages } from "../constants";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ").at(-1);

  if (!token) {
    return res
      .status(403)
      .json({ message: serverMessages.authorisationRequired });
  }

  try {
    const { id } = jwt.verify(token, process.env.TOKEN_KEY!) as JwtPayload;
    res.locals.userId = id;
    return next();
  } catch (error) {
    return res.status(401).json({ message: serverMessages.invalidToken });
  }
};
