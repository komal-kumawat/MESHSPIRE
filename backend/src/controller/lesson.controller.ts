import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import Lesson from "../models/LessonModel";
import { AuthRequest } from "../middleware/auth.middleware";
import { NotificationController } from "./notification.controller";
import { createConversation } from "./chat.controller";
import Profile from "../models/profile.model";

// Validation schema
const lessonSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  subTopic: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  class: z.string().min(1, "Class is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  status: z.enum(["scheduled", "cancelled"]).optional(),
});

export class LessonController {
  // Create a new lesson
  static async createLesson(req: AuthRequest, res: Response) {
    try {
      const parsed = lessonSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: parsed.error, message: "Invalid data" });
      }

      // Add studentId from authenticated user
      const lessonData = {
        ...parsed.data,
        studentId: req.user?.id,
        status: parsed.data.status || "scheduled",
      };

      const lesson = await Lesson.create(lessonData);

      // Notify relevant tutors about new lesson
      try {
        const normalizedSubject = parsed.data.subject.toLowerCase().trim();

        // Find tutors who teach this subject
        const relevantProfiles = await Profile.find({
          role: "tutor",
          subjects: {
            $elemMatch: {
              $regex: new RegExp(`^${normalizedSubject}$`, "i"),
            },
          },
        });

        // Create notifications for each relevant tutor
        const notificationPromises = relevantProfiles.map((profile) =>
          NotificationController.createNotification({
            userId: profile.userId.toString(),
            type: "new_lesson",
            title: "New Lesson Available",
            message: `A new ${parsed.data.subject} lesson is available: ${parsed.data.topic}`,
            lessonId: lesson._id.toString(),
          })
        );

        await Promise.all(notificationPromises);
        console.log(
          `✅ Notified ${relevantProfiles.length} tutors about new lesson`
        );
      } catch (notifError) {
        console.error("Error notifying tutors:", notifError);
        // Don't fail the request if notification fails
      }

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

  // Get all lessons
  static async getAllLessons(_req: AuthRequest, res: Response) {
    try {
      const lessons = await Lesson.find().sort({ createdAt: -1 });
      res.status(StatusCodes.OK).json(lessons);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }

  // Get lessons for the authenticated student
  static async getMyLessons(req: AuthRequest, res: Response) {
    try {
      const lessons = await Lesson.find({ studentId: req.user?.id })
        .populate("confirmedTutors.tutorId", "name email")
        .sort({
          createdAt: -1,
        });
      res.status(StatusCodes.OK).json(lessons);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }

  // Get relevant lessons for a tutor based on their subjects
  static async getRelevantLessons(req: AuthRequest, res: Response) {
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
        console.log("✅ Found profile for tutor:", userId);
      }

      if (
        !tutorProfile ||
        !tutorProfile.subjects ||
        tutorProfile.subjects.length === 0
      ) {
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
        .populate("confirmedTutors.tutorId", "name email")
        .sort({ createdAt: -1 });

      console.log(" All scheduled lessons found:", allLessons.length);
      allLessons.forEach((l, i) => {
        console.log(
          `  ${i + 1}. ${l.topic} - subject: "${l.subject
          }" (${typeof l.subject})`
        );
      });

      const lessons = allLessons.filter((lesson) => {
        const lessonSubject = String(lesson.subject).toLowerCase().trim();
        const matches = normalizedSubjects.includes(lessonSubject);

        if (matches) {
          console.log(
            `✅ Match found: "${lesson.subject}" matches tutor subjects`
          );
        } else {
          console.log(
            `❌ No match: "${lesson.subject
            }" not in tutor subjects [${normalizedSubjects.join(", ")}]`
          );
        }

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

  // Get a single lesson by ID
  static async getLessonById(req: AuthRequest, res: Response) {
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

  // Update a lesson
  static async updateLesson(req: AuthRequest, res: Response) {
    try {
      const parsed = lessonSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: parsed.error, message: "Invalid data" });
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

  // Tutor confirms a lesson
  static async confirmLesson(req: AuthRequest, res: Response) {
    try {
      const lessonId = req.params.id;
      const tutor = await Profile.findOne({ userId: req.user?.id, role: "tutor" });
      if (!tutor) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Tutor not found" });
      }
      const tutorId = tutor._id;


      if (!tutorId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Lesson not found" });
      }

      // Check if tutor already confirmed
      const alreadyConfirmed = lesson.confirmedTutors?.some(
        (ct: any) => ct.tutorId.toString() === tutorId
      );

      if (alreadyConfirmed) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "You have already confirmed this lesson" });
      }

      // Add tutor to confirmed list
      const updated = await Lesson.findByIdAndUpdate(
        lessonId,
        {
          $push: {
            confirmedTutors: {
              tutorId: tutor._id,
              userId: tutor.userId,
              name: tutor.name,
              confirmedAt: new Date()
            }
          },

        },
        { new: true }
      ).populate("confirmedTutors.tutorId", "name email userId");

      // Create notification for student
      if (lesson.studentId) {
        await NotificationController.createNotification({
          userId: lesson.studentId.toString(),
          type: "lesson_confirmed",
          title: "Lesson Confirmed",
          message: `Your lesson "${lesson.topic}" has been confirmed by a tutor. You can now chat with them!`,
          lessonId: lessonId,
        });
      }

      // Create conversation between student and tutor
      try {
        const conversation = await createConversation(lessonId, tutorId);
        console.log(`✅ Chat conversation created for lesson ${lessonId}`, {
          conversationId: conversation._id,
          studentId: lesson.studentId,
          tutorId: tutorId,
        });
      } catch (convError) {
        console.error("Error creating conversation:", convError);
        // Don't fail the request if conversation creation fails
      }

      res.status(StatusCodes.OK).json({
        message: "Lesson confirmed successfully",
        lesson: updated,
      });
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error confirming lesson",
        err,
      });
    }
  }

  // Tutor cancels/removes themselves from a lesson
  static async cancelLesson(req: AuthRequest, res: Response) {
    try {
      const lessonId = req.params.id;
      const tutorId = req.user?.id;

      if (!tutorId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Lesson not found" });
      }

      // Remove tutor from confirmed list
      const updated = await Lesson.findByIdAndUpdate(
        lessonId,
        {
          $pull: {
            confirmedTutors: { tutorId },
          },
        },
        { new: true }
      ).populate("confirmedTutors.tutorId", "name email");

      res.status(StatusCodes.OK).json({
        message: "Lesson cancellation successful",
        lesson: updated,
      });
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Error cancelling lesson",
        err,
      });
    }
  }
}
