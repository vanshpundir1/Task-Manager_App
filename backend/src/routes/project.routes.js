import express from "express";
import {
  createProject,
  getMyProjects,
  addMember,
  removeMember,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/my-projects", protect, getMyProjects);
router.post("/:projectId/members", protect, addMember);
router.delete("/:projectId/members/:memberId", protect, removeMember);

export default router;