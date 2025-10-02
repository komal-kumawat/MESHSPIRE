import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../providers/SocketProvider";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import VideoCallIcon from "@mui/icons-material/VideoCall";

interface PendingCandidates {
  [socketId: string]: RTCIceCandidateInit[];
}

const buttonStyles = "w-14 h-14 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-md transition";

const Room: React.FC = () => {
  const { socket } = useSocket();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ [socketId: string]: MediaStream }>({});
  const { roomid: roomIdParam } = useParams<{ roomid: string }>();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<{ [key: string]: RTCPeerConnection }>({});
  const pendingCandidates = useRef<PendingCandidates>({});
  const [videoOn, setVideoOn] = useState(true);
  const [mute, setMute] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const navigate = useNavigate();

  const roomId = roomIdParam || sessionStorage.getItem("currentRoom");

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

  // Join room
  const joinRoom = useCallback(async () => {
    if (!roomId) return;
    sessionStorage.setItem("currentRoom", roomId);
    const stream = await getUserMediaStream();
    if (stream) socket.emit("join-room", { roomId });
  }, [getUserMediaStream, roomId, socket]);

  useEffect(() => {
    joinRoom();
  }, [joinRoom]);

  // Create peer connection
  const createPeerConnection = useCallback(
    (socketId: string) => {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

      if (localStream) {
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      }

      pc.ontrack = (event) => {
        setRemoteStreams((prev) => ({ ...prev, [socketId]: event.streams[0] }));
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) socket.emit("ice-candidate", { target: socketId, candidate: e.candidate });
      };

      setPeerConnections((prev) => ({ ...prev, [socketId]: pc }));
      return pc;
    },
    [localStream, socket]
  );

  // Handle new participants
  useEffect(() => {
    const handleNewParticipant = ({ socketId }: { socketId: string }) => {
      if (!peerConnections[socketId]) createPeerConnection(socketId);
    };
    socket.on("new-participant", handleNewParticipant);
    return () => {socket.off("new-participant", handleNewParticipant);}
  }, [socket, peerConnections, createPeerConnection]);

  // Handle offers
  useEffect(() => {
    const handleOffer = async ({ from, offer }: any) => {
      let pc = peerConnections[from];
      if (!pc) pc = createPeerConnection(from);

      await pc.setRemoteDescription(offer);

      if (pendingCandidates.current[from]) {
        for (const c of pendingCandidates.current[from]) {
          await pc.addIceCandidate(c);
        }
        delete pendingCandidates.current[from];
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { target: from, answer });
    };
    socket.on("offer", handleOffer);
    return () => {socket.off("offer", handleOffer);}
  }, [socket, peerConnections, createPeerConnection]);

  // Handle answers
  useEffect(() => {
    const handleAnswer = async ({ from, answer }: any) => {
      const pc = peerConnections[from];
      if (!pc) return;

      await pc.setRemoteDescription(answer);

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

  // Handle ICE candidates
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

  // Send my video
  const sendMyVideo = () => {
    if (!localStream) return;
    Object.entries(peerConnections).forEach(([socketId, pc]) => {
      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer);
        socket.emit("offer", { target: socketId, offer });
      });
    });
    if (roomId) socket.emit("send-my-video", { roomId });
  };

  // Toggle Audio
  const toggleAudio = () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMute(!audioTrack.enabled);
    }
  };

  // Toggle Video
  const toggleVideo = () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoOn(videoTrack.enabled);
    }
  };

  // Screen Share
  const startScreenShare = async () => {
    if (!localStream) return;
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      screenTrackRef.current = screenTrack;

      Object.values(peerConnections).forEach((pc) => {
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
    Object.values(peerConnections).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender && videoTrack) sender.replaceTrack(videoTrack);
    });
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

    screenTrackRef.current.stop();
    screenTrackRef.current = null;
    setScreenSharing(false);
  };

  // End Call
  const endCall = () => {
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (screenTrackRef.current) screenTrackRef.current.stop();
    Object.values(peerConnections).forEach((pc) => pc.close());

    setPeerConnections({});
    setRemoteStreams({});
    setLocalStream(null);

    if (localVideoRef.current) localVideoRef.current.srcObject = null;

    if (roomId) socket.emit("leave-room", { roomId });
    sessionStorage.removeItem("currentRoom");
    navigate("/dashboard");
  };

  // Rejoin automatically on reconnect
  useEffect(() => {
    const handleReconnect = () => joinRoom();
    socket.on("connect", handleReconnect);
    return () => {socket.off("connect", handleReconnect);}
  }, [socket, joinRoom]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-white mb-4">Room ID: {roomId}</h1>

        <div className="flex flex-wrap gap-6 w-full justify-center">
          {/* Local Video */}
          <div className="relative w-full sm:w-1/2 md:w-1/3 shadow-2xl rounded-lg overflow-hidden">
            <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded z-10 font-semibold">You</div>
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-64 md:h-72 object-cover rounded-lg bg-black" />
          </div>

          {/* Remote Videos */}
          {Object.entries(remoteStreams).map(([id, stream]) => (
            <div key={id} className="relative w-full sm:w-1/2 md:w-1/3 shadow-2xl rounded-lg overflow-hidden">
              <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded z-10 font-semibold">{id}</div>
              <video
                autoPlay
                playsInline
                ref={(video) => { if (video) video.srcObject = stream; }}
                className="w-full h-64 md:h-72 object-cover rounded-lg bg-black"
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-6 mt-8 justify-center">
          <button onClick={toggleVideo} className={buttonStyles}>{videoOn ? <VideocamIcon fontSize="medium" /> : <VideocamOffIcon fontSize="medium" />}</button>
          <button onClick={toggleAudio} className={buttonStyles}>{mute ? <MicOffIcon fontSize="medium" /> : <MicIcon fontSize="medium" />}</button>
          {!screenSharing ? (
            <button onClick={startScreenShare} className={buttonStyles}><ScreenShareIcon fontSize="medium" /></button>
          ) : (
            <button onClick={stopScreenShare} className="w-14 h-14 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white shadow-md transition"><StopScreenShareIcon fontSize="medium" /></button>
          )}
          <button onClick={endCall} className={buttonStyles}><CallEndIcon fontSize="medium" /></button>
          <button onClick={sendMyVideo} className={buttonStyles}><VideoCallIcon fontSize="medium" /></button>
        </div>
      </div>
    </div>
  );
};

export default Room;
