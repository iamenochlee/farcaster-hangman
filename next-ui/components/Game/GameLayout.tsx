import React from "react";
import { AudioControl } from "./AudioControl";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FBFAF9] font-inter">
      {/* Header */}
      <header className="w-full bg-[#0E100F] text-white flex items-center justify-between px-6 py-4 shadow-md">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">HANGMAN</h1>
          <span className="text-xs text-[#836EF9]">live on monad-testnet</span>
        </div>
        <AudioControl />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0E100F] text-[#FBFAF9] flex items-center justify-around py-3 border-t border-[#836EF9]">
        <button className="flex flex-col items-center focus:outline-none">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#836EF9"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 12l9-9 9 9" />
            <path d="M9 21V9h6v12" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center focus:outline-none opacity-60 cursor-not-allowed">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#836EF9"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2" />
          </svg>
          <span className="text-xs mt-1">Leaderboard</span>
          <span className="text-[10px] text-[#836EF9]">(soon)</span>
        </button>
        <button className="flex flex-col items-center focus:outline-none">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#836EF9"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M12 13c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </footer>
    </div>
  );
}
