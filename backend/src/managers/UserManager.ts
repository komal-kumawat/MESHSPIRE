import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager.js";

export interface User {
  socket: Socket;
  name: string;
}

export class UserManager {
  private users: Map<string, User> = new Map();
  private roomManager: RoomManager;

  constructor(roomManager: RoomManager) {
    this.roomManager = roomManager;
  }

  addUser(name: string, socket: Socket) {
    const user: User = { name, socket };
    this.users.set(socket.id, user);

    socket.on("disconnect", () => this.removeUser(socket.id));
  }

  removeUser(socketId: string) {
    this.users.delete(socketId);
  }

  getUser(socketId: string) {
    return this.users.get(socketId);
  }
}
