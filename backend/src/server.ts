// server.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.route";
import roomRoutes from "./routes/room.route";
import { RoomController } from "./controller/room.controller";
import profileRoute from "./routes/profile.route";

import passport from "passport";
import "./config/passport.config"; // <-- ensures passport.use(...) runs
import jwt from "jsonwebtoken";
import lessonRoute from "./routes/lesson.route";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());
// Configure CORS to allow only configured client origins
const allowedOrigins = (
  process.env.CLIENT_ORIGINS ||
  process.env.CLIENT_ORIGIN ||
  "*"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.includes("*")) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
  })
);

// Google OAuth routes are handled in user.routes; avoid duplication here.

app.use("/api/v0/user", userRoutes);
app.use("/api/v0/room", roomRoutes);
app.use("/api/v0/profile", profileRoute);
app.use("/api/v0/lesson", lessonRoute);
const server = createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*")) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Socket.IO CORS blocked: ${origin}`));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);
  RoomController(io, socket);
});

const PORT = Number(process.env.PORT || 8000);

const start = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err: any) {
    console.error("MongoDB connection error:", err.message || err);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

start();
