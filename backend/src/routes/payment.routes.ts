import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { PaymentController } from "../controller/payment.controller";

const router = express.Router();

// Payment routes
router.post(
  "/create-checkout-session",
  authMiddleware,
  PaymentController.createCheckoutSession
);
router.get("/verify", authMiddleware, PaymentController.verifyPayment);

export default router;
