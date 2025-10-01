import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  roomId: string;
  creator: mongoose.Types.ObjectId;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    roomId: { type: String, unique: true, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
  },
  { timestamps: true }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);

export default Room;
