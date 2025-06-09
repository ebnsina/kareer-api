import express from "express";
import {
  getOwnCompanyProfile,
  getPublicCompanyProfile,
  updateCompanyProfile,
} from "../controllers/company.controller.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.put("/profile", isAuth, updateCompanyProfile);
router.get("/me", isAuth, getOwnCompanyProfile);
router.get("/:id", getPublicCompanyProfile);

export default router;
