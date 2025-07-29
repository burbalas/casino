// src/components/GameLobby.js
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function GameLobby() {
  const { logout } = useAuth();

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h1>Choose Your Game</h1>

      {/* Game tiles */}
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <Link to="/game/slots" style={tileStyle}>
          🎰<br />Slots
        </Link>

        <Link to="/game/roulette" style={tileStyle}>
          🎯<br />Roulette (soon)
        </Link>

        {/* Add more links as you build more games */}
      </div>

      <button onClick={logout} style={{ marginTop: 30 }}>Log out</button>
    </div>
  );
}

const tileStyle = {
  padding: 20,
  width: 120,
  border: "1px solid #ccc",
  borderRadius: 8,
  textDecoration: "none",
  color: "#000",
  fontSize: 18
};
