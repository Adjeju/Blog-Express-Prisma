import { NextFunction, Request, Response } from "express";
import { tagService } from "../services";
import { prismaClient } from "../prisma";
import { serverMessages } from "../constants";
import { getPaginationData, getTotalPages } from "../utils";
import { tagSchema } from "../validations";
import { Prisma } from "@prisma/client";

class TagController {
  async create(
    req: Request<any, any, { name: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = tagSchema.parse(req.body);
      const tag = await tagService.create(body);
      return res.status(200).json(tag);
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request<any, any, { name: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name } = tagSchema.parse(req.body);

      const id = +req.params.id;

      const searchedTag = await prismaClient.tag.findFirst({ where: { id } });

      if (!searchedTag) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Tag") });
      }

      const tag = await tagService.update({ id, name });

      return res.status(200).json(tag);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const searchedTag = await prismaClient.tag.findFirst({ where: { id } });

      if (!searchedTag) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Tag") });
      }

      await prismaClient.tag.delete({ where: { id } });

      return res
        .status(200)
        .json({ message: serverMessages.deletedEntity("Tag") });
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const { page, perPage, skip } = getPaginationData(req.query);

      const where: Prisma.TagWhereInput = {
        name: {
          contains: search,
        },
      };

      const totalCount = await prismaClient.tag.count({ where });

      const totalPages = getTotalPages({ perPage, totalCount });

      const data = await prismaClient.tag.findMany({
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

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const tag = await prismaClient.tag.findFirst({ where: { id } });

      if (!tag) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Tag") });
      }

      return res.status(200).json(tag);
    } catch (error) {
      next(error);
    }
  }
}

export const tagController = new TagController();
