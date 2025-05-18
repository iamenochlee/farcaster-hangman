"use client";
import { useState } from "react";
import { useHangmanGame } from "@/hooks/useHangmanGame";
import { HangmanGame } from "./HangmanGame";
import { categories } from "@/types";

type HangmanGameProps = {
  setMode: React.Dispatch<React.SetStateAction<"none" | "timed" | "default">>;
};

export function DefaultHangmanGame({ setMode }: HangmanGameProps) {
  const { gameState, startNewGame, makeGuess, setGameState } = useHangmanGame();
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  const onStart = async (category: keyof typeof categories) => {
    setIsTransactionPending(true);
    try {
      await startNewGame(category);
    } finally {
      setIsTransactionPending(false);
    }
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
    />
  );
}
