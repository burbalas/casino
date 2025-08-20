// src/hooks/useGameLogic.js
import { useState } from 'react';

// --- your existing logic (kept as named exports)
export const SYMBOLS = [
  { icon: '🍒', weight: 40, payout: 2 },
  { icon: '🍋', weight: 30, payout: 3 },
  { icon: '🔔', weight: 20, payout: 5 },
  { icon: '⭐', weight: 8,  payout: 10 },
  { icon: '💎', weight: 2,  payout: 25 }
];

const TOTAL_WEIGHT = SYMBOLS.reduce((s, x) => s + x.weight, 0);

export function spinReels() {
  const spinOne = () => {
    let r = Math.random() * TOTAL_WEIGHT;
    for (const s of SYMBOLS) {
      if ((r -= s.weight) < 0) return s.icon;
    }
    return SYMBOLS[0].icon;
  };
  return [spinOne(), spinOne(), spinOne()];
}

export function evaluate(reels) {
  const [a, b, c] = reels;

  if (a === b && b === c) {
    const sym = SYMBOLS.find(s => s.icon === a);
    const payout = (sym?.payout ?? 1) * 5;
    return { win: true, kind: 'three', payout, message: `Triple ${a}! You win x${payout}` };
  }
  if (a === b || a === c || b === c) {
    const match = a === b ? a : (a === c ? a : b);
    const sym = SYMBOLS.find(s => s.icon === match);
    const payout = sym?.payout ?? 1;
    return { win: true, kind: 'two', payout, message: `Pair of ${match}! You win x${payout}` };
  }
  return { win: false, kind: 'none', payout: 0, message: 'Try again!' };
}

// --- NEW: default export hook so SlotsPage can import default
export default function useGameLogic() {
  const [reels, setReels] = useState(['❔','❔','❔']);
  const [message, setMessage] = useState('');
  const [lastResult, setLastResult] = useState(null);

  const play = () => {
    const r = spinReels();
    const res = evaluate(r);
    setReels(r);
    setMessage(res.message);
    setLastResult(res);
  };

  return { reels, message, play, lastResult };
}
