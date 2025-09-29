import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../providers/SocketProvider";
import { usePeer } from "../providers/PeerProvider";
import "../index.css";

interface UserJoinPayload {
  emailId: string;
}

interface IncomingCallPayload {
  from: string;
  offer: RTCSessionDescriptionInit;
}

interface CallAcceptedPayload {
  ans: RTCSessionDescriptionInit;
}

interface IceCandidatePayload {
  from: string;
  candidate: RTCIceCandidate;
}

export const Room: React.FC = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();
  const { roomid } = useParams<{ roomid: string }>();
  const navigate = useNavigate();

  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteEmailId, setRemoteEmailId] = useState<string | null>(null);
  const [connectedUserEmails, setConnectedUserEmails] = useState<string[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const localEmail = useMemo(() => sessionStorage.getItem("email") || "", []);

  /** Join room */
  useEffect(() => {
    if (!roomid) {
      navigate("/");
      return;
    }
    socket.emit("join-room", { emailId: localEmail, roomid });
  }, [localEmail, roomid, navigate, socket]);

  /** Local video binding */
  useEffect(() => {
    if (localVideoRef.current && myStream) {
      localVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  /** Remote video binding */
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  /** New user joined */
  const handleNewUserJoined = useCallback(
    async ({ emailId }: UserJoinPayload) => {
      if (!emailId || emailId === localEmail) return;
      setConnectedUserEmails((prev) => Array.from(new Set([...prev, emailId])));
      setRemoteEmailId(emailId);

      try {
        const offer = await createOffer();
        socket.emit("call-user", { emailId, offer });
      } catch (err) {
        console.error(err);
      }
    },
    [createOffer, localEmail, socket]
  );

  /** Incoming call */
  const handleIncomingCall = useCallback(
    async ({ from, offer }: IncomingCallPayload) => {
      setRemoteEmailId(from);
      try {
        const ans = await createAnswer(offer);
        socket.emit("call-accepted", { emailId: from, ans });
      } catch (err) {
        console.error(err);
      }
    },
    [createAnswer, socket]
  );

  /** Call accepted */
  const handleCallAccepted = useCallback(
    async ({ ans }: CallAcceptedPayload) => {
      if (!ans) return;
      try {
        await setRemoteAns(ans);
      } catch (err) {
        console.error(err);
      }
    },
    [setRemoteAns]
  );

  /** Remote ICE */
  const handleRemoteIce = useCallback(
    ({ from, candidate }: IceCandidatePayload) => {
      if (candidate) peer.addIceCandidate(candidate).catch((e) => console.warn(e));
    },
    [peer]
  );

  /** Socket listeners */
  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("ice-candidate", handleRemoteIce);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("ice-candidate", handleRemoteIce);
    };
  }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted, handleRemoteIce]);

  /** Local camera/mic */
  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setMyStream(stream);
    } catch (err) {
      console.error(err);
      alert("Unable to access camera/microphone.");
    }
  }, []);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  /** Send local stream to peer */
  const handleSendMyStream = useCallback(async () => {
    if (!myStream) {
      alert("No local stream available");
      return;
    }
    sendStream(myStream);
  }, [myStream, sendStream]);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900 text-white p-4 gap-4">
      <header className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h2 className="text-xl font-semibold">Room: {roomid}</h2>
        <div className="flex gap-4 text-sm">
          <span className="bg-green-600 px-2 py-1 rounded">You: {localEmail}</span>
          <span className="bg-blue-600 px-2 py-1 rounded">Connected: {connectedUserEmails.length}</span>
        </div>
      </header>

      <main className="flex flex-1 gap-6 flex-col md:flex-row justify-center items-center p-10 md:px-[200px] ">
        {/* Local Video */}
        <div className="flex flex-col items-center gap-2 bg-gray-800 p-3 rounded-lg shadow-md w-full md:w-1/2 p-5">
          <h4 className="font-medium text-lg">Your Video</h4>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-72 rounded-md border-2 border-green-500 object-cover"
          />
          <div className="flex gap-2 mt-2">
            <button
              className="px-4 py-2 bg-yellow-500 rounded-md hover:bg-yellow-400 transition font-medium"
              onClick={getUserMediaStream}
            >
              Restart Camera
            </button>
            <button
              className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-400 transition font-medium"
              onClick={handleSendMyStream}
            >
              Send Video
            </button>
          </div>
        </div>

        {/* Remote Video */}
        <div className="flex flex-col items-center gap-2 bg-gray-800 p-3 rounded-lg shadow-md w-full md:w-1/2 p-5">
          <h4 className="font-medium text-lg">Remote Video {remoteEmailId ? `(${remoteEmailId})` : ""}</h4>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-72 rounded-md border-2 border-blue-500 object-cover"
          />
          <div className="mt-2 text-sm text-gray-300 text-center">
            Remote stream will appear here after connection is established
          </div>
        </div>
      </main>
    </div>
  );
};
