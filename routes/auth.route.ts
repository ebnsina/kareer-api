import express from "express";
import { getMe, login, register } from "../controllers/auth.controller.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuth, getMe);

export default router;
