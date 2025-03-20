import { useState } from 'react';
import { getGameOutcome, isWinningOutcome } from '../logic/gameLogic';

export default function useGameLogic() {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const play = () => {
    const outcome = getGameOutcome();
    setResult(outcome);
    setMessage(isWinningOutcome(outcome) ? 'You win!' : 'Try again!');
  };

  return { result, message, play };
}
