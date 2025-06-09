import express from "express";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getMyJobs,
  recommendJobs,
  updateJob,
  updateJobStatus,
} from "../controllers/job.controller.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/", isAuth, createJob);
router.get("/recommendations", isAuth, recommendJobs);
router.put("/:id/status", isAuth, updateJobStatus);
router.get("/my-jobs", isAuth, getMyJobs);
router.get("/", getJobs);
router.get("/:id", getJob);
router.put("/:id", isAuth, updateJob);
router.delete("/:id", isAuth, deleteJob);

export default router;
