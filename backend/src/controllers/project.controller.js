import {
  createProjectService,
  getMyProjectsService,
  addMemberService,
  removeMemberService,
} from "../services/project.service.js";

export const createProject = async (req, res) => {
  try {
    const project = await createProjectService(req.user.id, req.body);

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await getMyProjectsService(req.user.id);

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const member = await addMemberService(req.user.id, projectId, email);

    res.status(201).json({
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;

    await removeMemberService(req.user.id, projectId, memberId);

    res.status(200).json({
      message: "Member removed successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};