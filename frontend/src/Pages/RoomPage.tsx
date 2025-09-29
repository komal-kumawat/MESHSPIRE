import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "../providers/SocketProvider";
import { useParams } from "react-router-dom";

interface PendingCandidates {
  [socketId: string]: RTCIceCandidateInit[];
}

const Room: React.FC = () => {
  const { socket } = useSocket();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const { roomid: roomId } = useParams<{ roomid: string }>();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<{ [key: string]: RTCPeerConnection }>({});
  const pendingCandidates = useRef<PendingCandidates>({});

  // Get camera/mic
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

  // Create peer connection
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

  // Handle new participants
  useEffect(() => {
    const handleNewParticipant = ({ socketId }: { socketId: string }) => {
      if (!peerConnections[socketId]) createPeerConnection(socketId);
    };

    socket.on("new-participant", handleNewParticipant);
    return () => {socket.off("new-participant", handleNewParticipant);}
  }, [socket, peerConnections, createPeerConnection]);

  // Handle incoming offer
  useEffect(() => {
    const handleOffer = async ({ from, offer }: any) => {
      let pc = peerConnections[from];
      if (!pc) pc = createPeerConnection(from);

      await pc.setRemoteDescription(offer);

      // Apply queued ICE candidates
      if (pendingCandidates.current[from]) {
        for (const c of pendingCandidates.current[from]) {
          await pc.addIceCandidate(c);
        }
        delete pendingCandidates.current[from];
      }

      // Add local tracks if not added
      if (localStream && pc.getSenders().length === 0) {
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { target: from, answer });
    };

    socket.on("offer", handleOffer);
    return () => {socket.off("offer", handleOffer);}
  }, [socket, peerConnections, createPeerConnection, localStream]);

  // Handle incoming answer
  useEffect(() => {
    const handleAnswer = async ({ from, answer }: any) => {
      const pc = peerConnections[from];
      if (!pc) return;

      await pc.setRemoteDescription(answer);

      // Apply queued ICE candidates
      if (pendingCandidates.current[from]) {
        for (const c of pendingCandidates.current[from]) {
          await pc.addIceCandidate(c);
        }
        delete pendingCandidates.current[from];
      }
    };

    socket.on("answer", handleAnswer);
    return () => {socket.off("answer", handleAnswer);}
  }, [peerConnections, socket]);

  // Handle incoming ICE candidates
  useEffect(() => {
    const handleIceCandidate = async ({ from, candidate }: any) => {
      const pc = peerConnections[from];
      if (!pc) {
        if (!pendingCandidates.current[from]) pendingCandidates.current[from] = [];
        pendingCandidates.current[from].push(candidate);
        return;
      }

      if (pc.remoteDescription) await pc.addIceCandidate(candidate);
      else {
        if (!pendingCandidates.current[from]) pendingCandidates.current[from] = [];
        pendingCandidates.current[from].push(candidate);
      }

    };

    socket.on("ice-candidate", handleIceCandidate);
    return () => {socket.off("ice-candidate", handleIceCandidate);}
  }, [peerConnections, socket]);

  // Send my video to all participants
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
<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
  <div className="w-full max-w-5xl flex flex-col items-center gap-6">
    {/* Room ID */}
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Room ID: {roomId}</h1>

    {/* Video Section */}
    <div className="flex flex-col sm:flex-row gap-6 w-full">
      {/* Local Video */}
      <div className="relative w-full md:w-1/2 shadow-lg rounded-lg overflow-hidden">
        <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded z-10 font-semibold">
          You
        </div>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="w-full h-64 md:h-96 object-cover bg-black rounded-lg"
        />
      </div>

      {/* Remote Video */}
      <div className="relative w-full md:w-1/2 shadow-lg rounded-lg overflow-hidden">
        <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded z-10 font-semibold">
          Partner
        </div>
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-full h-64 md:h-96 object-cover bg-black rounded-lg"
        />
      </div>
    </div>

    {/* Send Video Button */}
    <button
      onClick={sendMyVideo}
      className="mt-4 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 active:scale-95 transition transform duration-200 shadow-md font-semibold"
    >
      Send My Video
    </button>
  </div>
</div>


  );
};

export default Room;
