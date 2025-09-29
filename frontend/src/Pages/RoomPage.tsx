import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "../providers/SocketProvider";
import { useParams } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext";

interface PendingCandidates {
  [socketId: string]: RTCIceCandidateInit[];
}

const Room: React.FC = () => {
  const { socket } = useSocket();
  // const { username } = useAuth();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const { roomid: roomId } = useParams<{ roomid: string }>();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<{ [key: string]: RTCPeerConnection }>({});
  const pendingCandidates = useRef<PendingCandidates>({});

  // Get camera/mic immediately
  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      console.error("Unable to access camera/microphone:", err);
      return null;
    }
  }, []);

  // Join room on mount
  useEffect(() => {
    if (!roomId) return;

    getUserMediaStream().then((stream) => {
      if (!stream) return;
      socket.emit("join-room", { roomId });
    });
  }, [roomId, getUserMediaStream, socket]);

  // Handle new participant: create peer connection (tracks added only after sendMyVideo)
  const createPeerConnection = useCallback((socketId: string) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("ice-candidate", { target: socketId, candidate: e.candidate });
    };

    setPeerConnections((prev) => ({ ...prev, [socketId]: pc }));
    return pc;
  }, [socket]);

  useEffect(() => {
    socket.on("new-participant", ({ socketId }) => {
      if (!peerConnections[socketId]) {
        createPeerConnection(socketId);
      }
    });

    return () => {
      socket.off("new-participant");
    };
  }, [socket, peerConnections, createPeerConnection]);

  // Receive offer
  useEffect(() => {
    socket.on("offer", async ({ from, offer }) => {
      let pc = peerConnections[from];
      if (!pc) pc = createPeerConnection(from);

      await pc.setRemoteDescription(offer);

      // Apply any queued ICE candidates
      if (pendingCandidates.current[from]) {
        for (const c of pendingCandidates.current[from]) {
          await pc.addIceCandidate(c);
        }
        delete pendingCandidates.current[from];
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { target: from, answer });
    });

    return () => {socket.off("offer");}
  }, [socket, peerConnections, createPeerConnection]);

  // Receive answer
  useEffect(() => {
    socket.on("answer", async ({ from, answer }) => {
      const pc = peerConnections[from];
      if (!pc) return;

      await pc.setRemoteDescription(answer);

      // Apply any queued ICE candidates
      if (pendingCandidates.current[from]) {
        for (const c of pendingCandidates.current[from]) {
          await pc.addIceCandidate(c);
        }
        delete pendingCandidates.current[from];
      }
    });

    return () => {socket.off("answer");}
  }, [peerConnections, socket]);

  // Receive ICE candidates
  useEffect(() => {
    socket.on("ice-candidate", async ({ from, candidate }) => {
      const pc = peerConnections[from];
      if (!pc) {
        // Queue candidate until pc exists
        if (!pendingCandidates.current[from]) pendingCandidates.current[from] = [];
        pendingCandidates.current[from].push(candidate);
        return;
      }

      if (pc.remoteDescription) {
        await pc.addIceCandidate(candidate);
      } else {
        // Queue if remote description not set yet
        if (!pendingCandidates.current[from]) pendingCandidates.current[from] = [];
        pendingCandidates.current[from].push(candidate);
      }
    });

    return () => {socket.off("ice-candidate");}
  }, [peerConnections, socket]);

  // Send my video: add tracks and create offers
  const sendMyVideo = () => {
    if (!localStream) return;

    Object.entries(peerConnections).forEach(([socketId, pc]) => {
      if (pc.getSenders().length === 0) {
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      }

      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer);
        socket.emit("offer", { target: socketId, offer });
      });
    });

    if (roomId) socket.emit("send-my-video", { roomId });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gray-100">
      <div className="flex gap-4 mb-4 w-full max-w-4xl">
        {/* Local video */}
        <div className="w-1/2 relative">
          <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg bg-black" />
        </div>

        {/* Remote video */}
        <div className="w-1/2 relative">
          <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded z-10">Partner</div>
          <video ref={remoteVideoRef} autoPlay className="w-full rounded-lg bg-black" />
        </div>
      </div>

      <button
        onClick={sendMyVideo}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500"
      >
        Send My Video
      </button>
    </div>
  );
};

export default Room;
