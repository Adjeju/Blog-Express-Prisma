import { Category, Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { categoryService } from "../services";
import { prismaClient } from "../prisma";
import { serverMessages } from "../constants";
import { getPaginationData, getTotalPages } from "../utils";
import { categorySchema } from "../validations";

class CategoryController {
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const category = await prismaClient.category.findFirst({ where: { id } });

      if (!category) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Category") });
      }

      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.params.search as string | undefined;

      const { page, perPage, skip } = getPaginationData(req.query);

      const where: Prisma.CategoryWhereInput = {
        name: {
          contains: search,
        },
      };

      const totalCount = await prismaClient.category.count({ where });

      const totalPages = getTotalPages({ perPage, totalCount });

      const categories = await prismaClient.category.findMany({
        skip,
        take: perPage,
        where,
      });

      return res
        .status(200)
        .json({ page, totalPages, totalCount, data: categories });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const category = await prismaClient.category.findFirst({ where: { id } });

      if (!category) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Category") });
      }

      await prismaClient.category.delete({ where: { id } });

      return res
        .status(200)
        .json({ message: serverMessages.deletedEntity("Category") });
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request<any, any, Pick<Category, "name">>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = categorySchema.parse(req.body);
      const category = await categoryService.create(body);
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request<any, any, Pick<Category, "name">>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name } = categorySchema.parse(req.body);

      const id = +req.params.id;

      const searchedCategory = await prismaClient.category.findFirst({
        where: { id },
      });

      if (!searchedCategory) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Category") });
      }

      const updatedCategory = await categoryService.update({ id, name });

      return res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
