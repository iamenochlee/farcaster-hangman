"use client";
import { useAccount, useSwitchChain, useBalance } from "wagmi";
import { GameState, categories } from "@/types";
import { monadTestnet } from "viem/chains";
import { useEffect, useState } from "react";
import { playVictorySound } from "./AudioControl";
import HangmanDrawing from "./HangmanDrawing";
import { MIN_STAKE } from "@/contracts/config";
import sdk from "@farcaster/frame-sdk";

type GameBoardProps = {
  setMode: React.Dispatch<React.SetStateAction<"none" | "default">>;
  mode: "none" | "default";
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
  isTransactionPending = false,
  onStart,
  gameState,
  makeGuess,
  setGameState,
  completeGame,
}: GameBoardProps) {
  const { chainId, address } = useAccount();
  const { switchChain } = useSwitchChain();
  const isMonadChain = chainId === monadTestnet.id;
  const [pendingLetter, setPendingLetter] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch user balance
  const { data: balanceData } = useBalance({
    address,
    chainId: monadTestnet.id,
  });
  const userBalance = balanceData?.value;
  const insufficientFunds =
    userBalance !== undefined && userBalance < MIN_STAKE;

  const rows = [
    "ABCDEFG".split(""),
    "HIJKLMN".split(""),
    "OPQRSTU".split(""),
    "VWXYZ".split(""),
  ];

  useEffect(() => {
    if (gameState.gameStatus === "won") {
      playVictorySound();
    }
  }, [gameState.gameStatus]);

  useEffect(() => {
    if (chainId !== monadTestnet.id) {
      switchChain({ chainId: monadTestnet.id });
    }
  }, [chainId, switchChain]);

  if (isTransactionPending) {
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="text-2xl font-bold text-black">
          Waiting for transaction...
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#836EF9]" />
      </div>
    );
  }

  if (gameState.gameStatus === "idle") {
    return (
      <div className="flex flex-col items-center gap-6 p-8 bg-white">
        <button
          onClick={() => setMode("none")}
          className="self-start p-2 hover:bg-[#836EF9]/10 rounded-lg transition-colors -mt-4 -ml-6 focus:outline-none focus:ring-2 focus:ring-[#836EF9]"
          aria-label="Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#836EF9]"
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
        <h2 className="text-2xl font-bold text-[#200052]">Select a Category</h2>
        <div className="flex flex-row flex-wrap gap-3 mb-4 w-full justify-center">
          {Object.entries(categories).map(([key, value]) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-lg font-medium border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#836EF9] relative
                ${
                  (gameState.category || "shuffle") === key
                    ? "bg-[#836EF9] text-white border-[#836EF9]"
                    : "border-[#836EF9] text-black hover:border-4 hover:px-3 hover:py-1.5"
                }
              `}
              onClick={() =>
                setGameState((prev: any) => ({ ...prev, category: key }))
              }
            >
              {value}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            if (!isMonadChain) {
              switchChain({ chainId: monadTestnet.id });
            } else {
              const selectedCategory = gameState.category || "shuffle";
              onStart(selectedCategory as keyof typeof categories);
            }
          }}
          className={`px-6 py-3 rounded-lg font-semibold shadow transition-all duration-300 border-2 mb-1
            ${
              isMonadChain
                ? insufficientFunds
                  ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed opacity-60"
                  : "bg-[#836EF9] hover:bg-[#200052] text-white border-[#836EF9]"
                : "bg-yellow-500 text-black border-yellow-500 hover:bg-yellow-600  cursor-pointer"
            }`}
          disabled={insufficientFunds}
        >
          {isMonadChain ? "Start Playing" : "Switch to Monad Testnet"}
        </button>
        {insufficientFunds && (
          <div className="text-red-500 text-sm font-semibold mt-1">
            Insufficient funds (min 0.05 MON)
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-[#FBFAF9] min-h-screen">
      {gameState.gameStatus === "playing" && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold uppercase text-[#200052]">
              CATEGORY:
            </span>
            <span className="bg-[#836EF9] text-white px-3 py-1 rounded-lg font-semibold tracking-wide uppercase">
              {categories[
                gameState.category as keyof typeof categories
              ]?.toUpperCase()}
            </span>
          </div>
          <HangmanDrawing wrongGuesses={6 - gameState.remainingGuesses} />
          <div className="flex justify-center gap-x-2 -mb-4 text-2xl font-mono tracking-wider text-[#200052] min-h-[48px]">
            {gameState.maskedWord.split("").map((char, i) => (
              <span
                key={i}
                className="min-w-[32px] h-[48px] flex justify-center items-center border-b-2 border-[#836EF9]"
              >
                {char !== "_" ? char : ""}
              </span>
            ))}
          </div>
          <div className="text-lg text-[#200052] font-semibold -mb-4 flex items-end justify-center">
            <span className="text-2xl">{6 - gameState.remainingGuesses}</span>
            <span className="ml-1">/6</span>
          </div>
          <div className="w-full -mt-4 border border-[#836EF9] pt-4 pb-4 px-4 rounded-2xl bg-white">
            {rows.map((row, i) => (
              <div key={i} className="flex justify-center gap-2 mb-2">
                {row.map((letter) => (
                  <button
                    key={letter}
                    onClick={async () => {
                      setPendingLetter(letter);
                      await makeGuess(letter);
                      setPendingLetter(null);
                    }}
                    disabled={
                      gameState.guessedLetters.has(letter) ||
                      pendingLetter !== null
                    }
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-inter text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#836EF9]
                      ${
                        gameState.guessedLetters.has(letter) ||
                        pendingLetter !== null
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[#836EF9] hover:bg-[#200052] text-white"
                      }
                    `}
                  >
                    {pendingLetter === letter ? (
                      <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    ) : (
                      letter
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {gameState.gameStatus === "won" && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="text-2xl font-bold text-green-600 mb-2">
            You guessed correctly!
          </div>
          <HangmanDrawing wrongGuesses={6} color="#22c55e" />
          <div className="px-8 py-4 border-4 border-green-500 rounded-xl bg-white text-3xl font-mono font-bold tracking-widest text-green-700 mb-2 shadow">
            {gameState.word?.toUpperCase()}
          </div>
          <button
            onClick={async () => {
              setIsCompleting(true);
              await completeGame(
                gameState.gameId,
                gameState.word!,
                gameState.nonce!
              );
              setIsCompleting(false);
            }}
            disabled={isCompleting}
            className="px-6 py-3 bg-[#836EF9] text-white rounded-lg font-semibold text-lg shadow hover:bg-green-600 transition-colors mb-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#836EF9]"
          >
            {isCompleting ? (
              <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
            ) : null}
            Complete
          </button>
        </div>
      )}

      {gameState.gameStatus === "lost" && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <HangmanDrawing wrongGuesses={6} color="#A0055D" />
          <div className="text-2xl text-[#A0055D] mb-4 font-bold">
            Game Over!
          </div>
          <div className="text-lg mb-4 text-[#200052]">
            The word was:{" "}
            <span className="font-bold">{gameState.word?.toUpperCase()}</span>
          </div>
          <button
            onClick={() => setMode("none")}
            className="px-6 py-3 bg-[#836EF9] text-white rounded-lg font-semibold shadow hover:bg-[#200052] transition-colors focus:outline-none focus:ring-2 focus:ring-[#836EF9]"
          >
            Try Again
          </button>
        </div>
      )}

      {gameState.gameStatus === "success" && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h2 className="text-2xl font-bold text-[#836EF9] mb-2 mt-16">
            Reward Sent Successfully!
          </h2>
          <div className="px-8 py-4 border-4 border-[#836EF9] rounded-xl bg-white text-lg text-[#200052] mb-2 shadow">
            Your stake has been sent to your wallet.
          </div>
          <a
            target="_blank"
            onClick={() =>
              sdk.actions.openUrl(
                `https://testnet.monvision.io/tx/${gameState.transactionHash}`
              )
            }
            rel="noopener noreferrer"
            className="text-[#836EF9] hover:text-[#200052] underline"
          >
            View Transaction
          </a>

          <button
            onClick={() => setMode("none")}
            className="px-6 py-3 bg-[#836EF9] text-white rounded-lg font-semibold text-lg shadow hover:bg-[#200052] transition-colors border-2 border-[#836EF9] hover:border-4 hover:px-5 hover:py-2.5 focus:outline-none focus:ring-2 focus:ring-[#836EF9]"
          >
            Play Again
          </button>
        </div>
      )}

      {(gameState.gameStatus === "success" ||
        gameState.gameStatus === "lost") && (
        <button
          className="flex items-center gap-2 px-6 py-2 bg-[#836EF9] text-white rounded-full font-medium shadow hover:bg-[#200052] transition-colors focus:outline-none focus:ring-2 focus:ring-[#836EF9]"
          onClick={() => {
            const word = gameState.word || "";

            sdk.actions.composeCast({
              text:
                gameState.gameStatus === "lost"
                  ? `I couldn't guess "${word}" in Hangman on Monad. Can you do better?`
                  : `I just guessed "${word}" in Hangman on Monad! 🎉 Play now`,
              embeds: [window.location.href],
            });
          }}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
            <path d="M16 6l-4-4-4 4" />
            <path d="M12 2v14" />
          </svg>
          Share
        </button>
      )}
    </div>
  );
}
