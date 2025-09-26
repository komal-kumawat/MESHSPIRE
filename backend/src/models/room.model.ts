import mongoose, { Schema } from "mongoose";
import type { string } from "zod";
import { User } from "./user.model.js";
export interface IRoom extends Document{
    roomId:string ;
    creator:mongoose.Types.ObjectId;
    title:string;
    createdAt:Date;
}

const RoomSchema = new Schema<IRoom>({
    roomId:{type:String , unique:true , required:true},
    creator:{type:Schema.Types.ObjectId , ref:User , required:true},
    title:{type:String , default :"new meeting"},

} , {timestamps:true});


const Room = mongoose.model<IRoom>("Room", RoomSchema);
export default Room;