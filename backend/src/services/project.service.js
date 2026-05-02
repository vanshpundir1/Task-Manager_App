import prisma from "../config/db.js";

export const createProjectService = async (userId, data) => {
  const { name, description } = data;

  if (!name) {
    throw new Error("Project name is required");
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      createdBy: userId,
      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  return project;
};

export const getMyProjectsService = async (userId) => {
  return await prisma.project.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      tasks: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const addMemberService = async (adminId, projectId, email) => {
  const adminMember = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: adminId,
      role: "ADMIN",
    },
  });

  if (!adminMember) {
    throw new Error("Only project admin can add members");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found with this email");
  }

  const alreadyMember = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: user.id,
    },
  });

  if (alreadyMember) {
    throw new Error("User is already a member");
  }

  return await prisma.projectMember.create({
    data: {
      projectId,
      userId: user.id,
      role: "MEMBER",
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const removeMemberService = async (adminId, projectId, memberId) => {
  const adminMember = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: adminId,
      role: "ADMIN",
    },
  });

  if (!adminMember) {
    throw new Error("Only project admin can remove members");
  }

  if (adminId === memberId) {
    throw new Error("Admin cannot remove himself");
  }

  const member = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: memberId,
    },
  });

  if (!member) {
    throw new Error("Member not found in this project");
  }

  return await prisma.projectMember.delete({
    where: {
      id: member.id,
    },
  });
};