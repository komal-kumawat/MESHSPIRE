import { NextFunction, Response, Router } from "express";
import { z } from "zod";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import Profile from "../models/profile.model";

const profileRoute = Router();

const profileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    avatar: z.string().url().optional(),
    gender: z.enum(["male", "female", "other"], {
        message: "Gender must be male, female, or other",
    }),

    age: z.number().min(5, "Age must be at least 5").max(120).optional(),
    bio: z.string().max(300).optional(),
    skills: z.array(z.string()).default([]),
    role: z.enum(["student", "teacher"], {
        message: "Role must be student or teacher"
    }),
    languages: z.array(z.string()).default([]),
});


profileRoute.post("/create", authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });

        }
        const parsed = profileSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: parsed.error, message: "wrong credentials" })
        }
        const existingProfile = await Profile.findOne({ userId: req.user.id })
        if (existingProfile) {
            return res.status(StatusCodes.CONFLICT).json({ "message": "profile already exist" });
        }

        const newProfile = await Profile.create({
            ...parsed.data, userId: req.user.id
        });

        res.status(StatusCodes.CREATED).json({ profile: newProfile });

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error while creating profile", err })
    }
})


profileRoute.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const profileId = req.params.id;
        const profile = await Profile.findById(profileId).select("-__v");
        if (!profile) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "profile does not exist" });
        }
        res.status(StatusCodes.OK).json(profile);


    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
});

profileRoute.put("/update", authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json("profile not found")
        }
        const {
            name,
            avatar,
            gender,
            age,
            bio,
            skills,
            role,
            languages,
        } = req.body;

        const updatedProfile = await Profile.findByIdAndUpdate(
            userId,
            {
                $set: {
                    ...(name && { name }),
                    ...(avatar && { avatar }),
                    ...(gender && { gender }),
                    ...(age !== undefined && { age }),
                    ...(bio && { bio }),
                    ...(skills && { skills }),
                    ...(role && { role }),
                    ...(languages && { languages }),
                },
            },
            { new: true, runValidators: true }
        );

        if(!updatedProfile){
            return res.status(StatusCodes.NOT_FOUND).json({
                message:"Profile not found"
            });
        }
        res.status(StatusCodes.OK).json(updatedProfile);
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
})

export default profileRoute;

