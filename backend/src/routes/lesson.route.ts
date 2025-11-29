import { Router, Response } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import Lesson from "../models/LessonModel";
import Profile from "../models/profile.model";

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
  "/relevant-lessons",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      // Get tutor's profile to find their subjects
      const Profile = (await import("../models/profile.model")).default;
      const tutorProfile = await Profile.findOne({ userId });

      if (tutorProfile) {
        console.log("✅ Tutor profile found:", tutorProfile);
      }

      if (
        !tutorProfile ||
        !tutorProfile.subjects ||
        tutorProfile.subjects.length === 0
      ) {
        console.log("⚠️  No subjects found for tutor - returning empty array");
        return res.status(StatusCodes.OK).json([]);
      }

      // Normalize subjects to lowercase and trim for case-insensitive matching
      const normalizedSubjects = tutorProfile.subjects.map((s) =>
        String(s).toLowerCase().trim()
      );

      console.log("✅ Normalized tutor subjects:", normalizedSubjects);

      // Find all lessons and filter by case-insensitive subject match
      const allLessons = await Lesson.find({ status: "scheduled" })
        .populate("studentId", "name email")
        .sort({ createdAt: -1 });

      console.log("📚 All scheduled lessons found:", allLessons.length);
      allLessons.forEach((l, i) => {
        console.log(`   ${i + 1}. "${l.topic}" - Subject: "${l.subject}"`);
      });

      const lessons = allLessons.filter((lesson) => {
        const lessonSubject = String(lesson.subject).toLowerCase().trim();
        const matches = normalizedSubjects.includes(lessonSubject);
        console.log(
          `   🔍 Checking "${lesson.topic}" (${
            lesson.subject
          }) -> normalized: "${lessonSubject}" -> Match: ${
            matches ? "✅" : "❌"
          }`
        );
        return matches;
      });

      console.log(`\n✅ Filtered lessons count: ${lessons.length}`);
      console.log(
        "📤 Sending response with lessons:",
        lessons.map((l) => ({ topic: l.topic, subject: l.subject }))
      );
      console.log("========== END REQUEST ==========\n");

      res.status(StatusCodes.OK).json(lessons);
    } catch (err) {
      console.error("❌ Error in relevant-lessons:", err);
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
