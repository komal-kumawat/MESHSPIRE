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

import passport from "passport";
import "./config/passport.config"; // <-- ensures passport.use(...) runs

// Routes
import userRoutes from "./routes/user.route";
import roomRoutes from "./routes/room.route";
import profileRoute from "./routes/profile.route";
import lessonRoute from "./routes/lesson.route";
import paymentRoutes from "./routes/payment.routes";
import { RoomController } from "./controller/room.controller";

const app = express();

// Security & Parsing
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS - MUST come before routes
const allowedOrigins = process.env.CLIENT_ORIGINS?.split(",") || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
  })
);

// Initialize passport
app.use(passport.initialize());

// Routes
app.use("/api/v0/user", userRoutes);
app.use("/api/v0/room", roomRoutes);
app.use("/api/v0/profile", profileRoute);
app.use("/api/v0/lesson", lessonRoute);
app.use("/api/v0/payment", paymentRoutes); // stripe payment route

// Socket.io
const server = createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);
  RoomController(io, socket);
});

// Start server & connect to MongoDB
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
