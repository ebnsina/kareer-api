import express from "express";
import {
  getSavedJobs,
  removeSavedJob,
  saveJob,
} from "../controllers/bookmark.controller.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/", isAuth, saveJob);
router.get("/", isAuth, getSavedJobs);
router.delete("/:jobId", isAuth, removeSavedJob);

export default router;
