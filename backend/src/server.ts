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

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// --- Google OAuth routes (start + callback) ---
/**
 * Initiates Google OAuth. Frontend opens: `${API_BASE_URL}/user/auth/google`
 */
app.get(
  "/api/v0/user/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * Google OAuth callback. On success we create an access token (JWT)
 * and redirect to FRONTEND_URL with token & basic user info as query params.
 * Note: in production prefer httpOnly cookies or another secure transfer mechanism.
 */
app.get(
  "/api/v0/user/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/?error=google_auth_failed`,
  }),
  (req, res) => {
    try {
      const user = req.user as any;
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/?error=no_user`);
      }

      if (!process.env.JWT_ACCESS_SECRET) {
        console.error("JWT_ACCESS_SECRET is not set");
        return res.redirect(`${process.env.FRONTEND_URL}/?error=server_config`);
      }

      const payload = {
        sub: user._id || user.id,
        email: user.email,
      };
      // @ts-ignore
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
      });

      const redirectUrl = new URL(
        process.env.FRONTEND_URL || "http://localhost:5173"
      );
      redirectUrl.searchParams.set("token", accessToken);
      redirectUrl.searchParams.set("name", user.name || "");
      redirectUrl.searchParams.set("id", String(user._id || user.id || ""));

      return res.redirect(redirectUrl.toString());
    } catch (err) {
      console.error("Error in Google callback handler:", err);
      return res.redirect(`${process.env.FRONTEND_URL}/?error=server_error`);
    }
  }
);
// --- end Google OAuth routes ---

app.use("/api/v0/user", userRoutes);
app.use("/api/v0/room", roomRoutes);
app.use("/api/v0/profile", profileRoute);
const server = createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*",
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
