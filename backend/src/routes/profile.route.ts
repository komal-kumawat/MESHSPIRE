import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import multer from "multer";
import { ProfileController } from "../controller/profile.controller";

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

export default profileRoute;
