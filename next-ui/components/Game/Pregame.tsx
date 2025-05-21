import React from "react";

export default function Pregame({
  setMode,
}: {
  setMode: (mode: "default") => void;
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-8 gap-6 bg-[#200052] min-h-[calc(100vh-120px)]">
      {/* Hangman SVG Illustration */}
      <div className="flex justify-center">
        <svg width="120" height="140" className="mb-4">
          <line
            x1="30"
            y1="130"
            x2="100"
            y2="130"
            stroke="#836EF9"
            strokeWidth="6"
          />
          <line
            x1="65"
            y1="130"
            x2="65"
            y2="30"
            stroke="#836EF9"
            strokeWidth="6"
          />
          <line
            x1="65"
            y1="30"
            x2="100"
            y2="30"
            stroke="#836EF9"
            strokeWidth="6"
          />
          <line
            x1="100"
            y1="30"
            x2="100"
            y2="50"
            stroke="#836EF9"
            strokeWidth="6"
          />
          <circle
            cx="100"
            cy="60"
            r="12"
            stroke="#A0055D"
            strokeWidth="4"
            fill="none"
          />
          <line
            x1="100"
            y1="72"
            x2="100"
            y2="100"
            stroke="#A0055D"
            strokeWidth="4"
          />
          <line
            x1="100"
            y1="80"
            x2="90"
            y2="90"
            stroke="#A0055D"
            strokeWidth="4"
          />
          <line
            x1="100"
            y1="80"
            x2="110"
            y2="90"
            stroke="#A0055D"
            strokeWidth="4"
          />
          <line
            x1="100"
            y1="100"
            x2="95"
            y2="120"
            stroke="#A0055D"
            strokeWidth="4"
          />
          <line
            x1="100"
            y1="100"
            x2="105"
            y2="120"
            stroke="#A0055D"
            strokeWidth="4"
          />
        </svg>
      </div>
      {/* Play Buttons */}
      <div className="flex flex-col w-full bg-[#836EF9]">
        <button
          onClick={() => setMode("default")}
          className="w-full py-3 text-white font-semibold text-lg focus:outline-none rounded-none bg-transparent hover:bg-[#200052] transition-colors"
        >
          Play (max 6 guess)
        </button>
        <button
          disabled
          className="w-full py-3 text-white font-semibold text-lg focus:outline-none rounded-none bg-transparent opacity-50 cursor-not-allowed border-t border-[#0E100F]"
        >
          Play (Timed 2 min) (coming soon)
        </button>
        <button
          disabled
          className="w-full py-3 text-white font-semibold text-lg focus:outline-none rounded-none bg-transparent opacity-50 cursor-not-allowed border-t border-[#0E100F]"
        >
          Play with friends (coming soon)
        </button>
      </div>
      {/* Share Button */}
      <button className="mt-6 flex items-center gap-2 px-6 py-2 bg-[#200052] text-white rounded-full font-medium shadow hover:bg-[#836EF9] transition-colors">
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
    </div>
  );
}
