import { Router, Response } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import Lesson from "../models/LessonModel";

const lessonRoute = Router();

const lessonSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  subTopic: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  class: z.string().min(1, "Class is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  status: z.enum(["scheduled", "cancelled"]).optional(),
});

lessonRoute.post(
  "/create",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const parsed = lessonSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid lesson data",
          errors: parsed.error,
        });
      }

      // Add studentId from authenticated user
      const lessonData = {
        ...parsed.data,
        studentId: req.user?.id, // Get from auth middleware
      };

      const lesson = await Lesson.create(lessonData);

      res.status(StatusCodes.CREATED).json({
        message: "Lesson created successfully",
        lesson,
      });
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error while creating lesson",
        err,
      });
    }
  }
);

lessonRoute.get(
  "/all",
  authMiddleware,
  async (_req: AuthRequest, res: Response) => {
    try {
      const lessons = await Lesson.find().sort({ createdAt: -1 });
      res.status(StatusCodes.OK).json(lessons);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

lessonRoute.get(
  "/my-lessons",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const lessons = await Lesson.find({ studentId: req.user?.id }).sort({
        createdAt: -1,
      });
      res.status(StatusCodes.OK).json(lessons);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

lessonRoute.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const lesson = await Lesson.findById(req.params.id);
      if (!lesson) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Lesson not found" });
      }
      res.status(StatusCodes.OK).json(lesson);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

lessonRoute.put(
  "/update/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const parsed = lessonSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid update data",
          errors: parsed.error,
        });
      }

      const updated = await Lesson.findByIdAndUpdate(
        req.params.id,
        { $set: parsed.data },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Lesson not found" });
      }

      res.status(StatusCodes.OK).json(updated);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

export default lessonRoute;
