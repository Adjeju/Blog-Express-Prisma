import { prismaClient } from "../prisma";
import { CreatePostBody, UpdatePostBody } from "../validations";

class PostService {
  async create({ categoryIds, tagIds, ...rest }: CreatePostBody) {
    const post = await prismaClient.post.create({
      data: {
        ...rest,
        categories: {
          connect: categoryIds?.map((id) => ({ id })),
        },
        tags: {
          connect: tagIds?.map((id) => ({ id })),
        },
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });

    return post;
  }

  async update({
    id,
    content,
    title,
    categoryIds,
    tagIds,
  }: UpdatePostBody & {
    id: number;
  }) {
    const post = await prismaClient.post.update({
      where: {
        id: id,
      },
      data: {
        content,
        title,
        categories: {
          set: categoryIds?.map((id) => ({ id })),
        },
        tags: {
          set: tagIds?.map((id) => ({ id })),
        },
      },
      include: {
        author: true,
        categories: true,
        tags: true,
      },
    });

    return post;
  }
}

export const postService = new PostService();
