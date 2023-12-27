import { NextFunction, Request, Response } from "express";
import { groupMemberService, groupRequestService } from "../services";
import { prismaClient } from "../prisma";
import { GroupRequestStatuses, serverMessages } from "../constants";
import { exclude, getPaginationData, getTotalPages } from "../utils";
import { Prisma } from "@prisma/client";
import {
  createGroupRequestSchema,
  updateGroupRequestSchema,
} from "../validations";

class GroupRequestController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupId } = createGroupRequestSchema.parse(req.body);
      const userId = res.locals.userId;

      const group = await prismaClient.group.findFirst({
        where: {
          id: groupId,
        },
      });

      if (!group) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group") });
      }

      const oldRequest = await prismaClient.groupRequest.findFirst({
        where: {
          groupId,
          userId,
        },
      });

      if (oldRequest) {
        return res
          .status(400)
          .json({ message: "Group request must be unique!" });
      }

      const request = await groupRequestService.create({ groupId, userId });

      return res
        .status(200)
        .json({ ...request, user: exclude(request.user, ["password"]) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const searchedRequest = await prismaClient.groupRequest.findFirst({
        where: { id },
      });

      if (!searchedRequest) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group Request") });
      }

      const { status } = updateGroupRequestSchema.parse(req.body);
      const request = await groupRequestService.update({ status, id });

      if (request.status === GroupRequestStatuses.Acepted) {
        await groupMemberService.create({
          groupId: request.groupId,
          userId: request.userId,
          roleIds: [1],
          groupRequestId: id,
        });
      }

      return res
        .status(200)
        .json({ ...request, user: exclude(request.user, ["password"]) });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const searchedRequest = await prismaClient.groupRequest.findFirst({
        where: { id },
      });

      if (!searchedRequest) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group Request") });
      }

      await prismaClient.groupRequest.delete({
        where: {
          id,
        },
      });

      return res
        .status(200)
        .json({ message: serverMessages.deletedEntity("Group Request") });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const request = await prismaClient.groupRequest.findFirst({
        where: { id },
        include: {
          group: true,
          user: true,
        },
      });

      if (!request) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group Request") });
      }

      return res
        .status(200)
        .json({ ...request, user: exclude(request.user, ["password"]) });
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = req.query.groupId ? +req.query.groupId : undefined;
      const userId = req.query.userId ? +req.query.userId : undefined;
      const status = req.query.status as string;

      const { page, perPage, skip } = getPaginationData(req.query);

      const where: Prisma.GroupRequestWhereInput = {
        groupId,
        status,
        userId,
      };

      const totalCount = await prismaClient.groupRequest.count({
        where,
      });

      const totalPages = getTotalPages({ totalCount, perPage });

      const data = await prismaClient.groupRequest.findMany({
        where,
        include: {
          group: true,
          user: true,
        },
        take: perPage,
        skip,
      });

      return res.status(200).json({
        totalCount,
        totalPages,
        page,
        data: data.map((r) => ({ ...r, user: exclude(r.user, ["password"]) })),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const groupRequestController = new GroupRequestController();
