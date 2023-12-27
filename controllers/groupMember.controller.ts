import { NextFunction, Request, Response } from "express";
import { groupMemberService } from "../services";
import {
  createGroupMemberSchema,
  updateGroupMemberSchema,
} from "../validations";
import { prismaClient } from "../prisma";
import { serverMessages } from "../constants";
import { exclude, getPaginationData, getTotalPages } from "../utils";
import { Prisma } from "@prisma/client";

class GroupMemberController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createGroupMemberSchema.parse(req.body);

      const user = await prismaClient.user.findFirst({
        where: { id: body.userId },
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("User") });
      }

      const group = await prismaClient.group.findFirst({
        where: { id: body.groupId },
      });

      if (!group) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group") });
      }

      const groupRequest = await prismaClient.groupRequest.findFirst({
        where: { id: body.groupRequestId },
      });

      if (!groupRequest) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group request") });
      }

      for (const roleId of body.roleIds) {
        const role = await prismaClient.groupRole.findFirst({
          where: { id: roleId },
        });

        if (!role) {
          return res.status(404).json({
            message: serverMessages.entityNotFound(`Role with id:${roleId}`),
          });
        }
      }

      const member = await groupMemberService.create(body);

      return res
        .status(200)
        .json({ ...member, user: exclude(member.user, ["password"]) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const { roleIds } = updateGroupMemberSchema.parse(req.body);

      const oldMember = await prismaClient.groupMember.findFirst({
        where: { id },
      });

      if (!oldMember) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group member") });
      }

      for (const roleId of roleIds) {
        const role = await prismaClient.groupRole.findFirst({
          where: { id: roleId },
        });

        if (!role) {
          return res.status(404).json({
            message: serverMessages.entityNotFound(`Role with id:${roleId}`),
          });
        }
      }

      const member = await groupMemberService.update({ id, roleIds });

      return res.status(200).json(member);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const member = await prismaClient.groupMember.findFirst({
        where: { id },
      });

      if (!member) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group member") });
      }

      await prismaClient.groupMember.delete({ where: { id } });

      return res
        .status(200)
        .json({ message: serverMessages.deletedEntity("Group member") });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const member = await prismaClient.groupMember.findFirst({
        where: { id },
      });

      if (!member) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group member") });
      }

      return res.status(200).json(member);
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = req.query.roleId ? +req.query.roleId : undefined;
      const groupId = req.query.groupId ? +req.query.groupId : undefined;
      const userId = req.query.userId ? +req.query.userId : undefined;

      const { page, perPage, skip } = getPaginationData(req.query);

      const where: Prisma.GroupMemberWhereInput = {
        groupId,
        userId,
        roles: {
          some: {
            id: roleId,
          },
        },
      };

      const totalCount = await prismaClient.groupMember.count({
        where,
      });

      const totalPages = getTotalPages({ perPage, totalCount });

      const members = await prismaClient.groupMember.findMany({
        where,
        include: {
          group: true,
          user: true,
          roles: true,
        },
        take: perPage,
        skip,
      });

      const data = members.map((m) => ({
        ...m,
        user: exclude(m.user, ["password"]),
      }));

      return res.status(200).json({ page, totalPages, totalCount, data });
    } catch (error) {
      next(error);
    }
  }
}

export const groupMemberController = new GroupMemberController();
