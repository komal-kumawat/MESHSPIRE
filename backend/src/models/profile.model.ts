import mongoose from "mongoose";

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  avatar?: string;
  gender: "male" | "female" | "other";
  age?: number;
  bio?: string;
  skills: string[];
  role: "student" | "tutor";
  languages: string[];

  // tutor only fields
  experience?:number;
  subjects?: string[];
  hourlyRate?: number;
  qualification?: string;
  document?: string; 
  resume?: string;   

}
const ProfileSchema = new mongoose.Schema<IProfile>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, minlength: 3 },
  avatar: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
  age: { type: Number },
  bio: { type: String },
  skills: { type: [String] },
  role: {
    type: String,
    enum: ["tutor", "student"],
    default: "student",
    required: true,
  },
  languages: { type: [String] },
  experience: {
      type: Number,
      
      default:0
    },

    subjects: {
      type: [String],
      
    },

    hourlyRate: {
      type: Number,
      
    },

    qualification: {
      type: String,
      
    },

    document: {
      type: [String], // URL to uploaded document

    },

    resume: {
      type: String, // URL to uploaded resume file
      
    },
  },
{timestamps:true});

const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
export default Profile;
