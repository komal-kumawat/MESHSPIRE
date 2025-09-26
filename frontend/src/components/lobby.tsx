import React from "react";

interface LobbyProps {
  name: string;
  setName: (name: string) => void;
  onJoin: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ name, setName, onJoin }) => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Enter Lobby</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={onJoin} style={{ marginLeft: "10px" }}>
        Join Lobby
      </button>
    </div>
  );
};

export default Lobby;
