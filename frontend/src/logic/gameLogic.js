// 3-reel slots logic (pure functions)

// Weighted symbol table (rarer symbols pay more)
const SYMBOLS = [
  { icon: '🍒', weight: 40, payout: 2 },
  { icon: '🍋', weight: 30, payout: 3 },
  { icon: '🔔', weight: 20, payout: 5 },
  { icon: '⭐', weight: 8,  payout: 10 },
  { icon: '💎', weight: 2,  payout: 25 }
];

const TOTAL_WEIGHT = SYMBOLS.reduce((s, x) => s + x.weight, 0);

function spinOne() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const s of SYMBOLS) {
    if ((r -= s.weight) < 0) return s.icon;
  }
  return SYMBOLS[0].icon;
}

export function spinReels() {
  return [spinOne(), spinOne(), spinOne()];
}

export function evaluate(reels) {
  const [a, b, c] = reels;

  // 3 of a kind
  if (a === b && b === c) {
    const sym = SYMBOLS.find(s => s.icon === a);
    const payout = (sym?.payout ?? 1) * 5; // 5x bonus for triple
    return { win: true, kind: 'three', payout, message: `Triple ${a}! You win x${payout}` };
  }

  // 2 of a kind
  if (a === b || a === c || b === c) {
    const match = a === b ? a : (a === c ? a : b);
    const sym = SYMBOLS.find(s => s.icon === match);
    const payout = sym?.payout ?? 1;
    return { win: true, kind: 'two', payout, message: `Pair of ${match}! You win x${payout}` };
  }

  return { win: false, kind: 'none', payout: 0, message: 'Try again!' };
}
