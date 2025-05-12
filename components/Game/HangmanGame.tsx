"use client";
import { useState } from "react";
import { useHangmanGame, categories } from "@/hooks/useHangmanGame";
import { useAccount, useSwitchChain } from "wagmi";
import { monadTestnet } from "viem/chains";

export function HangmanGame() {
  const { gameState, startNewGame, makeGuess } = useHangmanGame();
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof categories>("shuffle");
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const handleCategorySelect = async () => {
    await startNewGame(selectedCategory);
  };

  const handleCompleteGame = async () => {
    if (!gameState.nonce) {
      console.error("No nonce available");
      return;
    }
    // TODO: Call contract with commitment
    console.log("Completing game with nonce:", gameState.nonce);
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
      <div className="text-2xl font-bold">Hangman Game</div>

      {gameState.gameStatus === "playing" && (
        <>
          <div className="text-xl">
            Category:{" "}
            {categories[gameState.category as keyof typeof categories]}
          </div>
          <div className="text-2xl font-mono tracking-wider">
            {gameState.maskedWord}
          </div>
          <div className="text-lg">
            Remaining guesses: {gameState.remainingGuesses}
          </div>
          <div className="grid grid-cols-7 gap-2 max-w-[400px]">
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
              <button
                key={letter}
                onClick={() => makeGuess(letter)}
                disabled={gameState.guessedLetters.has(letter)}
                className={`w-10 h-10 rounded ${
                  gameState.guessedLetters.has(letter)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
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
          <div className="text-2xl text-red-500 mb-4">Game Over!</div>
          <div className="text-lg mb-4">The word was: {gameState.word}</div>
          <button
            onClick={handleCategorySelect}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}

      <button
        onClick={handleCompleteGame}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Complete Game
      </button>
    </div>
  );
}
