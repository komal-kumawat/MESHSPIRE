import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.route";
import roomRoutes from "./routes/room.route";
import { RoomManager } from "./manager/room.manager";
import { handleRoomSignals } from "./controller/room.controller";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
  })
);

app.use("/api/v0/users", userRoutes);
app.use("/api/v0/room", roomRoutes);

const server = createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const roomManager = new RoomManager();

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);
  handleRoomSignals(io, roomManager, socket);
});

const PORT = process.env.PORT || 8000;

const start = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Meshspire",
    });
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
