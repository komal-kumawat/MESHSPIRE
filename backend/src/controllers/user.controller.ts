import { Socket } from "socket.io";
import { RoomManager } from "../managers/RoomManager.js";
import { UserManager } from "../managers/UserManager.js";

const roomManager = new RoomManager();
const userManager = new UserManager(roomManager);

export const handleUserConnection = (socket: Socket) => {
  socket.on("join-lobby", ({ name }: { name: string }) => {
    userManager.addUser(name, socket);
  });

  socket.on("create-room", () => {
    const user = userManager.getUser(socket.id);
    if (!user) return;
    const roomId = roomManager.createRoom(user);
    socket.emit("room-created", { roomId });
  });

  socket.on("join-room", ({ roomId }: { roomId: string }) => {
    const user = userManager.getUser(socket.id);
    if (!user) return;

    const joined = roomManager.joinRoom(user, roomId);
    if (!joined) {
      socket.emit("error", { message: "Room not found or full" });
    }
  });

  socket.on("offer", ({ sdp, roomId }) => roomManager.onOffer(roomId, sdp, socket.id));
  socket.on("answer", ({ sdp, roomId }) => roomManager.onAnswer(roomId, sdp, socket.id));
  socket.on("add-ice-candidate", ({ candidate, roomId, type }) =>
    roomManager.onIceCandidates(roomId, socket.id, candidate, type)
  );

  socket.on("disconnect", () => userManager.removeUser(socket.id));
};
