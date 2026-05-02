import prisma from "../config/db.js";

const isProjectAdmin = async (userId, projectId) => {
  const admin = await prisma.projectMember.findFirst({
    where: { userId, projectId, role: "ADMIN" },
  });

  return !!admin;
};

const isProjectMember = async (userId, projectId) => {
  const member = await prisma.projectMember.findFirst({
    where: { userId, projectId },
  });

  return !!member;
};

export const createTaskService = async (userId, projectId, data) => {
  const { title, description, dueDate, priority, assignedTo } = data;

  if (!title || !priority || !assignedTo) {
    throw new Error("Title, priority and assignedTo are required");
  }

  const admin = await isProjectAdmin(userId, projectId);

  if (!admin) {
    throw new Error("Only project admin can create tasks");
  }

  const assignedUserMember = await isProjectMember(assignedTo, projectId);

  if (!assignedUserMember) {
    throw new Error("Assigned user is not a member of this project");
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      assignedTo,
      projectId,
    },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
  });

  return task;
};

export const getProjectTasksService = async (userId, projectId) => {
  const member = await isProjectMember(userId, projectId);

  if (!member) {
    throw new Error("You are not a member of this project");
  }

  return await prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMyTasksService = async (userId) => {
  return await prisma.task.findMany({
    where: { assignedTo: userId },
    include: {
      project: {
        select: { id: true, name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateTaskStatusService = async (userId, taskId, status) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const admin = await isProjectAdmin(userId, task.projectId);

  if (!admin && task.assignedTo !== userId) {
    throw new Error("You can update only your assigned task");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
      project: {
        select: { id: true, name: true },
      },
    },
  });

  return updatedTask;
};

export const deleteTaskService = async (userId, taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const admin = await isProjectAdmin(userId, task.projectId);

  if (!admin) {
    throw new Error("Only project admin can delete tasks");
  }

  return await prisma.task.delete({
    where: { id: taskId },
  });
};