import { NextFunction, Response, Router } from "express";
import { z } from "zod";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import Profile from "../models/profile.model";
import multer from "multer";
import { handleAvatarUpload } from "../controller/avatarUpload";
import User from "../models/user.model"; // ✅ Import User model to update name

const profileRoute = Router();
const upload = multer();

// ✅ Validation schema
const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  avatar: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  age: z.number().min(5, "Age must be at least 5").max(120).optional(),
  bio: z.string().max(300).optional(),
  skills: z.array(z.string()).optional(),
  role: z.enum(["student", "teacher"]).optional(),
  languages: z.array(z.string()).optional(),
});

// ✅ CREATE PROFILE
profileRoute.post(
  "/create",
  authMiddleware,
  upload.single("avatar"),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const parsed = profileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: parsed.error, message: "Invalid data" });
      }

      const existingProfile = await Profile.findOne({ userId: req.user.id });
      if (existingProfile) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Profile already exists" });
      }

      const avatar = handleAvatarUpload(req.file);
      const newProfile = await Profile.create({
        ...parsed.data,
        userId: req.user.id,
        ...(avatar && { avatar }),
      });

      res.status(StatusCodes.CREATED).json({ profile: newProfile });
    } catch (err) {
      console.error(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error while creating profile", err });
    }
  }
);

// ✅ GET PROFILE
profileRoute.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.id;
      const profile = await Profile.findOne({ userId }).select("-__v");
      if (!profile) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Profile not found" });
      }
      res.status(StatusCodes.OK).json(profile);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

// ✅ UPDATE PROFILE (name editable + avatar remove/add)
profileRoute.put(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const { name, gender, age, bio, skills, role, languages } = req.body;

      let avatar;
      if (req.file) {
        avatar = handleAvatarUpload(req.file);
      } else if (req.body.avatar === "") {
        avatar = ""; // ✅ Remove avatar from DB
      }

      // ✅ Update name in User collection also
      if (name) {
        await User.findByIdAndUpdate(userId, { name });
      }

      const updatedProfile = await Profile.findOneAndUpdate(
        { userId },
        {
          $set: {
            ...(name && { name }),
            ...(avatar !== undefined && { avatar }),
            ...(gender && { gender }),
            ...(age !== undefined && { age }),
            ...(bio && { bio }),
            ...(skills
              ? {
                  skills: Array.isArray(skills)
                    ? skills
                    : skills.split(",").map((s: string) => s.trim()),
                }
              : {}),
            ...(role && { role }),
            ...(languages
              ? {
                  languages: Array.isArray(languages)
                    ? languages
                    : languages.split(",").map((l: string) => l.trim()),
                }
              : {}),
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedProfile) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Profile not found" });
      }

      res.status(StatusCodes.OK).json(updatedProfile);
    } catch (err) {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }
);

export default profileRoute;
