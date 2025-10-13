import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.googleId;
      },
    },
    avatarUrl: { type: String },
    googleId: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
