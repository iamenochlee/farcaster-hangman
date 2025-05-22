import React from "react";

export default function LandingPage() {
  const openInWarpcast = () => {
    window.location.href = `https://warpcast.com/miniapps/MPqv6snxjuAx/hangman-game`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#0E100F] font-inter">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-6 border border-[#836EF9] max-w-xs w-full">
        <h1 className="text-3xl font-bold text-[#200052] mb-2">Play Hangman</h1>
        {/* Simple SVG Hangman Drawing */}
        <svg width="100" height="120" className="mb-4">
          <line
            x1="80"
            y1="110"
            x2="20"
            y2="110"
            stroke="#836EF9"
            strokeWidth="4"
          />
          <line
            x1="20"
            y1="110"
            x2="20"
            y2="20"
            stroke="#836EF9"
            strokeWidth="4"
          />
          <line
            x1="20"
            y1="20"
            x2="50"
            y2="20"
            stroke="#836EF9"
            strokeWidth="4"
          />
          <line
            x1="50"
            y1="20"
            x2="50"
            y2="40"
            stroke="#836EF9"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="10"
            stroke="#A0055D"
            strokeWidth="3"
            fill="none"
          />
          <line
            x1="50"
            y1="60"
            x2="50"
            y2="85"
            stroke="#A0055D"
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="70"
            x2="40"
            y2="80"
            stroke="#A0055D"
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="70"
            x2="60"
            y2="80"
            stroke="#A0055D"
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="85"
            x2="45"
            y2="100"
            stroke="#A0055D"
            strokeWidth="3"
          />
          <line
            x1="50"
            y1="85"
            x2="55"
            y2="100"
            stroke="#A0055D"
            strokeWidth="3"
          />
        </svg>
        <button
          onClick={openInWarpcast}
          className="w-full py-3 bg-[#836EF9] text-white rounded-lg font-semibold hover:bg-[#200052] transition-colors"
        >
          Open in Warpcast
        </button>
        <div className="text-xs text-[#0E100F] mt-4">©2025 by enochlee</div>
      </div>
    </div>
  );
}
