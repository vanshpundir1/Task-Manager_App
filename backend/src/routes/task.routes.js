import express from "express";
import {
  createTask,
  getProjectTasks,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/project/:projectId", protect, createTask);
router.get("/project/:projectId", protect, getProjectTasks);
router.get("/my-tasks", protect, getMyTasks);
router.patch("/:taskId/status", protect, updateTaskStatus);
router.delete("/:taskId", protect, deleteTask);

export default router;