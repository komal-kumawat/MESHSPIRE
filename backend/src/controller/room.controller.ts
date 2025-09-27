import { Server as IOServer, Socket } from "socket.io";
import { RoomManager } from "../manager/room.manager";

interface SignalPayload {
  to: string;
  sdp?: any;
  candidate?: any;
}

interface JoinRoomPayload {
  roomId: string;
}

export const handleRoomSignals = (
  io: IOServer,
  roomManager: RoomManager,
  socket: Socket
) => {
  const socketRooms = new Set<string>();

  socket.on("join-room", ({ roomId }: JoinRoomPayload) => {
    if (!roomManager.hasRoom(roomId)) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    roomManager.addPeer(roomId, socket.id);
    socketRooms.add(roomId);

    const peers = roomManager.getPeers(roomId).filter((id) => id !== socket.id);

    socket.emit("peers", peers);

    peers.forEach((peerId) => io.to(peerId).emit("peer-joined", socket.id));
  });

  socket.on("offer", ({ to, sdp }: SignalPayload) => {
    io.to(to).emit("offer", { from: socket.id, sdp });
  });

  socket.on("answer", ({ to, sdp }: SignalPayload) => {
    io.to(to).emit("answer", { from: socket.id, sdp });
  });

  socket.on("ice-candidate", ({ to, candidate }: SignalPayload) => {
    io.to(to).emit("ice-candidate", { from: socket.id, candidate });
  });

  socket.on("disconnecting", () => {
    socketRooms.forEach((roomId) => {
      const peers = roomManager
        .getPeers(roomId)
        .filter((id) => id !== socket.id);
      peers.forEach((peerId) => io.to(peerId).emit("peer-left", socket.id));
    });
  });

  socket.on("disconnect", () => {
    socketRooms.forEach((roomId) => {
      roomManager.removePeer(roomId, socket.id);
    });
    socketRooms.clear();
  });
};
