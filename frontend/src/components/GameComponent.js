import React from 'react';
import useGameLogic from '../hooks/useGameLogic';

function GameComponent() {
  const { result, message, play } = useGameLogic();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Fake Gambling Game</h1>
      <p>Press the button to play and see your result!</p>
      <button onClick={play}>Play</button>
      {result !== null && (
        <div>
          <p>Result: {result}</p>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default GameComponent;
