import express from "express";
import {
  getNotifications,
  readNotifications,
  unreadNotifications,
} from "../controllers/notification.controller.ts";
import { isAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.get("/", isAuth, getNotifications);
router.patch("/:id/read", isAuth, readNotifications);
router.patch("/:id/unread", isAuth, unreadNotifications);

export default router;
