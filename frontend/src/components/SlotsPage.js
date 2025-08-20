import { Link } from "react-router-dom";
import useGameLogic from "../hooks/useGameLogic";
import { useAuth } from "../contexts/AuthContext";

export default function SlotsPage() {
  const { isLoggedIn } = useAuth();
  const { reels, message, play, lastResult } = useGameLogic();

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>Slots</h1>

      {isLoggedIn ? (
        <>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '20px 0' }}>
            {reels.map((r, i) => (
              <div key={i} style={{
                width: 80, height: 80, border: '2px solid #ccc', borderRadius: 12,
                display: 'grid', placeItems: 'center', fontSize: 36, background: '#fff'
              }}>{r}</div>
            ))}
          </div>

          <button onClick={play} style={{ padding: '8px 16px', fontSize: 16 }}>Spin</button>

          {lastResult && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontWeight: '600' }}>{message}</p>
            </div>
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
