import { Router } from "express";
import passport from "passport";
import "../config/passport.config";
import { UserController } from "../controller/user.controller";

const router = Router();

// User authentication routes
router.post("/signup", UserController.signup);
router.post("/signin", UserController.signin);

// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  UserController.googleCallback
);

// Get current authenticated user
router.get("/me", UserController.getCurrentUser);

export default router;
