"use client";
import { useState, useEffect, useRef } from "react";
import { useHangmanGame } from "@/hooks/useHangmanGame";
import { HangmanGame } from "./HangmanGame";
import { categories } from "@/types";
const SESSION_TIME_LIMIT = 120; // 2 minutes in seconds

type TimedHangmanGameProps = {
  setMode: React.Dispatch<React.SetStateAction<"none" | "timed" | "default">>;
};

export default function TimedHangmanGame({ setMode }: TimedHangmanGameProps) {
  const { gameState, startNewGame, makeGuess, setGameState, completeGame } =
    useHangmanGame();
  const [remainingTime, setRemainingTime] = useState(SESSION_TIME_LIMIT);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const makeGuessRef = useRef(makeGuess);

  // Update makeGuessRef when makeGuess changes
  useEffect(() => {
    makeGuessRef.current = makeGuess;
  }, [makeGuess]);

  // Simple UI timer
  useEffect(() => {
    if (gameState.gameStatus === "playing") {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            makeGuessRef.current("#"); // End game if time's up
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.gameStatus]);

  const onStart = async (category: keyof typeof categories) => {
    setIsTransactionPending(true);
    setRemainingTime(SESSION_TIME_LIMIT); // Reset timer when starting new game
    try {
      await startNewGame(category, "timed");
    } finally {
      setIsTransactionPending(false);
    }
  };

  return (
    <HangmanGame
      setMode={setMode}
      mode="timed"
      remainingTime={remainingTime}
      isTransactionPending={isTransactionPending}
      onStart={onStart}
      gameState={gameState}
      makeGuess={makeGuess}
      setGameState={setGameState}
      completeGame={completeGame}
    />
  );
}
