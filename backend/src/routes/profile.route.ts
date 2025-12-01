import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import multer from "multer";
import { ProfileController } from "../controller/profile.controller";
import Profile from "../models/profile.model";
import { StatusCodes } from "http-status-codes";

const profileRoute = Router();
const upload = multer();

// Profile routes
profileRoute.post(
  "/create",
  authMiddleware,
  upload.single("avatar"),
  ProfileController.createProfile
);

profileRoute.get("/:id", authMiddleware, ProfileController.getProfile);

profileRoute.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "document", maxCount: 10 },
    { name: "resume", maxCount: 1 },
  ]),
  ProfileController.updateProfile
);

//Public tutor profile
profileRoute.get("/tutor/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const profile = await Profile.findOne({ userId }).select("-__v -email");
    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Profile not found" });
    }
    res.status(StatusCodes.OK).json(profile);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
});

export default profileRoute;
