import { v4 as uuidv4 } from "uuid";
import type { User } from "./UserManager.js";

interface Room {
  user1: User;
  user2?: User; // optional until second joins
}

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  createRoom(user: User): string {
    const roomId = uuidv4();
    this.rooms.set(roomId, { user1: user });
    return roomId;
  }

  joinRoom(user: User, roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room || room.user2) return false; // room doesn't exist or full
    room.user2 = user;

    // Notify first user to start the offer
    room.user1.socket.emit("send-offer", { roomId });
    user.socket.emit("wait-offer", { roomId });
    return true;
  }

  onOffer(roomId: string, sdp: any, senderSocketId: string) {
    const room = this.rooms.get(roomId);
    if (!room || !room.user2) return;
    const receiver = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    receiver.socket.emit("offer", { sdp, roomId });
  }

  onAnswer(roomId: string, sdp: any, senderSocketId: string) {
    const room = this.rooms.get(roomId);
    if (!room || !room.user2) return;
    const receiver = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    receiver.socket.emit("answer", { sdp, roomId });
  }

  onIceCandidates(roomId: string, senderSocketId: string, candidate: any, type: "sender" | "receiver") {
    const room = this.rooms.get(roomId);
    if (!room || !room.user2) return;
    const receiver = room.user1.socket.id === senderSocketId ? room.user2 : room.user1;
    receiver.socket.emit("add-ice-candidate", { candidate, type });
  }
}
