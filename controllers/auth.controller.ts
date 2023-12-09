import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";
import { prismaClient } from "../prisma";
import { loginUserSchema, signUpUserSchema } from "../validations";
import { serverMessages } from "../constants";
import { authService } from "../services";
import { exclude } from "../utils";

class AuthController {
  async login(
    req: Request<any, any, Pick<User, "email" | "password">>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = loginUserSchema.parse(req.body);

      const searchedUser = await prismaClient.user.findFirst({
        where: { email },
      });

      if (!searchedUser) {
        return res
          .status(400)
          .json({ message: serverMessages.entityNotFound("User") });
      }

      const isPassportValid = await authService.validatePassword(
        password,
        searchedUser.password
      );

      if (!isPassportValid) {
        return res.status(400).json({ message: serverMessages.password });
      }

      const token = authService.generateJwtToken(searchedUser);

      const data = { ...exclude(searchedUser, ["password"]), token };

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async signup(
    req: Request<
      any,
      any,
      Pick<User, "email" | "password" | "username"> & {
        confirmPassword: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { password, email, username } = signUpUserSchema.parse(req.body);
      const avatar = req.file?.path;

      const oldUser = await prismaClient.user.findFirst({
        where: {
          OR: [
            {
              email,
            },
            {
              username,
            },
          ],
        },
      });

      if (oldUser) {
        return res.status(400).json({ message: serverMessages.existingUser });
      }

      const newUser = await authService.signup({
        email,
        password,
        username,
        avatar,
      });

      const token = authService.generateJwtToken(newUser);

      const data = { ...exclude(newUser, ["password"]), token };

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
