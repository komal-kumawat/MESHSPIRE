import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import Payment from "../models/payment.model";
import Lesson from "../models/LessonModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover",
});

export class PaymentController {
  // Create Stripe Checkout Session
  static async createCheckoutSession(req: Request, res: Response) {
    try {
      const { tutorId, lessonId } = req.body;
      const userId = (req as any).user?.id || (req as any).user?._id;

      if (!userId || !tutorId || !lessonId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Missing required fields: userId, tutorId, or lessonId",
        });
      }

      // 🔹 Hardcode amount to 0 for testing
      const amount = 0;

      // Ensure CLIENT_URL has proper scheme
      const clientUrl =
        process.env.CLIENT_URL || "https://meshspire.vercel.app";
      const baseUrl = clientUrl.startsWith("http")
        ? clientUrl
        : `https://${clientUrl}`;

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
        success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/payment-failed`,
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

      return res.status(StatusCodes.OK).json({ url: session.url });
    } catch (err: any) {
      console.error("Stripe session error:", err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Stripe session error", error: err.message });
    }
  }

  // Verify payment
  static async verifyPayment(req: Request, res: Response) {
    try {
      const { session_id } = req.query;

      if (!session_id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "No session_id provided" });
      }

      const session = await stripe.checkout.sessions.retrieve(
        session_id as string
      );

      if (session.payment_status !== "paid") {
        await Payment.findOneAndUpdate(
          { stripeSessionId: session_id },
          { status: "failed" }
        );
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Payment failed" });
      }

      // Update payment as completed
      const payment = await Payment.findOneAndUpdate(
        { stripeSessionId: session_id },
        { status: "completed", stripePaymentIntentId: session.payment_intent },
        { new: true }
      );

      // Mark lesson as paid
      await Lesson.findByIdAndUpdate(payment?.lessonId, { isPaid: true });

      return res
        .status(StatusCodes.OK)
        .json({ message: "Payment success", payment });
    } catch (err) {
      console.error("Payment verification error:", err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Payment verification error" });
    }
  }
}
