import prisma from "../config/db.js";

export const getDashboardService = async (userId) => {
  // total tasks
  const totalTasks = await prisma.task.count({
    where: { assignedTo: userId },
  });

  // tasks by status
  const statusCounts = await prisma.task.groupBy({
    by: ["status"],
    where: { assignedTo: userId },
    _count: true,
  });

  // tasks per user (for admin view)
  const tasksPerUser = await prisma.task.groupBy({
    by: ["assignedTo"],
    _count: true,
  });

  // overdue tasks
  const overdueTasks = await prisma.task.count({
    where: {
      assignedTo: userId,
      dueDate: {
        lt: new Date(),
      },
      status: {
        not: "DONE",
      },
    },
  });

  return {
    totalTasks,
    statusCounts,
    tasksPerUser,
    overdueTasks,
  };
};