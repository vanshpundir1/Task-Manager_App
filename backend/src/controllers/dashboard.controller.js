import { getDashboardService } from "../services/dashboard.service.js";

export const getDashboard = async (req, res) => {
  try {
    const data = await getDashboardService(req.user.id);

    res.status(200).json({
      message: "Dashboard fetched successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};