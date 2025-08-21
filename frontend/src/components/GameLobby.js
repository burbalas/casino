// src/components/GameLobby.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { me } from "../lib/api";
import "./GameLobby.css";
import bg from "../assets/lobbybg.png";
import logo from "../assets/logo.png";

export default function GameLobby() {
  const { isLoggedIn, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!isLoggedIn) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const info = await me(); // { Username, Email, Tokens } (or lowercase)
        if (!alive) return;
        setProfile({
          username: info.Username ?? info.username ?? "Player",
          tokens: info.Tokens ?? info.tokens ?? 0,
        });
      } catch {
        if (!alive) return;
        setProfile(null);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [isLoggedIn]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "white",
      }}
    >
      {/* dark overlay for contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
        }}
      />

      {/* content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1800,
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >

        
        <header className="lobby__header">
        {/* BRAND */}
                <div className="brand">
                  <img src={logo} alt="Isle of Treasures" className="brand__logo" />
                </div>

        <div
          className="lobby__right"
          style={{
            '--size': '1.25rem',   // bigger text/buttons (try 1.1–1.4rem)
            '--x': '-8px',         // move a bit left  (e.g., '12px' to the right)
            '--y': '50px',         // move a bit up    (e.g., '6px' down)
          }}
        >
          {isLoggedIn ? (
            <>
              {loading ? (
                <span>Loading…</span>
              ) : (
                <span className="userline">
                  {profile?.username} • <span className="gold">{profile?.tokens}</span> gold
                </span>
              )}
              <button onClick={logout} className="btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-ghost">Register</Link>
            </>
          )}
        </div>
      </header>


        <main style={{ marginTop: 160, textAlign: "center" }}>
          <h2 style={{ fontSize: 40, margin: "0 0 10px" }}>
            Welcome{profile?.username ? `, ${profile.username}` : ""}!
          </h2>
          <p style={{ opacity: 0.9, marginBottom: 24 }}>
            Spin the reels and test your luck.
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link to="/game/slots" style={btnPrimary}>
              Play Slots
            </Link>
          </div>

          <div style={{ marginTop: 40, opacity: 0.85 }}>
            <p>More games coming soon…</p>
          </div>
        </main>
      </div>
    </div>
  );
}

const btnPrimary = {
  display: "inline-block",
  padding: "12px 22px",
  background: "linear-gradient(180deg, #ffd35c, #ffb300)",
  color: "#222",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 700,
  boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
};

