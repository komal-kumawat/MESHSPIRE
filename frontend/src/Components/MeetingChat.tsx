import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface Message {
  message: string;
  sender: string;
  timestamp: string;
  socketId: string;
}

interface MeetingChatProps {
  socket: Socket;
  roomId: string;
  currentUserName: string;
}

const MeetingChat: React.FC<MeetingChatProps> = ({
  socket,
  roomId,
  currentUserName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listenerSetupRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Prevent duplicate listener setup
    if (listenerSetupRef.current) {
      console.log("⚠️ Listener already set up, skipping");
      return;
    }

    const handleRoomMessage = (data: Message) => {
      console.log("📨 Received room message:", {
        message: data.message,
        sender: data.sender,
        senderSocketId: data.socketId,
        mySocketId: socket.id,
        roomId: roomId,
      });
      // Add all messages from all participants
      setMessages((prev) => {
        // Prevent duplicate messages
        const isDuplicate = prev.some(
          (msg) =>
            msg.socketId === data.socketId &&
            msg.timestamp === data.timestamp &&
            msg.message === data.message
        );
        if (isDuplicate) {
          console.log("⚠️ Duplicate message detected, ignoring");
          return prev;
        }
        return [...prev, data];
      });
    };

    // Test event to verify socket is working
    const handleTestEvent = (data: any) => {
      console.log("🧪 TEST EVENT RECEIVED:", data);
    };

    console.log("🔌 Setting up room-message listener", {
      mySocketId: socket.id,
      roomId: roomId,
      currentUser: currentUserName,
      socketConnected: socket.connected,
      existingListeners: socket.listeners("room-message").length,
    });

    // Remove any existing listeners first to avoid duplicates
    socket.off("room-message");
    socket.off("test-event");

    socket.on("room-message", handleRoomMessage);
    socket.on("test-event", handleTestEvent);

    listenerSetupRef.current = true;

    // Test that the listener is actually registered
    setTimeout(() => {
      const listeners = socket.listeners("room-message");
      console.log("🔍 Verifying listener after setup:", {
        listenerCount: listeners.length,
        socketId: socket.id,
        connected: socket.connected,
      });

      // Send a test event back to ourselves
      console.log("🧪 Sending test event to verify socket...");
      socket.emit("test-event");
    }, 100);

    return () => {
      // Don't cleanup in strict mode double-render
      console.log("🔌 Cleanup called for room-message listener", socket.id);
      // Only actually clean up when component unmounts for real
      if (!listenerSetupRef.current) return;

      socket.off("room-message", handleRoomMessage);
      socket.off("test-event", handleTestEvent);
      listenerSetupRef.current = false;
    };
  }, [socket]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();

    console.log("📤 Sending message:", {
      roomId: roomId,
      message: messageText,
      sender: currentUserName,
      mySocketId: socket.id,
      socketConnected: socket.connected,
    });

    // Emit to server to broadcast to all participants (including sender)
    socket.emit("send-room-message", {
      roomId,
      message: messageText,
      sender: currentUserName,
    });

    setInputMessage("");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-violet-500/20 shadow-2xl shadow-violet-900/20">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-violet-500/20 bg-gradient-to-r from-violet-900/30 to-purple-900/30">
        <h3 className="text-lg font-semibold text-white">Meeting Chat</h3>
        <p className="text-xs text-violet-300/70">
          Messages visible to all participants
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="text-5xl mb-3"></div>
            <p className="text-lg font-medium text-white">No messages yet</p>
            <p className="text-sm mt-1 text-violet-300/70">
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.socketId === socket.id;
            return (
              <div
                key={index}
                className={`flex flex-col ${
                  isOwnMessage ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    isOwnMessage
                      ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                      : "bg-slate-800 text-gray-100 border border-slate-700"
                  }`}
                >
                  <p className="text-sm break-words leading-relaxed">
                    {msg.message}
                  </p>
                  <p className="text-xs mt-1.5 opacity-70">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
                <p
                  className={`text-xs mt-1 px-1 font-medium ${
                    isOwnMessage ? "text-violet-300" : "text-gray-400"
                  }`}
                >
                  {isOwnMessage ? "You" : msg.sender}
                </p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={sendMessage}
        className="p-4 border-t border-violet-500/20 bg-slate-900/50"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 border border-slate-700 placeholder:text-gray-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg disabled:shadow-none"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeetingChat;
