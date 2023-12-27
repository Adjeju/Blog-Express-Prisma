import { prismaClient } from "../prisma";
import { CreateCommentBody, UpdateCommentBody } from "../validations";

class CommentService {
  async create(data: CreateCommentBody) {
    const comment = await prismaClient.comment.create({
      data,
      include: {
        author: true,
      },
    });

    return comment;
  }

  async update({ content, id }: UpdateCommentBody & { id: number }) {
    const comment = await prismaClient.comment.update({
      where: { id },
      data: { content },
      include: {
        author: true,
      },
    });

    return comment;
  }
}

export const commentService = new CommentService();
