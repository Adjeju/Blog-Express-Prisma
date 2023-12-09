import { prismaClient } from "../prisma";

class CategoryService {
  async create({ name }: { name: string }) {
    const category = await prismaClient.category.create({
      data: {
        name,
      },
    });

    return category;
  }

  async update({ name, id }: { name: string; id: number }) {
    const category = await prismaClient.category.update({
      where: { id },
      data: {
        name,
      },
    });

    return category;
  }
}

export const categoryService = new CategoryService();
