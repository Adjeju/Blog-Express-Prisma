import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prismaClient } from "../prisma";
import jwt from "jsonwebtoken";

class AuthService {
  async signup({
    email,
    password,
    username,
    avatar,
  }: Pick<User, "email" | "username" | "password"> & { avatar?: string }) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        avatar,
      },
    });

    return user;
  }

  generateJwtToken({ id, email, username }: User) {
    return jwt.sign({ id, email, username }, process.env.TOKEN_KEY!, {
      expiresIn: "24h",
    });
  }

  validatePassword(inputPassword: string, originalPassword: string) {
    return bcrypt.compare(inputPassword, originalPassword);
  }
}

export const authService = new AuthService();
