import { prismaClient } from "../prisma";
import { CreateGroupRequestBody, UpdateGroupRequestBody } from "../validations";

class GroupRequestService {
  async create(data: CreateGroupRequestBody & { userId: number }) {
    const request = await prismaClient.groupRequest.create({
      data,
      include: {
        group: true,
        user: true,
      },
    });

    return request;
  }

  async update({ id, ...data }: UpdateGroupRequestBody & { id: number }) {
    const request = await prismaClient.groupRequest.update({
      where: {
        id,
      },
      data,
      include: {
        group: true,
        user: true,
      },
    });

    return request;
  }
}

export const groupRequestService = new GroupRequestService();
