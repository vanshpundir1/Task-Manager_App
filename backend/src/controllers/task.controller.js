import {
  createTaskService,
  getProjectTasksService,
  getMyTasksService,
  updateTaskStatusService,
  deleteTaskService,
} from "../services/task.service.js";

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    const task = await createTaskService(req.user.id, projectId, req.body);

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await getProjectTasksService(req.user.id, projectId);

    res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await getMyTasksService(req.user.id);

    res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await updateTaskStatusService(req.user.id, taskId, status);

    res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    await deleteTaskService(req.user.id, taskId);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};