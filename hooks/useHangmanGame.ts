import { useState } from "react";
import { parseEther } from "viem";
import { useSendTransaction } from "wagmi";

interface GameState {
  timeLimit: unknown;
  wordLength: number;
  maskedWord: string;
  remainingGuesses: number;
  gameId: string;
  guessedLetters: Set<string>;
  gameStatus: "idle" | "playing" | "won" | "lost";
  category: string | null;
  word?: string;
  nonce?: string;
  commitment?: string;
}

export const categories = {
  shuffle: "Shuffle",
  random: "Random",
  countries: "Countries",
  dapps: "DApps",
  blockchains: "Blockchains",
  sports: "Sports",
  social: "Social Platforms",
  colours: "Colors",
} as const;
export function useHangmanGame() {
  const [gameState, setGameState] = useState<GameState>({
    wordLength: 0,
    maskedWord: "",
    remainingGuesses: 6,
    gameId: "",
    guessedLetters: new Set(),
    gameStatus: "idle",
    category: null,
    timeLimit: null, // Added missing timeLimit property
  });

  const { sendTransaction } = useSendTransaction({
    mutation: {
      onSuccess: (data) => {
        setGameState((prev) => ({
          ...prev,
          gameStatus: "playing",
        }));
      },
    },
  });

  const startNewGame = async (
    category: keyof typeof categories,
    mode: "timed" | "default" = "default",
    timeLimit: number = 120
  ) => {
    try {
      const response = await fetch(
        `/api/game/word?category=${
          category === "shuffle" ? "" : category
        }&mode=${mode}${mode === "timed" ? `&timeLimit=${timeLimit}` : ""}`
      );
      const data = await response.json();

      // Store the game data temporarily
      setGameState({
        ...data,
        guessedLetters: new Set(),
        gameStatus: "idle", // Start as idle
        category: data.category,
      });

      // Send transaction
      sendTransaction({
        to: "0x39043f5b5ee9df333d0bf544b67c27d8284f69a1",
        value: parseEther("0.01"),
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

  return {
    gameState,
    startNewGame,
    makeGuess,
  };
}
