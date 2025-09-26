import express from "express";
import {Socket , Server} from "socket.io";
import http, { createServer } from "http";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import mongoose from "mongoose";
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server , {
    cors:{
        origin:"*"
    }
});

io.on("connection" , (socket:Socket)=>{
    console.log("a user connected succesfully");


})

app.use("api/v0/user" , userRoutes);
app.use("api/v0/room",roomRoutes);

const port = process.env.PORT || 8000
const MONGO_URI = process.env.MONGO_URI as string || "mongodb://127.0.0.1:27017/meshspire"
// connecting to mongoDB
mongoose.connect(MONGO_URI)
.then(()=>console.log("successfully connected to mongoDB"))
.catch((err)=>{console.log(`error while connecting mongoDB ${err}`)})

server.listen(port , ()=>{
    console.log("listening to port" , port)
})
