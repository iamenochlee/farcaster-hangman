import React from "react";

type PregameProps = {
  setMode: React.Dispatch<React.SetStateAction<"none" | "timed" | "default">>;
};

export default function Pregame({ setMode }: PregameProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6 p-6 border border-[#333] rounded-md bg-white/80">
      <h2 className="text-2xl font-bold mb-4">Hangman: Choose Your Mode</h2>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded transition-all"
          onClick={() => setMode("default")}
        >
          Play (max. 6 guesses)
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded transition-all"
          onClick={() => setMode("timed")}
        >
          Play (Timed)
        </button>
        <button
          className="bg-gray-400 text-white font-semibold py-3 px-6 rounded cursor-not-allowed"
          disabled
        >
          Play with Friends (Coming Soon)
        </button>
      </div>
    </div>
  );
}
