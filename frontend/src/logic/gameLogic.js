// Encapsulate your game rules and logic in pure functions
export const getGameOutcome = () => {
    // Example: generate a number between 0 and 99
    return Math.floor(Math.random() * 100);
  };
  
  export const isWinningOutcome = (outcome) => {
    // Define a winning condition (e.g., outcome above 50)
    return outcome > 50;
  };
  