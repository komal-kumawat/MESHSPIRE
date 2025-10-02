import { Server, Socket } from "socket.io";

// Map roomId -> array of socket IDs
const roomToSockets: Map<string, string[]> = new Map();
// Map socketId -> roomId
const socketToRoom: Map<string, string> = new Map();

export function RoomController(io: Server, socket: Socket) {
  console.log("Socket connected:", socket.id);

  /** Join a room */
  socket.on("join-room", ({ roomId }: { roomId: string }) => {
    if (!roomId) return;

    // Create room if doesn't exist
    if (!roomToSockets.has(roomId)) roomToSockets.set(roomId, []);
    const sockets = roomToSockets.get(roomId)!;

    // Avoid duplicates
    if (!sockets.includes(socket.id)) sockets.push(socket.id);

    socketToRoom.set(socket.id, roomId);
    socket.join(roomId);

    console.log(`Socket ${socket.id} joined room ${roomId}`);

    // Notify others in the room about the new participant
    sockets.forEach((socketId) => {
      if (socketId !== socket.id) {
        io.to(socketId).emit("new-participant", { socketId: socket.id });
      }
    });
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
  // We don't trust client roomId; server uses socketToRoom
  socket.on("send-my-video", () => {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;

    const socketsInRoom = roomToSockets.get(roomId) || [];
    socketsInRoom.forEach((socketId) => {
      if (socketId !== socket.id) {
        io.to(socketId).emit("new-participant", { socketId: socket.id });
      }
    });
  });

  /** Leave room manually */
  socket.on("leave-room", () => {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;
    leaveRoom(socket.id, roomId);
  });

  /** Handle disconnect */
  socket.on("disconnect", () => {
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) return;
    leaveRoom(socket.id, roomId);
  });

  /** Helper function to remove a socket from a room */
  function leaveRoom(socketId: string, roomId: string) {
    const sockets = roomToSockets.get(roomId);
    if (!sockets) return;

    const index = sockets.indexOf(socketId);
    if (index > -1) sockets.splice(index, 1);

    // Notify remaining participants
    sockets.forEach((sId) => {
      io.to(sId).emit("partner-left", { socketId });
    });

    if (sockets.length === 0) roomToSockets.delete(roomId);
    socketToRoom.delete(socketId);

    socket.leave(roomId);
    console.log(`Socket ${socketId} left room ${roomId}`);
  }
}
