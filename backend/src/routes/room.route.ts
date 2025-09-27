import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt, { SignOptions } from "jsonwebtoken";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import Room from "../models/room.model";
import { StatusCodes } from "http-status-codes";

export interface JwtPayloadRoom {
  roomId: string;
  uid: string;
}

const router = Router();

router.post(
  "/create",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const { title } = req.body;
      const roomId = uuidv4();

      const room = await Room.create({
        roomId,
        title,
        creator: req.user!.id,
      });

      if (!process.env.JWT_ROOM_SECRET) {
        throw new Error("JWT_ROOM_SECRET not defined");
      }

      const signOptions: SignOptions = { expiresIn: 600 };
      const roomToken = jwt.sign(
        { roomId, uid: req.user!.id } as JwtPayloadRoom,
        process.env.JWT_ROOM_SECRET,
        signOptions
      );

      const joinUrl = `${process.env.CLIENT_ORIGIN}/room/${roomId}?token=${roomToken}`;

      res.status(StatusCodes.OK).json({ roomId, joinUrl });
    } catch (err) {
      console.error(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }
);

router.get("/:roomId", async (req: Request, res: Response) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Room not found" });
    }

    res.status(StatusCodes.OK).json({
      roomId: room.roomId,
      title: room.title,
      creator: room.creator,
      createdAt: room.createdAt,
    });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
});

export default router;
