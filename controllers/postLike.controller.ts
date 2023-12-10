import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../prisma";
import { serverMessages } from "../constants";
import { exclude, getPaginationData, getTotalPages } from "../utils";
import { Prisma } from "@prisma/client";

class PostLikeController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = +req.params.id;
      const userId = res.locals.userId;

      const post = await prismaClient.post.findFirst({ where: { id: postId } });

      if (!post) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Post") });
      }

      const like = await prismaClient.postLike.findFirst({
        where: { postId, userId },
      });

      if (like) {
        return res.status(404).json({
          message: `Post(id:${postId}) was liked by this user(id:${userId})`,
        });
      }

      await prismaClient.postLike.create({
        data: {
          postId,
          userId,
        },
      });

      return res.status(200).json("liked");
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = +req.params.id;
      const userId = res.locals.userId;

      const post = await prismaClient.post.findFirst({ where: { id: postId } });

      if (!post) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Post") });
      }

      const like = await prismaClient.postLike.findFirst({
        where: { postId, userId },
      });

      if (!like) {
        return res.status(404).json({
          message: `Post(id:${postId}) was never like by user(id:${userId})`,
        });
      }

      await prismaClient.postLike.delete({
        where: {
          id: like.id,
        },
      });

      return res.status(200).json("disliked");
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.query.postId ? +req.query.postId : undefined;
      const userId = res.locals.userId;

      const { page, perPage, skip } = getPaginationData(req.query);

      let where: Prisma.PostLikeWhereInput = {
        userId,
      };

      if (postId) {
        where = {
          postId,
        };
      }

      const totalCount = await prismaClient.postLike.count({ where });

      const totalPages = getTotalPages({ perPage, totalCount });
      const data = await prismaClient.postLike.findMany({
        where,
        take: perPage,
        skip,
        include: {
          post: true,
          user: true,
        },
      });

      return res
        .status(200)
        .json({
          page,
          totalCount,
          totalPages,
          data: data.map((like) => ({
            ...like,
            user: exclude(like.user, ["password"]),
          })),
        });
    } catch (error) {
      next(error);
    }
  }
}

export const postLikeController = new PostLikeController();
