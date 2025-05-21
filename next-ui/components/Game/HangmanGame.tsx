"use client";
import { useAccount, useSwitchChain } from "wagmi";
import { GameState, categories } from "@/types";
import { monadTestnet } from "viem/chains";
import { useEffect } from "react";
import { playVictorySound } from "./AudioControl";

type GameBoardProps = {
  setMode: React.Dispatch<React.SetStateAction<"none" | "default">>;
  mode: "timed" | "default";
  remainingTime?: number;
  isTransactionPending?: boolean;
  onStart: (category: keyof typeof categories) => void;
  gameState: GameState;
  makeGuess: (letter: string) => Promise<void>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  completeGame: (gameId: string, word: string, nonce: string) => Promise<void>;
};

export default function HangmanGame({
  setMode,
  mode,
  remainingTime,
  isTransactionPending = false,
  onStart,
  gameState,
  makeGuess,
  setGameState,
  completeGame,
}: GameBoardProps) {
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const isMonadChain = chainId === monadTestnet.id;

  useEffect(() => {
    if (gameState.gameStatus === "won") {
      playVictorySound();
    }
  }, [gameState.gameStatus]);

  if (isTransactionPending) {
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="text-2xl font-bold">Waiting for transaction...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (gameState.gameStatus === "idle") {
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <button
          onClick={() => setMode("none")}
          className="self-start px-3 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
          aria-label="Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {!isMonadChain && (
          <button
            onClick={() => switchChain({ chainId: monadTestnet.id })}
            className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors mb-4"
          >
            Switch to Monad Testnet
          </button>
        )}
        <h2 className="text-2xl font-bold text-black">Select a Category</h2>
        <div className="flex flex-row flex-wrap gap-3 mb-4 w-full justify-center">
          {Object.entries(categories).map(([key, value]) => (
            <button
              key={key}
              className={`px-4 py-2 font-medium border-2 transition-colors focus:outline-none
                ${
                  (gameState.category || "shuffle") === key
                    ? "border-[#A0055D] text-black bg-white"
                    : "border-[#836EF9] text-black hover:border-[#A0055D]"
                }
                rounded-lg`}
              onClick={() =>
                setGameState((prev: any) => ({ ...prev, category: key }))
              }
            >
              {value}
            </button>
          ))}
        </div>
        <button
          disabled={!isMonadChain}
          onClick={() => {
            const selectedCategory = gameState.category || "shuffle";
            onStart(selectedCategory as keyof typeof categories);
          }}
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
    <div className="flex flex-col items-center gap-8 p-8 bg-[#FBFAF9] min-h-screen">
      <div className="text-2xl font-bold text-[#200052]">
        Hangman Game {mode === "timed" ? "(Timed Mode)" : ""}
      </div>
      {gameState.gameStatus === "playing" && (
        <>
          {mode === "timed" && remainingTime !== undefined && (
            <div className="text-3xl font-bold text-[#A0055D] mb-4">
              Time: {remainingTime}s
            </div>
          )}
          <div className="text-xl text-[#200052]">
            Category:{" "}
            {categories[gameState.category as keyof typeof categories]}
          </div>
          <div className="text-2xl font-mono tracking-wider text-[#200052]">
            {gameState.maskedWord}
          </div>
          {mode === "default" && (
            <div className="text-lg text-[#200052]">
              Remaining guesses: {gameState.remainingGuesses}
            </div>
          )}
          <div className="grid grid-cols-7 gap-2 max-w-[400px]">
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
              <button
                key={letter}
                onClick={() => makeGuess(letter)}
                disabled={
                  gameState.guessedLetters.has(letter) ||
                  (mode === "timed" &&
                    remainingTime !== undefined &&
                    remainingTime <= 0)
                }
                className={`w-10 h-10 rounded font-inter ${
                  gameState.guessedLetters.has(letter) ||
                  (mode === "timed" &&
                    remainingTime !== undefined &&
                    remainingTime <= 0)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#836EF9] hover:bg-[#200052] text-white transition-colors"
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
          <div className="text-2xl text-[#836EF9] mb-4">
            Congratulations! You won!
          </div>
          <div className="text-lg mb-4 text-[#200052]">
            The word was: {gameState.word}
          </div>
          <button
            onClick={() =>
              completeGame(gameState.gameId, gameState.word!, gameState.nonce!)
            }
            className="px-4 py-2 bg-[#836EF9] text-white rounded hover:bg-[#200052] transition-colors mb-4"
          >
            Claim Reward
          </button>
        </div>
      )}

      {gameState.gameStatus === "lost" && (
        <div className="text-center">
          <div className="text-2xl text-[#A0055D] mb-4">
            Game Over! {mode === "timed" ? "(Time's up)" : ""}
          </div>
          <div className="text-lg mb-4 text-[#200052]">
            The word was: {gameState.word}
          </div>
          <button
            onClick={() => setMode("none")}
            className="px-4 py-2 bg-[#836EF9] text-white rounded hover:bg-[#200052] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {gameState.gameStatus === "success" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#836EF9] mb-4">
            Reward Sent Successfully!
          </h2>
          <p className="text-lg mb-4 text-[#200052]">
            Your reward has been sent to your wallet.
          </p>
          <a
            href={`https://testnet.monvision.io/tx/${gameState.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#836EF9] hover:text-[#200052] underline"
          >
            View Transaction
          </a>

          <button
            onClick={() => setMode("none")}
            className="px-4 py-2 bg-[#836EF9] text-white rounded hover:bg-[#200052] transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
