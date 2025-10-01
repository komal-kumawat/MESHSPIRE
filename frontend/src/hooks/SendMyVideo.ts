import { Socket } from "socket.io-client";

interface PeerConnections {
  [key: string]: RTCPeerConnection;
}

interface SendVideoOptions {
  localStream: MediaStream | null;
  peerConnections: PeerConnections;
  socket: Socket;
  roomId?: string;
}

export const sendMyVideo = ({ localStream, peerConnections, socket, roomId }: SendVideoOptions) => {
  if (!localStream) return;

  Object.entries(peerConnections).forEach(([socketId, pc]) => {
    // Add local tracks if not already added
    if (pc.getSenders().length === 0) {
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    }

    // Create and send offer
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer).then(() => offer))
      .then((offer) => socket.emit("offer", { target: socketId, offer }))
      .catch((err) => console.error("Error creating offer:", err));
  });

  // Optional server notification
  if (roomId) socket.emit("send-my-video", { roomId });
};
