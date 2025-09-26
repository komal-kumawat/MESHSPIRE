import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000"; // replace with your backend URL

const VideoCall: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  // Initialize Peer Connection
  const createPeerConnection = () => {
    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate && socket && roomId) {
        socket.emit("add-ice-candidate", {
          candidate: event.candidate,
          roomId,
        });
      }
    };

    pcRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => pcRef.current!.addTrack(track, stream));
    });
  };

  // Connect to Socket.IO server
  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    s.on("send-offer", ({ roomId }) => {
      setRoomId(roomId);
      if (!pcRef.current) createPeerConnection();
    });

    s.on("wait-offer", ({ roomId }) => {
      setRoomId(roomId);
      if (!pcRef.current) createPeerConnection();
    });

    s.on("offer", async ({ sdp, roomId: rId }) => {
      if (!pcRef.current) createPeerConnection();
      await pcRef.current!.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pcRef.current!.createAnswer();
      await pcRef.current!.setLocalDescription(answer);
      s.emit("answer", { sdp: answer, roomId: rId });
    });

    s.on("answer", async ({ sdp }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    s.on("add-ice-candidate", async ({ candidate }) => {
      if (!pcRef.current) return;
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      s.disconnect();
    };
  }, []);

  // Join a room by meeting code
  const joinRoom = () => {
    if (!socket || !roomIdInput) return;
    setRoomId(roomIdInput);
    setConnected(true);
    createPeerConnection();
    socket.emit("join-room", { roomId: roomIdInput });
  };

  // Start call (create offer)
  const startCall = async () => {
    if (!pcRef.current || !socket || !roomId) return;
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { sdp: offer, roomId });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {!connected ? (
        <div>
          <h2>Enter Meeting Code</h2>
          <input
            type="text"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            placeholder="Meeting Code"
          />
          <button onClick={joinRoom} style={{ marginLeft: "10px" }}>
            Join Room
          </button>
        </div>
      ) : (
        <div>
          <h2>Room: {roomId}</h2>
          <button onClick={startCall} style={{ marginBottom: "10px" }}>
            Start Call
          </button>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <div>
              <h4>Your Video</h4>
              <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "300px" }} />
            </div>
            <div>
              <h4>Peer Video</h4>
              <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "300px" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
