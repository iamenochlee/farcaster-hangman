import sdk from "@farcaster/frame-sdk";
import React, { useEffect } from "react";

export default function Pregame({
  setMode,
}: {
  setMode: (mode: "default") => void;
}) {
  useEffect(() => {
    if (sdk?.actions?.addFrame) {
      sdk.actions.addFrame();
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-8 gap-6 bg-white min-h-[calc(100vh-120px)]">
      {/* Hangman SVG Illustration */}
      <div className="flex justify-center">
        <svg width="120" height="140" className="mb-4">
          <line
            x1="100"
            y1="130"
            x2="30"
            y2="130"
            stroke="#836EF9"
            strokeWidth="6"
          />
          <line
            x1="30"
            y1="130"
            x2="30"
            y2="30"
            stroke="#836EF9"
            strokeWidth="6"
          />
          <line
            x1="30"
            y1="30"
            x2="65"
            y2="30"
            stroke="#836EF9"
            strokeWidth="6"
          />
          <line
            x1="65"
            y1="30"
            x2="65"
            y2="50"
            stroke="#836EF9"
            strokeWidth="6"
          />
          <circle
            cx="65"
            cy="60"
            r="12"
            stroke="#A0055D"
            strokeWidth="4"
            fill="none"
          />
          <line
            x1="65"
            y1="72"
            x2="65"
            y2="100"
            stroke="#A0055D"
            strokeWidth="4"
          />
          <line
            x1="65"
            y1="80"
            x2="55"
            y2="90"
            stroke="#A0055D"
            strokeWidth="4"
          />
          <line
            x1="65"
            y1="80"
            x2="75"
            y2="90"
            stroke="#A0055D"
            strokeWidth="4"
          />
          <line
            x1="65"
            y1="100"
            x2="60"
            y2="120"
            stroke="#A0055D"
            strokeWidth="4"
          />
          <line
            x1="65"
            y1="100"
            x2="70"
            y2="120"
            stroke="#A0055D"
            strokeWidth="4"
          />
        </svg>
      </div>
      {/* Play Buttons */}
      <div className="flex flex-col w-full">
        <button
          onClick={() => setMode("default")}
          className="w-full py-3 text-white font-semibold text-lg focus:outline-none rounded-none bg-[#836EF9] hover:bg-[#200052] transition-colors border-2 border-[#836EF9]"
        >
          Play <span className="text-xs">(max 6 guess)</span>
        </button>
        <button
          disabled
          className="w-full py-3 text-[#836EF9] font-semibold text-lg focus:outline-none rounded-none bg-[#E6E2F8] cursor-not-allowed border-1 border-[#836EF9]"
        >
          Play Timed <span className="text-xs">(coming soon)</span>
        </button>
        <button
          disabled
          className="w-full py-3 text-[#836EF9] font-semibold text-lg focus:outline-none rounded-none bg-[#E6E2F8] cursor-not-allowed border-2 border-[#836EF9]"
        >
          Play with friends <span className="text-xs">(coming soon)</span>
        </button>
      </div>
      {/* Share Button */}
      <button
        onClick={() => {
          sdk.actions.composeCast({
            text: "Play Hangman on Monad! 🎉",
            embeds: [window.location.href],
          });
        }}
        className="mt-4 flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-[#836EF9] text-white shadow hover:bg-[#200052] transition-colors focus:outline-none focus:ring-2 focus:ring-[#836EF9]"
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
    </div>
  );
}
