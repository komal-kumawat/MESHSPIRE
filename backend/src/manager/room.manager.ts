import { v4 as uuidv4 } from "uuid";

export class RoomManager {
  private rooms = new Map<string, Set<string>>();

  createRoom(): string {
    const id = uuidv4();
    this.rooms.set(id, new Set());
    return id;
  }

  hasRoom(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  addPeer(roomId: string, socketId: string): void {
    const set = this.rooms.get(roomId);
    if (!set) return;
    set.add(socketId);
  }

  removePeer(roomId: string, socketId: string): void {
    const set = this.rooms.get(roomId);
    if (!set) return;
    set.delete(socketId);
    if (set.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  getPeers(roomId: string): string[] {
    return Array.from(this.rooms.get(roomId) ?? []);
  }
}
