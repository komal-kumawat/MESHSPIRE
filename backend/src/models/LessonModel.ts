import mongoose from "mongoose";

export interface ILesson extends Document {
  tutorId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  topic: string;
  subTopic?: string;
  subject: string;
  class: string;
  date: string;
  time: string;
  status: "scheduled" | "cancelled";
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
  },
  { timestamps: true }
);

const Lesson = mongoose.model<ILesson>("Lesson", LessonSchema);
export default Lesson;
