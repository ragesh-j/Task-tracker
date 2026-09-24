import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import timeLogRoutes from "./routes/timelog.routes";
import { prisma } from "./lib/prisma";


const app = express();

app.set("trust proxy", 1);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timelogs", timeLogRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;
const start = async () => {
  await prisma.$connect();
  console.log("Database connected");
  app.listen(port, () => console.log(`Server running on port ${port}`));
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
