import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../prisma";
import { serverMessages } from "../constants";
import { exclude, getPaginationData, getTotalPages } from "../utils";
import { User } from "@prisma/client";
import { updateUserSchema } from "../validations";

class UserController {
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const { filter, direction } = req.query;

      const { page, perPage, skip } = getPaginationData(req.query);

      const orderBy = filter ? { [filter as keyof User]: direction } : {};

      const totalCount = await prismaClient.user.count();

      const totalPages = getTotalPages({ perPage, totalCount });

      const users = await prismaClient.user.findMany({
        skip,
        take: perPage,
        orderBy,
      });

      return res.status(200).json({
        totalCount,
        page,
        totalPages,
        data: users.map((u) => exclude(u, ["password"])),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const user = await prismaClient.user.findFirst({ where: { id } });

      if (!user) {
        return res
          .status(401)
          .json({ message: serverMessages.entityNotFound("User") });
      }

      return res.status(200).json(exclude(user, ["password"]));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const user = await prismaClient.user.findFirst({ where: { id } });

      if (!user) {
        return res
          .status(401)
          .json({ message: serverMessages.entityNotFound("User") });
      }

      const avatar = req.file?.path;

      const body = updateUserSchema.parse(req.body);

      const updatedUser = await prismaClient.user.update({
        where: { id },
        data: { ...body, avatar },
      });

      return res.status(200).json(exclude(updatedUser, ["password"]));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const user = await prismaClient.user.findFirst({ where: { id } });

      if (!user) {
        return res
          .status(401)
          .json({ message: serverMessages.entityNotFound("User") });
      }

      await prismaClient.user.delete({ where: { id } });

      return res
        .status(200)
        .json({ message: serverMessages.deletedEntity("User") });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
