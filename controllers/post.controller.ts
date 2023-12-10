import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { postService } from "../services";
import { prismaClient } from "../prisma";
import { exclude, getPaginationData, getTotalPages } from "../utils";
import { serverMessages } from "../constants";
import {
  CreatePostBody,
  UpdatePostBody,
  createPostSchema,
  updatePostSchema,
} from "../validations";

class PostController {
  async create(
    req: Request<any, any, CreatePostBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body = createPostSchema.parse(req.body);

      if (body.categoryIds && body.categoryIds.length) {
        for (const id of body.categoryIds) {
          const category = await prismaClient.category.findFirst({
            where: { id },
          });
          if (!category) {
            return res
              .status(404)
              .json({ message: `Category with id:${id} not found!` });
          }
        }
      }

      if (body.tagIds && body.tagIds.length) {
        for (const id of body.tagIds) {
          const tag = await prismaClient.tag.findFirst({
            where: { id },
          });
          if (!tag) {
            return res
              .status(404)
              .json({ message: `Tag with id:${id} not found!` });
          }
        }
      }

      const post = await postService.create(body);
      return res
        .status(200)
        .json({ ...post, author: exclude(post.author, ["password"]) });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request<any, any, UpdatePostBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = +req.params.id;

      const searchedPost = await prismaClient.post.findFirst({
        where: { id },
      });

      if (!searchedPost) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Post") });
      }

      const body = updatePostSchema.parse(req.body);

      const post = await postService.update({ ...body, id });

      return res
        .status(200)
        .json({ ...post, author: exclude(post.author, ["password"]) });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const post = await prismaClient.post.findFirst({ where: { id } });

      if (!post) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Post") });
      }

      await prismaClient.post.delete({
        where: { id },
      });

      return res
        .status(200)
        .json({ message: serverMessages.deletedEntity("Post") });
    } catch (error) {
      next(error);
    }
  }

  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const authorId = req.query.authorId ? +req.query.authorId : undefined;

      const published = req.query.published
        ? (req.query.published as string) === "true"
        : undefined;

      const { page, perPage, skip } = getPaginationData(req.query);

      const where: Prisma.PostWhereInput = {
        authorId,
        published,
      };

      const totalCount = await prismaClient.post.count({
        where,
      });

      const totalPages = getTotalPages({ perPage, totalCount });

      if (search) {
        where.OR = [
          {
            title: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
        ];
      }

      const posts = await prismaClient.post.findMany({
        where,
        take: perPage,
        skip,
        include: {
          author: true,
          categories: true,
          tags: true,
          comments: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      return res.status(200).json({
        page,
        totalPages,
        totalCount,
        data: posts.map(({ _count, author, ...rest }) => ({
          ...rest,
          author: exclude(author, ["password"]),
          likes: _count.likes,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;

      const post = await prismaClient.post.findFirst({
        where: { id },
        include: {
          author: true,
          categories: true,
          comments: true,
          tags: true,
        },
      });

      if (!post) {
        return res
          .status(404)
          .json({ message: serverMessages.entityNotFound("Post") });
      }

      const likes = await prismaClient.postLike.count({
        where: {
          postId: id,
        },
      });

      return res
        .status(200)
        .json({ ...post, author: exclude(post.author, ["password"]), likes });
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
