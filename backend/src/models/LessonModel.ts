import mongoose from "mongoose";

export interface IConfirmedTutor {
  tutorId:
    | mongoose.Types.ObjectId
    | { _id: mongoose.Types.ObjectId; name: string; email: string };
  confirmedAt: Date;
}

export interface ILesson extends Document {
  tutorId: mongoose.Types.ObjectId;
  studentId?:
    | mongoose.Types.ObjectId
    | { _id: mongoose.Types.ObjectId; name: string; email: string };
  topic: string;
  subTopic?: string;
  subject: string;
  class: string;
  date: string;
  time: string;
  status: "scheduled" | "cancelled";
  confirmedTutors: IConfirmedTutor[];
  isPaid?: boolean;
}

const LessonSchema = new mongoose.Schema<ILesson>(
  {
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    topic: { type: String, required: true },
    subTopic: { type: String },
    subject: { type: String, required: true },
    class: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },

    status: {
      type: String,
      enum: ["scheduled", "cancelled"],
      default: "scheduled",
      required: true,
    },
    confirmedTutors: [
      {
        tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        confirmedAt: { type: Date, default: Date.now },
      },
    ],
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Lesson = mongoose.model<ILesson>("Lesson", LessonSchema);
export default Lesson;
