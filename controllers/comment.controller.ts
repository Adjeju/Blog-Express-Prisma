import { NextFunction, Request, Response } from "express";
import { createCommentShema, updateCommentSchema } from "../validations";
import { commentService } from "../services";
import { prismaClient } from "../prisma";
import { serverMessages } from "../constants";
import { exclude, getPaginationData, getTotalPages } from "../utils";
import { Prisma } from "@prisma/client";

class CommentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createCommentShema.parse(req.body);

      const comment = await commentService.create(body);

      return res
        .status(200)
        .json({ ...comment, author: exclude(comment.author, ["password"]) });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const comment = await prismaClient.comment.findFirst({ where: { id } });

      if (!comment) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Comment") });
      }

      const { content } = updateCommentSchema.parse(req.body);
      const updatedComment = await commentService.update({ id, content });

      return res.status(200).json(updatedComment);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const comment = await prismaClient.comment.findFirst({ where: { id } });

      if (!comment) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Comment") });
      }

      await prismaClient.comment.delete({ where: { id } });

      return res
        .status(200)
        .json({ message: serverMessages.deletedEntity("Comment") });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const comment = await prismaClient.comment.findFirst({ where: { id } });

      if (!comment) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Comment") });
      }

      return res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.query.postId ? +req.query.postId : undefined;
      const authorId = req.query.authorId ? +req.query.authorId : undefined;
      const { page, perPage, skip } = getPaginationData(req.query);

      const where: Prisma.CommentWhereInput = {
        postId,
        authorId,
      };

      const totalCount = await prismaClient.comment.count({
        where,
      });

      const totalPages = getTotalPages({ perPage, totalCount });

      const comments = await prismaClient.comment.findMany({
        where,
        include: {
          author: true,
        },
        take: perPage,
        skip,
      });

      return res.status(200).json({
        page,
        totalCount,
        totalPages,
        data: comments.map((comment) => ({
          ...comment,
          author: exclude(comment.author, ["password"]),
        })),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const commentController = new CommentController();
