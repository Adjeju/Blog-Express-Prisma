import { prismaClient } from "../prisma";
import { CreateGroupMemberBody, UpdateGroupMemberBody } from "../validations";

class GroupMemberService {
  async create({
    groupId,
    userId,
    roleIds,
    groupRequestId,
  }: CreateGroupMemberBody) {
    const member = await prismaClient.groupMember.create({
      data: {
        groupId,
        userId,
        groupRequestId,
        roles: {
          connect: roleIds.map((id) => ({ id })),
        },
      },
      include: {
        group: true,
        roles: true,
        user: true,
      },
    });

    return member;
  }

  async update({ id, roleIds }: UpdateGroupMemberBody & { id: number }) {
    const member = await prismaClient.groupMember.update({
      where: { id },
      data: {
        roles: {
          set: roleIds.map((id) => ({
            id,
          })),
        },
      },
      include: {
        roles: true,
      },
    });

    return member;
  }
}

export const groupMemberService = new GroupMemberService();
