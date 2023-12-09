import { prismaClient } from "../prisma";

class TagService {
  async create({ name }: { name: string }) {
    const tag = await prismaClient.tag.create({ data: { name } });

    return tag;
  }

  async update({ name, id }: { name: string; id: number }) {
    const tag = await prismaClient.tag.update({
      where: { id },
      data: { name },
    });

    return tag;
  }
}

export const tagService = new TagService();
