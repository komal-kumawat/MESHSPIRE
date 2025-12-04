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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleRoomMessage = (data: Message) => {
      // Only add if not from the same socket (avoid duplicates)
      if (data.socketId !== socket.id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("room-message", handleRoomMessage);

    return () => {
      socket.off("room-message", handleRoomMessage);
    };
  }, [socket]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const timestamp = new Date().toISOString();
    const messageData = {
      message: inputMessage,
      sender: currentUserName,
      timestamp,
      socketId: socket.id,
    };

    // Add message immediately to local state
    setMessages((prev) => [...prev, messageData]);

    // Emit to server to broadcast to others
    socket.emit("send-room-message", {
      roomId,
      message: inputMessage,
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
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-gray-700">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Meeting Chat</h3>
        <p className="text-xs text-gray-400">
          Messages visible to all participants
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Start the conversation!</p>
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
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    isOwnMessage
                      ? "bg-violet-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-1 px-1">
                  {isOwnMessage ? "You" : msg.sender}
                </p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-700"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeetingChat;
