import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:8000");

export default function RoomPage() {
  const { id: roomId } = useParams();
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideo.current) {
          localVideo.current.srcObject = stream;
        }

        socket.emit("join-room", { roomId, userId: socket.id });

        socket.on("user-joined", (userId) => {
          const peer = new Peer({ initiator: true, trickle: false, stream });
          peer.on("signal", (signal: any) => {
            socket.emit("signal", { userId, signal });
          });
          peer.on("stream", (remoteStream) => {
            if (remoteVideo.current) {
              remoteVideo.current.srcObject = remoteStream;
            }
          });
          peerRef.current = peer;
        });

        socket.on("signal", ({ signal }) => {
          if (peerRef.current) {
            peerRef.current.signal(signal);
          } else {
            const peer = new Peer({ initiator: false, trickle: false, stream });
            peer.on("signal", (s) =>
              socket.emit("signal", { userId: socket.id, signal: s })
            );
            peer.on("stream", (remoteStream) => {
              if (remoteVideo.current) {
                remoteVideo.current.srcObject = remoteStream;
              }
            });
            peer.signal(signal);
            peerRef.current = peer;
          }
        });

        socket.on("user-left", () => {
          if (remoteVideo.current) {
            (remoteVideo.current.srcObject as MediaStream)
              ?.getTracks()
              .forEach((t) => t.stop());
            remoteVideo.current.srcObject = null;
          }
          peerRef.current?.destroy();
          peerRef.current = null;
        });
      });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">
      <h2 className="text-xl">Meeting Room: {roomId}</h2>
      <div className="flex gap-6">
        <video
          ref={localVideo}
          autoPlay
          muted
          playsInline
          className="w-64 border-2 border-green-500 rounded"
        />
        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          className="w-64 border-2 border-blue-500 rounded"
        />
      </div>
    </div>
  );
}
