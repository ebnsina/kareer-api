import express from "express";
import {
  deleteApplication,
  deleteJob,
  deleteUser,
  getAllApplications,
  getAllJobs,
  getAllUsers,
  getStats,
  updateJob,
} from "../controllers/admin.controller.ts";
import { isAdmin, isAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.get("/stats", isAuth, isAdmin, getStats);
router.get("/users", isAuth, isAdmin, getAllUsers);
router.get("/jobs", isAuth, isAdmin, getAllJobs);
router.get("/applications", isAuth, isAdmin, getAllApplications);
router.delete("/user/:id", isAuth, isAdmin, deleteUser);
router.delete("/job/:id", isAuth, isAdmin, deleteJob);
router.delete("/application/:id", isAuth, isAdmin, deleteApplication);
router.put("/job/:id", isAuth, isAdmin, updateJob);

export default router;
