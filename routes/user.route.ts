import express from "express";
import { getMe } from "../controllers/auth.controller.ts";
import {
  bookmarkJob,
  getBookmarkedJobs,
  getCandidateDashboard,
  getCandidateProfile,
  getEmployerDashboard,
  getEmployerProfile,
  unbookmarkJob,
  updateCandidateProfile,
  updateEmployerProfile,
} from "../controllers/user.controller.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.get("/me", isAuth, getMe);
router.put("/candidate/profile", isAuth, updateCandidateProfile);
router.get("/candidate/profile", isAuth, getCandidateProfile);
router.get("/candidate/dashboard", isAuth, getCandidateDashboard);
router.put("/employer/profile", isAuth, updateEmployerProfile);
router.get("/employer/profile", isAuth, getEmployerProfile);
router.get("/employer/dashboard", isAuth, getEmployerDashboard);
router.post("/bookmark/:jobId", isAuth, bookmarkJob);
router.delete("/bookmark/:jobId", isAuth, unbookmarkJob);
router.get("/bookmarks", isAuth, getBookmarkedJobs);

export default router;
