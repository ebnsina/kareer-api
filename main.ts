// @ts-types="npm:@types/express@4.17.15"
import express from "express";
import "jsr:@std/dotenv/load";
import * as http from "node:http";
import cors from "npm:cors";
import { Server } from "npm:socket.io";
import { CLIENT_URL, DATABASE_URI, PORT } from "./lib/constants.ts";
import { connectToDB } from "./lib/db.ts";
import adminRoutes from "./routes/admin.route.ts";
import applicationRoutes from "./routes/application.route.ts";
import authRoutes from "./routes/auth.route.ts";
import bookmarkRoutes from "./routes/bookmark.route.ts";
import companyRoutes from "./routes/company.route.ts";
import jobRoutes from "./routes/job.route.ts";
import notificationRoutes from "./routes/notification.route.ts";
import userRoutes from "./routes/user.route.ts";

if (!PORT) {
  console.warn(
    "WARNING: No port define on .env, it will default to port 5555!"
  );
}

if (!DATABASE_URI) {
  console.warn("WARNING: Please set Database url on your .env!");
}

if (!CLIENT_URL) {
  console.warn("WARNING: Please set client url on your .env!");
}

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CLIENT_URL, credentials: true },
});

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.set("io", io);

connectToDB();

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
