import express, { Router, type Request, type Response } from "express";
import zod from "zod";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { authMiddleware, type AuthRequest } from "../middleware.js";

dotenv.config();

const userRoutes = Router();

const signupBody = zod.object({
    name: zod.string(),
    username: zod.string().email(),
    password: zod.string().min(6),
    avatar: zod.string().optional(),
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
});

userRoutes.post("/signup", async (req: Request, res: Response) => {
    const parsed = signupBody.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid inputs" });
    }

    const { username, password, name, avatar } = parsed.data;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(409).json({ message: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password: hashedPassword,
        name,
        avatar,
    });

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "123456"
    );

    res.json({
        message: "User created successfully",
        token,
        name: user.name,
    });
});

userRoutes.post("/signin", async (req: Request, res: Response) => {
    const parsed = signinBody.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid email or password format" });
    }

    const { username, password } = parsed.data;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "123456"
    );

    res.json({
        message: "Signin successful",
        token,
        name: user.name,
    });
});


userRoutes.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        return res.status(500).json(err);
    }
});

export default userRoutes;
