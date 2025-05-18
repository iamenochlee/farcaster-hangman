"use client";
import { useAccount, useSwitchChain } from "wagmi";
import { GameState, categories } from "@/types";
import { monadTestnet } from "viem/chains";

type GameBoardProps = {
  setMode: React.Dispatch<React.SetStateAction<"none" | "timed" | "default">>;
  mode: "timed" | "default";
  remainingTime?: number;
  isTransactionPending?: boolean;
  onStart: (category: keyof typeof categories) => void;
  gameState: GameState;
  makeGuess: (letter: string) => Promise<void>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
};

export function HangmanGame({
  setMode,
  mode,
  remainingTime,
  isTransactionPending = false,
  onStart,
  gameState,
  makeGuess,
  setGameState,
}: GameBoardProps) {
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const isMonadChain = chainId === monadTestnet.id;

  if (isTransactionPending) {
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="text-2xl font-bold">Waiting for transaction...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (gameState.gameStatus === "idle") {
    console.log("Rendering idle state");
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <button
          onClick={() => setMode("none")}
          className="self-start px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
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
          value={gameState.category || "shuffle"}
          onChange={(e) =>
            setGameState((prev) => ({
              ...prev,
              category: e.target.value as keyof typeof categories,
            }))
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

  console.log("Rendering game state:", gameState.gameStatus);
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-2xl font-bold">
        Hangman Game {mode === "timed" ? "(Timed Mode)" : ""}
      </div>
      {gameState.gameStatus === "playing" && (
        <>
          {mode === "timed" && remainingTime !== undefined && (
            <div className="text-3xl font-bold text-red-600 mb-4">
              Time: {remainingTime}s
            </div>
          )}
          <div className="text-xl">
            Category:{" "}
            {categories[gameState.category as keyof typeof categories]}
          </div>
          <div className="text-2xl font-mono tracking-wider">
            {gameState.maskedWord}
          </div>
          {mode === "default" && (
            <div className="text-lg">
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
                className={`w-10 h-10 rounded ${
                  gameState.guessedLetters.has(letter) ||
                  (mode === "timed" &&
                    remainingTime !== undefined &&
                    remainingTime <= 0)
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
            onClick={() => setMode("none")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
      {gameState.gameStatus === "lost" && (
        <div className="text-center">
          <div className="text-2xl text-red-500 mb-4">
            Game Over! {mode === "timed" ? "(Time's up)" : ""}
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
