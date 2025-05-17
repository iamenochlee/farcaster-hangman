"use client";
import { useState, useEffect, useRef } from "react";
import { useHangmanGame, categories } from "@/hooks/useHangmanGame";
import { useAccount, useSwitchChain } from "wagmi";
import { monadTestnet } from "viem/chains";

const SESSION_TIME_LIMIT = 120; // 2 minutes in seconds

type TimedHangmanGameProps = {
  setMode: React.Dispatch<React.SetStateAction<"none" | "timed" | "default">>;
};

export default function TimedHangmanGame({ setMode }: TimedHangmanGameProps) {
  const { gameState, startNewGame, makeGuess } = useHangmanGame();
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof categories>("shuffle");
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const [remainingTime, setRemainingTime] = useState(SESSION_TIME_LIMIT);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer on new game
  useEffect(() => {
    if (gameState.gameStatus === "playing") {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(async () => {
        try {
          const response = await fetch(`/api/game/word`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              gameId: gameState.gameId,
              letter: "", // Just checking time, not making a guess
            }),
          });
          const data = await response.json();
          if (response.ok) {
            const elapsed = data.elapsedTime || 0;
            const remaining = Math.max(0, SESSION_TIME_LIMIT - elapsed);
            setRemainingTime(remaining);

            if (remaining <= 0) {
              makeGuess("#"); // End game if time's up
            }
          }
        } catch (error) {
          console.error("Failed to check time:", error);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.gameStatus, gameState.gameId, makeGuess]);

  const handleCategorySelect = async () => {
    await startNewGame(selectedCategory);
  };

  const isMonadChain = chainId === monadTestnet.id;

  if (gameState.gameStatus === "idle") {
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        {!isMonadChain && (
          <button
            onClick={() => switchChain({ chainId: monadTestnet.id })}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors mb-4"
          >
            Switch to Monad Testnet
          </button>
        )}
        <h2 className="text-2xl font-bold">Select a Category</h2>
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value as keyof typeof categories)
          }
          className="p-3 border rounded-lg text-lg min-w-[200px] text-gray-800 bg-white"
        >
          {Object.entries(categories).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <button
          onClick={handleCategorySelect}
          disabled={!isMonadChain}
          className={`px-6 py-3 rounded-lg transition-colors ${
            isMonadChain
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Start Playing
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      {!isMonadChain && (
        <button
          onClick={() => switchChain({ chainId: monadTestnet.id })}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors mb-4"
        >
          Switch to Monad Testnet
        </button>
      )}
      <div className="text-2xl font-bold">Hangman Game (Timed Mode)</div>
      {gameState.gameStatus === "playing" && (
        <>
          <div className="text-3xl font-bold text-red-600 mb-4">
            Time: {Math.ceil(remainingTime)}s
          </div>
          <div className="text-xl">
            Category:{" "}
            {categories[gameState.category as keyof typeof categories]}
          </div>
          <div className="text-2xl font-mono tracking-wider">
            {gameState.maskedWord}
          </div>
          <div className="grid grid-cols-7 gap-2 max-w-[400px]">
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
              <button
                key={letter}
                onClick={() => makeGuess(letter)}
                disabled={
                  gameState.guessedLetters.has(letter) || remainingTime <= 0
                }
                className={`w-10 h-10 rounded ${
                  gameState.guessedLetters.has(letter) || remainingTime <= 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMode("none")}
            className="mt-4 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Menu
          </button>
        </>
      )}
      {gameState.gameStatus === "won" && (
        <div className="text-center">
          <div className="text-2xl text-green-500 mb-4">
            Congratulations! You won!
          </div>
          <div className="text-lg mb-4">The word was: {gameState.word}</div>
          <button
            onClick={handleCategorySelect}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
      {gameState.gameStatus === "lost" && (
        <div className="text-center">
          <div className="text-2xl text-red-500 mb-4">
            Game Over! (Time's up)
          </div>
          <div className="text-lg mb-4">The word was: {gameState.word}</div>
          <button
            onClick={() => setMode("none")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
