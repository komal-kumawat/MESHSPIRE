import React, { type ReactNode, useMemo, useEffect, useState, useCallback } from "react";

interface PeerContextValue {
  peer: RTCPeerConnection;
  createOffer: () => Promise<RTCSessionDescriptionInit | null>;
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit | null>;
  setRemoteAns: (ans: RTCSessionDescriptionInit | null) => Promise<void>;
  sendStream: (stream: MediaStream) => void;
  remoteStream: MediaStream | null;
}

const PeerContext = React.createContext<PeerContextValue | null>(null);

export const usePeer = (): PeerContextValue => {
  const context = React.useContext(PeerContext);
  if (!context) throw new Error("usePeer must be used within a PeerProvider");
  return context;
};

interface PeerProviderProps {
  children: ReactNode;
}

export const PeerProvider: React.FC<PeerProviderProps> = ({ children }) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localTracks, setLocalTracks] = useState<MediaStreamTrack[]>([]);

  const peer = useMemo(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478" },
      ],
    });

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      } else if (event.track) {
        const ms = new MediaStream();
        ms.addTrack(event.track);
        setRemoteStream(ms);
      }
    };

    return pc;
  }, []);

  // Send tracks (only add each track once)
  const sendStream = useCallback(
    (stream: MediaStream) => {
      stream.getTracks().forEach((track) => {
        if (!localTracks.includes(track)) {
          peer.addTrack(track, stream);
          setLocalTracks((prev) => [...prev, track]);
        }
      });
    },
    [peer, localTracks]
  );

  const createOffer = useCallback(async (): Promise<RTCSessionDescriptionInit | null> => {
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      return peer.localDescription;
    } catch (err) {
      console.error("createOffer error:", err);
      return null;
    }
  }, [peer]);

  const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    try {
      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      return peer.localDescription;
    } catch (err) {
      console.error("createAnswer error:", err);
      return null;
    }
  }, [peer]);

  const setRemoteAns = useCallback(async (ans: RTCSessionDescriptionInit | null) => {
    if (!ans) return;
    try {
      await peer.setRemoteDescription(ans);
    } catch (err) {
      console.error("setRemoteAns error:", err);
    }
  }, [peer]);

  // ICE candidate listener
  useEffect(() => {
    peer.onicecandidate = (event) => {
      if (event.candidate && window.dispatchEvent) {
        // We'll emit via Socket in RoomPage
        window.dispatchEvent(new CustomEvent("local-ice", { detail: event.candidate }));
      }
    };
  }, [peer]);

  return (
    <PeerContext.Provider
      value={{ peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream }}
    >
      {children}
    </PeerContext.Provider>
  );
};
