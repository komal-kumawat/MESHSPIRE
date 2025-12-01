import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import Profile from "../models/profile.model";
import User from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { handleUpload } from "./avatarUpload";

// Validation schema
const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  avatar: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  age: z.number().min(5, "Age must be at least 5").max(120).optional(),
  bio: z.string().max(300).optional(),
  skills: z.array(z.string()).optional(),
  role: z.enum(["student", "teacher"]).optional(),
  languages: z.array(z.string()).optional(),
  experience: z.number().min(0).optional(),
  subjects: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0).optional(),
  qualification: z.array(z.string()).optional(),
  document: z.array(z.string()).optional(),
  resume: z.string().optional(),
});

export class ProfileController {
  // Create a new profile
  static async createProfile(req: AuthRequest, res: Response) {
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

      const avatar = handleUpload(req.file);
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

  // Get profile by user ID
  static async getProfile(req: AuthRequest, res: Response) {
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
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }

  // Update profile
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const {
        name,
        gender,
        age,
        bio,
        skills,
        role,
        languages,
        experience,
        subjects,
        hourlyRate,
        qualification,
      } = req.body;

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const avatarFile = files?.avatar?.[0];
      const documentFiles = files?.document;
      const resumeFile = files?.resume?.[0];

      // Convert files → base64 strings
      let avatar = avatarFile ? handleUpload(avatarFile) : undefined;
      let resume = resumeFile ? handleUpload(resumeFile) : undefined;

      let document: string[] = [];
      if (documentFiles && documentFiles.length > 0) {
        document = documentFiles
          .map((file) => handleUpload(file))
          .filter((d): d is string => typeof d === "string");
      }

      // Update name in User collection also
      if (name) {
        await User.findByIdAndUpdate(userId, { name });
      }

      const existingProfile = await Profile.findOne({ userId });

      let updatedDocuments: string[] = [];

      if (
        existingProfile?.document &&
        Array.isArray(existingProfile.document)
      ) {
        updatedDocuments = [...existingProfile.document]; // keep existing documents
      }

      if (document.length > 0) {
        updatedDocuments = [...updatedDocuments, ...document]; // append new documents
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

            // tutor-only fields:
            ...(experience && { experience: Number(experience) }),
            ...(hourlyRate && { hourlyRate: Number(hourlyRate) }),
            ...(qualification && { qualification }),
            subjects:
              subjects === ""
                ? []
                : subjects.split(",").map((s: string) => s.trim()),

            ...(document.length > 0 && { document: updatedDocuments }),
            ...(resume && { resume }),
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
}
