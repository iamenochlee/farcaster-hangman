import { useState } from "react";
import { parseEther } from "viem";
import { useSendTransaction } from "wagmi";
import { categories, GameState } from "@/types";

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

  const { sendTransaction } = useSendTransaction({
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

      // Send transaction
      // sendTransaction({
      //   to: "0x39043f5b5ee9df333d0bf544b67c27d8284f69a1",
      //   value: parseEther("0.01"),
      // });
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

  return {
    gameState,
    startNewGame,
    makeGuess,
    setGameState,
  };
}
