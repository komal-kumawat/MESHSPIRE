import express, { Request, Response } from "express";
import Stripe from "stripe";
import Payment from "../models/payment.model";
import Lesson from "../models/LessonModel";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover",
});

// Create Stripe Checkout Session
router.post("/create-checkout-session", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, tutorId, lessonId } = req.body;
    

    // 🔹 Hardcode amount to 0 for testing
    const amount = 0;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Lesson Payment" },
            unit_amount: Math.round(amount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
    });

    // Save payment record as pending
    await Payment.create({
      userId,
      tutorId,
      lessonId,
      amount,
      currency: "usd",
      stripeSessionId: session.id,
      status: "pending",
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ message: "Stripe session error", error: err.message });
  }
});

// Verify payment
router.get("/verify", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ message: "No session_id provided" });

    const session = await stripe.checkout.sessions.retrieve(session_id as string);

    if (session.payment_status !== "paid") {
      await Payment.findOneAndUpdate({ stripeSessionId: session_id }, { status: "failed" });
      return res.status(400).json({ message: "Payment failed" });
    }

    // Update payment as completed
    const payment = await Payment.findOneAndUpdate(
      { stripeSessionId: session_id },
      { status: "completed", stripePaymentIntentId: session.payment_intent },
      { new: true }
    );

    // Mark lesson as paid
    await Lesson.findByIdAndUpdate(payment?.lessonId, { isPaid: true });

    return res.json({ message: "Payment success", payment });
  } catch (err) {
    console.error("Payment verification error:", err);
    return res.status(500).json({ message: "Payment verification error" });
  }
});

export default router;
