import { prismaClient } from "../prisma";
import { CreateGroupRoleBody, UpdateGroupRoleBody } from "../validations";

class GroupRoleService {
  async create(data: CreateGroupRoleBody) {
    const role = await prismaClient.groupRole.create({
      data,
    });

    return role;
  }

  async update({ id, ...data }: UpdateGroupRoleBody & { id: number }) {
    const role = await prismaClient.groupRole.update({
      where: {
        id,
      },
      data,
    });

    return role;
  }
}

export const groupRoleService = new GroupRoleService();
