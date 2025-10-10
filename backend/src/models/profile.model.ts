import mongoose from "mongoose";

export interface IProfile extends Document{
    userId: mongoose.Types.ObjectId;  
    name:string;
    avatar?:string;
    gender:"male"|"female"|"other" ;
    age?:number;
    bio?:string;
    skills?:string[];
    role?:'student'|'teacher';
    languages:string[]

}
const ProfileSchema = new mongoose.Schema<IProfile>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    name:{type:String , required:true , minlength:3},
    avatar:{type:String},
    gender:{type:String , enum:["male","female","other"]},
    age:{type:Number},
    bio:{type:String},
    skills:{type:[String]},
    role:{type:String , enum:["teacher","student"]},
    languages:{type:[String]}
})

const Profile = mongoose.model<IProfile>("Profile",ProfileSchema);
export default Profile;