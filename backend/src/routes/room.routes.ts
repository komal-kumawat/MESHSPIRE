import { Router, type Response } from "express";
import Room from "../models/room.model.js";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware, type AuthRequest } from "../middleware/auth.js";

const roomRoutes = Router();

// Create a new room
roomRoutes.post("/create", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const roomId = uuidv4(); 
    const room = await Room.create({
      roomId,
      creator: req.userId,
      title: "New Meeting",
    });

    res.json({
      success: true,
      roomId: room.roomId,
      joinUrl: `/room/${room.roomId}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create room" });
  }
});

roomRoutes.get("/:roomID", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { roomID } = req.params;
    const room = await Room.findOne({ roomId: roomID });
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch room" });
  }
});

export default roomRoutes;
