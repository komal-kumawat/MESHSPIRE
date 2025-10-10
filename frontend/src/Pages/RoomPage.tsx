import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../providers/SocketProvider";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

interface PendingCandidates {
  [socketId: string]: RTCIceCandidateInit[];
}

const buttonStyles =
  "w-14 h-14 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-md transition";

const Room: React.FC = () => {
  const { socket } = useSocket();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<{
    [socketId: string]: MediaStream;
  }>({});
  const { roomid: roomIdParam } = useParams<{ roomid: string }>();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const pendingCandidates = useRef<PendingCandidates>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  const [videoOn, setVideoOn] = useState(true);
  const [mute, setMute] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cardData = location.state || {
    title: "Untitled Meeting",
    category: "General",
  };
  const autoSendVideo =
    (location.state && (location.state as any).autoSendVideo) || false;
  const copyRoomId = () => {
    if (roomId) navigator.clipboard.writeText(roomId);
  };
  const [isFullScreen, setIsFullScreen] = useState(false);
  const roomId = roomIdParam || sessionStorage.getItem("currentRoom");

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      console.error("Unable to access camera/microphone:", err);
      return null;
    }
  }, []);

  const joinRoom = useCallback(async () => {
    if (!roomId) return;
    sessionStorage.setItem("currentRoom", roomId);
    const stream = await getUserMediaStream();
    if (stream) socket.emit("join-room", { roomId });
  }, [getUserMediaStream, roomId, socket]);

  useEffect(() => {
    joinRoom();
  }, [joinRoom]);

  const addLocalTracksToPC = useCallback((pc: RTCPeerConnection) => {
    const stream = localStreamRef.current;
    if (!stream || !pc) return;
    const existingSenderTrackIds = new Set(
      pc
        .getSenders()
        .map((s) => s.track?.id)
        .filter(Boolean)
    );
    stream.getTracks().forEach((track) => {
      if (!existingSenderTrackIds.has(track.id)) {
        try {
          pc.addTrack(track, stream);
        } catch (err) {
          console.warn("Warning: addTrack failed (maybe already added):", err);
        }
      }
    });
  }, []);

  const createPeerConnection = useCallback(
    (remoteSocketId: string) => {
      if (peerConnectionsRef.current[remoteSocketId])
        return peerConnectionsRef.current[remoteSocketId];

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      addLocalTracksToPC(pc);

      pc.ontrack = (event) => {
        setRemoteStreams((prev) => {
          const prevStream = prev[remoteSocketId];
          if (event.streams && event.streams[0]) {
            return { ...prev, [remoteSocketId]: event.streams[0] };
          } else {
            if (prevStream) {
              try {
                prevStream.addTrack(event.track);
              } catch (e) {
                console.warn("Could not add track to existing stream:", e);
              }

              return { ...prev };
            } else {
              const newStream = new MediaStream();
              try {
                newStream.addTrack(event.track);
              } catch (e) {
                console.warn("Could not add track to new stream:", e);
              }
              return { ...prev, [remoteSocketId]: newStream };
            }
          }
        });
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            target: remoteSocketId,
            candidate: e.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(
          `Peer ${remoteSocketId} connectionState:`,
          pc.connectionState
        );

        if (
          pc.connectionState === "failed" ||
          pc.connectionState === "disconnected"
        ) {
          console.warn(
            `Connection with ${remoteSocketId} is ${pc.connectionState}`
          );
        }
      };

      peerConnectionsRef.current[remoteSocketId] = pc;
      return pc;
    },
    [addLocalTracksToPC, socket]
  );

  useEffect(() => {
    if (!socket) return;

    const handleNewParticipant = async ({ socketId }: { socketId: string }) => {
      try {
        if (peerConnectionsRef.current[socketId]) return;

        const pc = createPeerConnection(socketId);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { target: socketId, offer: pc.localDescription });
      } catch (err) {
        console.error("handleNewParticipant error:", err);
      }
    };

    const handleOffer = async ({
      from,
      offer,
    }: {
      from: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      try {
        let pc = peerConnectionsRef.current[from];
        if (!pc) {
          pc = createPeerConnection(from);
        }

        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        if (pendingCandidates.current[from]) {
          for (const c of pendingCandidates.current[from]) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(c));
            } catch (e) {
              console.warn("flushing queued candidate failed:", e);
            }
          }
          delete pendingCandidates.current[from];
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { target: from, answer: pc.localDescription });
      } catch (err) {
        console.error("handleOffer error:", err);
      }
    };

    const handleAnswer = async ({
      from,
      answer,
    }: {
      from: string;
      answer: RTCSessionDescriptionInit;
    }) => {
      try {
        const pc = peerConnectionsRef.current[from];
        if (!pc) {
          console.warn("Received answer for unknown pc:", from);
          return;
        }

        await pc.setRemoteDescription(new RTCSessionDescription(answer));

        if (pendingCandidates.current[from]) {
          for (const c of pendingCandidates.current[from]) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(c));
            } catch (e) {
              console.warn("addIceCandidate (after answer) failed:", e);
            }
          }
          delete pendingCandidates.current[from];
        }
      } catch (err) {
        console.error("handleAnswer error:", err);
      }
    };

    const handleIceCandidate = async ({
      from,
      candidate,
    }: {
      from: string;
      candidate: RTCIceCandidateInit;
    }) => {
      try {
        if (!candidate) return;
        const pc = peerConnectionsRef.current[from];
        if (!pc) {
          if (!pendingCandidates.current[from])
            pendingCandidates.current[from] = [];
          pendingCandidates.current[from].push(candidate);
          return;
        }

        const remoteDesc = pc.remoteDescription;
        if (!remoteDesc || !remoteDesc.type) {
          if (!pendingCandidates.current[from])
            pendingCandidates.current[from] = [];
          pendingCandidates.current[from].push(candidate);
          return;
        }

        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.warn("addIceCandidate failed (attempt):", e);

          if (!pendingCandidates.current[from])
            pendingCandidates.current[from] = [];
          pendingCandidates.current[from].push(candidate);
        }
      } catch (err) {
        console.error("handleIceCandidate error:", err);
      }
    };

    socket.on("new-participant", handleNewParticipant);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("new-participant", handleNewParticipant);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [socket, createPeerConnection]);

  const sendMyVideo = useCallback(() => {
    const pcs = peerConnectionsRef.current;
    Object.entries(pcs).forEach(async ([socketId, pc]) => {
      try {
        addLocalTracksToPC(pc);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { target: socketId, offer: pc.localDescription });
      } catch (err) {
        console.error("sendMyVideo error:", err);
      }
    });
  }, [addLocalTracksToPC, socket]);

  useEffect(() => {
    if (autoSendVideo && localStream) {
      setTimeout(() => sendMyVideo(), 200);
    }
  }, [autoSendVideo, localStream, sendMyVideo]);

  const toggleAudio = () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMute(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoOn(videoTrack.enabled);
    }
  };

  const startScreenShare = async () => {
    if (!localStream) return;
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getVideoTracks()[0];
      screenTrackRef.current = screenTrack;

      Object.values(peerConnectionsRef.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);
      });

      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
      setScreenSharing(true);

      screenTrack.onended = () => stopScreenShare();
    } catch (err) {
      console.error("Screen share failed:", err);
    }
  };

  const stopScreenShare = () => {
    if (!localStream || !screenTrackRef.current) return;
    const videoTrack = localStream.getVideoTracks()[0];
    Object.values(peerConnectionsRef.current).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender && videoTrack) sender.replaceTrack(videoTrack);
    });
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
    screenTrackRef.current.stop();
    screenTrackRef.current = null;
    setScreenSharing(false);
  };

  const endCall = () => {
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (screenTrackRef.current) screenTrackRef.current.stop();

    Object.values(peerConnectionsRef.current).forEach((pc) => {
      try {
        pc.close();
      } catch (e) {
        console.warn("Error closing pc:", e);
      }
    });
    peerConnectionsRef.current = {};
    setRemoteStreams({});
    setLocalStream(null);
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (roomId) socket.emit("leave-room", { roomId });
    sessionStorage.removeItem("currentRoom");
    navigate("/dashboard");
  };

  // reconnect handling
  // @ts-ignore
  useEffect(() => {
    const handleReconnect = () => joinRoom();
    socket.on("connect", handleReconnect);
    return () => socket.off("connect", handleReconnect);
  }, [socket, joinRoom]);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      <div className="flex items-center gap-4 text-gray-300 mb-6">
        <div className="flex ml-4 mt-4 text-white">
          <span className="text-3xl font-semibold">{cardData.title}</span>
        </div>
        <h3
          className="text-2xl font-bold ml-4 mt-4 cursor-pointer hover:text-violet-400 transition"
          onClick={copyRoomId}
        >
          Room ID: {roomId}
        </h3>
      </div>

      {Object.entries(remoteStreams).map(([id, stream]) => (
        <div
          key={id}
          className={`absolute transition-all duration-300 border-2 border-gray-200 ${
            isFullScreen
              ? "bottom-4 right-4 w-1/4 h-1/4"
              : "top-18 left-4 w-5/7 h-5/7"
          } shadow-2xl rounded-2xl overflow-hidden`}
        >
          <video
            autoPlay
            playsInline
            ref={(video) => {
              if (!video) return;

              if (video.srcObject !== stream) video.srcObject = stream;
            }}
            className="w-full h-full object-cover bg-black rounded-2xl"
          />
        </div>
      ))}

      <div
        className={`absolute transition-all duration-300 border-2 border-gray-200 ${
          isFullScreen
            ? "top-18 left-4 w-5/7 h-5/7"
            : "bottom-4 right-4 w-1/4 h-1/4"
        } shadow-2xl rounded-2xl overflow-hidden group`}
      >
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover bg-black rounded-2xl"
        />
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition bg-black/60 text-white p-2 rounded-full"
        >
          <FullscreenIcon fontSize="small" />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6">
        <button onClick={toggleVideo} className={buttonStyles}>
          {videoOn ? (
            <VideocamIcon fontSize="medium" />
          ) : (
            <VideocamOffIcon fontSize="medium" />
          )}
        </button>
        <button onClick={toggleAudio} className={buttonStyles}>
          {mute ? (
            <MicOffIcon fontSize="medium" />
          ) : (
            <MicIcon fontSize="medium" />
          )}
        </button>
        {!screenSharing ? (
          <button onClick={startScreenShare} className={buttonStyles}>
            <ScreenShareIcon fontSize="medium" />
          </button>
        ) : (
          <button
            onClick={stopScreenShare}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white shadow-md transition"
          >
            <StopScreenShareIcon fontSize="medium" />
          </button>
        )}
        <button onClick={endCall} className={buttonStyles}>
          <CallEndIcon fontSize="medium" />
        </button>

        <button
          onClick={() => alert("Chat feature coming soon!")}
          className={buttonStyles}
        >
          <ChatIcon fontSize="medium" />
        </button>
      </div>
    </div>
  );
};

export default Room;
