// src/components/SlotsPage.js
import { Link } from "react-router-dom";
import useGameLogic from "../hooks/useGameLogic";
import { useAuth } from "../contexts/AuthContext";

export default function SlotsPage() {
  const { isLoggedIn } = useAuth();
  const { result, message, play } = useGameLogic();

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>Slots</h1>

      {isLoggedIn ? (
        <>
          <button onClick={play}>Spin</button>
          {result !== null && (
            <>
              <p>Result: {result}</p>
              <p>{message}</p>
            </>
          )}
        </>
      ) : (
        <p>You must log in to play.</p>
      )}

      <p style={{ marginTop: 24 }}>
        <Link to="/lobby">⬅ Back to Lobby</Link>
      </p>
    </div>
  );
}
