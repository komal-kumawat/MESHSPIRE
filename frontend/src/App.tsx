import { useState } from "react";
import Lobby from "./components/lobby";
import VideoCall from "./components/VideoCall";

function App() {
  const [name, setName] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);

  return (
    <div>
      {!joined ? (
        <Lobby
          name={name}
          setName={setName}
          onJoin={() => setJoined(true)}
        />
      ) : (
        <VideoCall />
      )}
    </div>
  );
}

export default App;
