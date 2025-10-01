import { Server, Socket } from "socket.io";

// roomId -> socket IDs
const roomToSockets: Map<string, string[]> = new Map();
const socketToRoom: Map<string, string> = new Map();

export function RoomController(io: Server, socket: Socket) {
  console.log("Socket connected:", socket.id);

  /** Join a room */
  socket.on("join-room", ({ roomId }: { roomId: string }) => {
    if (!roomId) return;

    if (!roomToSockets.has(roomId)) roomToSockets.set(roomId, []);
    const sockets = roomToSockets.get(roomId)!;

    sockets.push(socket.id);
    socketToRoom.set(socket.id, roomId);
    socket.join(roomId);

    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  /** Handle offer */
  socket.on("offer", ({ target, offer }: { target: string; offer: RTCSessionDescriptionInit }) => {
    io.to(target).emit("offer", { from: socket.id, offer });
  });

  /** Handle answer */
  socket.on("answer", ({ target, answer }: { target: string; answer: RTCSessionDescriptionInit }) => {
    io.to(target).emit("answer", { from: socket.id, answer });
  });

  /** Handle ICE candidate */
  socket.on("ice-candidate", ({ target, candidate }: { target: string; candidate: RTCIceCandidateInit }) => {
    io.to(target).emit("ice-candidate", { from: socket.id, candidate });
  });

  /** User clicks "Send My Video" */
  socket.on("send-my-video", ({ roomId }: { roomId: string }) => {
    const socketsInRoom = roomToSockets.get(roomId) || [];
    socketsInRoom.forEach((socketId) => {
      if (socketId !== socket.id) {
        io.to(socketId).emit("new-participant", { socketId: socket.id });
      }
    });
  });

  /** Disconnect */
  socket.on("disconnect", () => {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;

    const sockets = roomToSockets.get(roomId);
    if (!sockets) return;

    const index = sockets.indexOf(socket.id);
    if (index > -1) sockets.splice(index, 1);

    if (sockets.length === 1) io.to(sockets[0]).emit("partner-left");
    if (sockets.length === 0) roomToSockets.delete(roomId);
    socketToRoom.delete(socket.id);

    console.log("Socket disconnected:", socket.id);
  });
}