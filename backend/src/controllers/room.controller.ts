import { Socket } from "socket.io";
import { RoomManager } from "../managers/RoomManager.js";

const roomManager = new RoomManager();

export const handleRoomSignals = (socket: Socket) => {
  socket.on("offer", ({ sdp, roomId }: { sdp: any; roomId: string }) => {
    roomManager.onOffer(roomId, sdp, socket.id);
  });

  socket.on("answer", ({ sdp, roomId }: { sdp: any; roomId: string }) => {
    roomManager.onAnswer(roomId, sdp, socket.id);
  });

  socket.on(
    "add-ice-candidate",
    ({ candidate, roomId, type }: { candidate: any; roomId: string; type: "sender" | "receiver" }) => {
      roomManager.onIceCandidates(roomId, socket.id, candidate, type);
    }
  );
};
