import { prismaClient } from "../prisma";
import { CreateGroupBody, UpdateGroupBody } from "../validations";

class GroupService {
  async create(data: CreateGroupBody & { ownerId: number }) {
    const group = await prismaClient.group.create({
      data,
      include: {
        owner: true,
      },
    });

    return group;
  }

  async update({ id, ...data }: UpdateGroupBody & { id: number }) {
    const group = await prismaClient.group.update({
      where: { id },
      data,
      include: {
        owner: true,
      },
    });

    return group;
  }
}

export const groupService = new GroupService();
