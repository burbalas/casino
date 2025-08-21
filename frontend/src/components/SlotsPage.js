import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { me, spinSlots } from "../lib/api";

const SYMBOLS = ['🍒','🍋','🔔','⭐','💎'];

export default function SlotsPage() {
  const { isLoggedIn } = useAuth();
  const [balance, setBalance] = useState(null);
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState(['❔','❔','❔']);   // what’s shown
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [lastWin, setLastWin] = useState(0);

  // interval timers for the fast “shuffle”
  const reelTimers = useRef([null, null, null]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      reelTimers.current.forEach(t => t && clearInterval(t));
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    me().then(d => setBalance(d.Tokens ?? d.tokens))
       .catch(() => setBalance(null));
  }, [isLoggedIn]);

  // fast shuffle for immediate visual feedback
  const startShuffle = () => {
    reelTimers.current.forEach(t => t && clearInterval(t));
    for (let i = 0; i < 3; i++) {
      const base = 55 + i * 15; // slightly different speeds per reel
      reelTimers.current[i] = setInterval(() => {
        setReels(prev => {
          const next = [...prev];
          const idx = Math.floor(Math.random() * SYMBOLS.length);
          next[i] = SYMBOLS[idx];
          return next;
        });
      }, base);
    }
  };

  // decelerate a single reel so it lands on target with a nice easing
  const decelerateReel = (reelIndex, targetIcon, delayStart = 80) => {
    return new Promise(resolve => {
      // total steps: a few quick, then slower ones (ease-out)
      const steps = [
        delayStart, delayStart, delayStart + 10, delayStart + 25,
        delayStart + 45, delayStart + 70, delayStart + 100,
        delayStart + 140, delayStart + 190, delayStart + 250
      ];
      // add a little randomness so it doesn't feel robotic
      const jitter = () => (Math.random() * 16) | 0;

      let s = 0;
      const tick = () => {
        setReels(prev => {
          const next = [...prev];
          const curr = next[reelIndex];
          const curIdx = SYMBOLS.indexOf(curr);
          next[reelIndex] = SYMBOLS[(curIdx + 1) % SYMBOLS.length];
          return next;
        });

        if (s < steps.length - 1) {
          s++;
          setTimeout(tick, steps[s] + jitter());
        } else {
          // final snap to server result (ensures exact landing)
          setReels(prev => {
            const next = [...prev];
            next[reelIndex] = targetIcon;
            return next;
          });
          resolve();
        }
      };

      // stop the fast shuffle for this reel and begin deceleration
      if (reelTimers.current[reelIndex]) clearInterval(reelTimers.current[reelIndex]);
      setTimeout(tick, steps[0] + jitter());
    });
  };

  const spin = async () => {
    if (!isLoggedIn || busy) return;
    const b = Math.max(1, Math.min(1000, Number(bet) || 0));
    setBusy(true);
    setMessage('');
    setLastWin(0);

    // 1) start instant visual spin
    startShuffle();

    try {
      // 2) ask the server for the outcome
      const res = await spinSlots(b); // { reels: ['🍒','…','…'], message, win, balance }

      // 3) staggered stops: reel 0, then 1, then 2
      await decelerateReel(0, res.reels[0], 90 + Math.random()*20);
      await decelerateReel(1, res.reels[1], 120 + Math.random()*20);
      await decelerateReel(2, res.reels[2], 150 + Math.random()*20);

      if (!mounted.current) return;
      setMessage(res.message);
      setLastWin(res.win);
      setBalance(res.balance);
    } catch (e) {
      setMessage(e.message || 'Spin failed');
    } finally {
      // clear any remaining fast timers
      reelTimers.current.forEach(t => t && clearInterval(t));
      setBusy(false);
    }
  };

  const ReelTile = ({ icon, spinning }) => (
    <div
      style={{
        width: 90, height: 90,
        border: '2px solid #ccc',
        borderRadius: 14,
        display: 'grid', placeItems: 'center',
        fontSize: 40,
        background: '#fff',
        transition: 'transform 120ms ease, filter 120ms ease, box-shadow 120ms ease',
        transform: spinning ? 'scale(1.05)' : 'scale(1.0)',
        filter: spinning ? 'blur(0.6px)' : 'none',
        boxShadow: spinning ? '0 8px 18px rgba(0,0,0,0.12)' : '0 4px 10px rgba(0,0,0,0.08)'
      }}
    >
      {icon}
    </div>
  );

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>Slots</h1>

      {!isLoggedIn && <p>You must log in to play.</p>}

      {isLoggedIn && (
        <>
          <p style={{ fontSize: 18, marginBottom: 6 }}>
            Balance: <strong>{balance ?? '...'}</strong> tokens
          </p>

          <div style={{ marginBottom: 14 }}>
            <label>
              Bet:&nbsp;
              <input
                type="number"
                min={1}
                max={1000}
                value={bet}
                onChange={e => setBet(e.target.value)}
                style={{ width: 110 }}
                disabled={busy}
              />
            </label>
            <button onClick={spin} disabled={busy || balance === null || bet < 1} style={{ marginLeft: 12 }}>
              {busy ? 'Spinning…' : 'Spin'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', margin: '22px 0' }}>
            {reels.map((r, i) => <ReelTile key={i} icon={r} spinning={busy} />)}
          </div>

          <p style={{ fontWeight: 600, minHeight: 24 }}>{message}</p>
          {lastWin > 0 && <p>Won: {lastWin}</p>}
        </>
      )}

      <p style={{ marginTop: 24 }}>
        <Link to="/lobby">⬅ Back to Lobby</Link>
      </p>
    </div>
  );
}
