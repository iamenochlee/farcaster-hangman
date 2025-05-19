import { useState } from "react";
import { useWriteContract } from "wagmi";
import { categories, GameState } from "@/types";

import {
  HANGMAN_CONTRACT_ADDRESS,
  MIN_STAKE,
  HANGMAN_CONTRACT_ABI,
} from "@/contracts/config";

export function useHangmanGame() {
  const [gameState, setGameState] = useState<GameState>({
    wordLength: 0,
    maskedWord: "",
    remainingGuesses: 6,
    gameId: "",
    guessedLetters: new Set(),
    gameStatus: "idle",
    category: null,
    timeLimit: null,
  });

  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setGameState((prev) => ({
          ...prev,
          gameStatus: "playing",
        }));
      },
    },
  });

  const startNewGame = async (
    category: keyof typeof categories,
    mode?: "timed"
  ) => {
    try {
      const params = new URLSearchParams();
      if (category !== "shuffle") {
        params.append("category", category);
      }
      if (mode === "timed") {
        params.append("mode", "timed");
        params.append("timeLimit", "120");
      }

      const url = `/api/game/word${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);
      const data = await response.json();

      setGameState({
        ...data,
        guessedLetters: new Set(),
        gameStatus: "playing",
        category: data.category,
      });

      writeContract({
        address: HANGMAN_CONTRACT_ADDRESS,
        abi: HANGMAN_CONTRACT_ABI,
        functionName: "startGame",
        args: [data.gameId, data.commitment],
        value: MIN_STAKE,
      });
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  const makeGuess = async (letter: string) => {
    if (
      gameState.gameStatus !== "playing" ||
      gameState.guessedLetters.has(letter)
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/game/word`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: gameState.gameId,
          letter,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setGameState((prev) => ({
          ...prev,
          maskedWord: data.maskedWord,
          remainingGuesses: data.remainingGuesses,
          guessedLetters: new Set(data.guessedLetters),
          gameStatus: data.isGameOver
            ? data.isWon
              ? "won"
              : "lost"
            : "playing",
          word: data.word,
          nonce: data.nonce,
        }));
      } else {
        console.error("Failed to make guess:", data.error);
      }
    } catch (error) {
      console.error("Failed to make guess:", error);
    }
  };

  const completeGame = async (gameId: string, word: string, nonce: string) => {
    try {
      const response = await fetch("/api/game/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, word, nonce }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete game");
      }

      const data = await response.json();
      setGameState((prev) => ({
        ...prev,
        gameStatus: "won",
      }));

      return data.hash;
    } catch (error) {
      console.error("Error completing game:", error);
      throw error;
    }
  };

  return {
    gameState,
    startNewGame,
    makeGuess,
    setGameState,
    completeGame,
  };
}
