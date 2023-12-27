import { NextFunction, Request, Response } from "express";
import { groupRoleService } from "../services";
import { createGroupRoleSchema, updateGroupRoleSchema } from "../validations";
import { prismaClient } from "../prisma";
import { serverMessages } from "../constants";

class GroupRoleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createGroupRoleSchema.parse(req.body);

      const role = await groupRoleService.create(body);

      return res.status(200).json(role);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const searched = await prismaClient.groupRole.findFirst({
        where: { id },
      });

      if (!searched) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group role") });
      }

      const body = updateGroupRoleSchema.parse(req.body);
      const role = await groupRoleService.update({ ...body, id });

      return res.status(200).json(role);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const searched = await prismaClient.groupRole.findFirst({
        where: { id },
      });

      if (!searched) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group role") });
      }

      await prismaClient.groupRole.delete({ where: { id } });

      return res
        .status(200)
        .json({ message: serverMessages.deletedEntity("Group role") });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const searched = await prismaClient.groupRole.findFirst({
        where: { id },
      });

      if (!searched) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Group role") });
      }

      return res.status(200).json(searched);
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await prismaClient.groupRole.findMany();

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

export const groupRoleController = new GroupRoleController();
