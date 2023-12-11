import { NextFunction, Request, Response } from "express";
import { groupService } from "../services";
import { prismaClient } from "../prisma";
import { serverMessages } from "../constants";
import { exclude, getPaginationData, getTotalPages } from "../utils";
import { Prisma } from "@prisma/client";
import { createGroupSchema, updateGroupSchema } from "../validations";

class GroupController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = res.locals.userId;
      const body = createGroupSchema.parse(req.body);
      const group = await groupService.create({ ...body, ownerId });

      return res
        .status(200)
        .json({ ...group, owner: exclude(group.owner, ["password"]) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const searchedGroup = await prismaClient.group.findFirst({
        where: { id },
      });

      if (!searchedGroup) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group") });
      }

      const body = updateGroupSchema.parse(req.body);
      const group = await groupService.update({ ...body, id });

      return res
        .status(200)
        .json({ ...group, owner: exclude(group.owner, ["password"]) });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const searchedGroup = await prismaClient.group.findFirst({
        where: { id },
      });

      if (!searchedGroup) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group") });
      }

      await prismaClient.group.delete({
        where: { id },
      });

      return res
        .status(200)
        .json({ message: serverMessages.deletedEntity("Group") });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const group = await prismaClient.group.findFirst({
        where: { id },
        include: {
          owner: true,
        },
      });

      if (!group) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group") });
      }

      return res
        .status(200)
        .json({ ...group, owner: exclude(group.owner, ["password"]) });
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = req.query.ownerId ? +req.query.ownerId : undefined;
      const { page, perPage, skip } = getPaginationData(req.query);

      const where: Prisma.GroupWhereInput = {
        ownerId,
      };

      const totalCount = await prismaClient.group.count({ where });

      const totalPages = getTotalPages({
        perPage,
        totalCount,
      });

      const data = await prismaClient.group.findMany({
        skip,
        take: perPage,
        where,
      });

      return res.status(200).json({
        page,
        totalCount,
        totalPages,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const groupController = new GroupController();
