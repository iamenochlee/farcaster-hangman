"use client";
import { useHangmanGame } from "@/hooks/useHangmanGame";
import HangmanGame from "./HangmanGame";
import { categories } from "@/types";

type HangmanGameProps = {
  setMode: React.Dispatch<React.SetStateAction<"none" | "default">>;
};

export default function DefaultHangmanGame({ setMode }: HangmanGameProps) {
  const {
    gameState,
    startNewGame,
    makeGuess,
    setGameState,
    completeGame,
    isTransactionPending,
    setIsTransactionPending,
  } = useHangmanGame();

  const onStart = async (category: keyof typeof categories) => {
    setIsTransactionPending(true);
    await startNewGame(category);
  };

  return (
    <HangmanGame
      setMode={setMode}
      mode="default"
      isTransactionPending={isTransactionPending}
      onStart={onStart}
      gameState={gameState}
      makeGuess={makeGuess}
      setGameState={setGameState}
      completeGame={completeGame}
    />
  );
}
