import mongoose, { Document } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;         
  tutorId: mongoose.Types.ObjectId;        
  lessonId: mongoose.Types.ObjectId;       
  amount: number;                          
  currency: string;                        
  status: "pending" | "completed" | "failed";
  stripeSessionId?: string;                
  stripePaymentIntentId?: string;         
  transactionDate: Date;
}

const PaymentSchema = new mongoose.Schema<IPayment>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },

    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },

    transactionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
