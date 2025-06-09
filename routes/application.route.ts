import express from "express";
import {
  applyToJob,
  getApplicantsForJob,
  getCandidateApplications,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/apply", isAuth, applyToJob);
router.get("/my-applications", isAuth, getMyApplications);
router.get("/job/:jobId/applicants", isAuth, getApplicantsForJob);
router.put("/:id/status", isAuth, updateApplicationStatus);
router.get("/candidate/history", isAuth, getCandidateApplications);

export default router;
