import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000"; // replace with your backend URL

const VideoCall: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const [hoverStart, setHoverStart] = useState(false);
  const [hoverEnd, setHoverEnd] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  // Create peer connection
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

  // Socket.io connection
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

  // Join room
  const joinRoom = () => {
    if (!socket || !roomIdInput) return;
    setRoomId(roomIdInput);
    setConnected(true);
    createPeerConnection();
    socket.emit("join-room", { roomId: roomIdInput });
  };

  // Start call
  const startCall = async () => {
    if (!pcRef.current || !socket || !roomId) return;
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { sdp: offer, roomId });
  };

  // End call
  const endCall = () => {
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => sender.track?.stop());
      pcRef.current.close();
      pcRef.current = null;
    }
    setConnected(false);
    setRoomId(null);

    if (socket && roomId) {
      socket.emit("leave-room", { roomId });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      {!connected ? (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#333" }}>Enter Meeting Code</h2>
          <input
            type="text"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            placeholder="Meeting Code"
            style={{
              padding: "10px",
              width: "200px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginRight: "10px",
            }}
          />
          <button
            onClick={joinRoom}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Join Room
          </button>
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: "900px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Room: {roomId}</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={startCall}
              onMouseEnter={() => setHoverStart(true)}
              onMouseLeave={() => setHoverStart(false)}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: hoverStart ? "#218838" : "#28a745",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 500,
                transition: "background-color 0.3s",
              }}
            >
              Start Call
            </button>

            <button
              onClick={endCall}
              onMouseEnter={() => setHoverEnd(true)}
              onMouseLeave={() => setHoverEnd(false)}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: hoverEnd ? "#c82333" : "#dc3545",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 500,
                transition: "background-color 0.3s",
              }}
            >
              End Call
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <h4 style={{ marginBottom: "10px" }}>Your Video</h4>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  minHeight:"300px",
                  width: "300px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <h4 style={{ marginBottom: "10px" }}>Peer Video</h4>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: "300px",
                  minHeight:"300px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
