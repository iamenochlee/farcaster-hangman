import React, { useState } from "react";
import { AudioControl } from "./AudioControl";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { User } from "../User";
import Image from "next/image";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { context } = useMiniAppContext();
  const [showProfile, setShowProfile] = useState(false);
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FBFAF9] font-inter">
      {/* Header */}
      <header className="w-full bg-[#200052] text-white flex items-center justify-between px-6 py-4 shadow-md">
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
      <footer className="w-full bg-[#200052] text-[#FBFAF9] flex items-center justify-around py-3 border-t border-[#836EF9] relative">
        <button className="flex flex-col items-center focus:outline-none">
          <svg
            width="32"
            height="32"
            fill="none"
            stroke="#836EF9"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" />
          </svg>
        </button>
        <button className="flex flex-col items-center focus:outline-none opacity-60 cursor-not-allowed">
          <svg width="40" height="34" fill="none" viewBox="0 0 32 32">
            <rect x="6" y="18" width="4" height="8" rx="1" fill="#836EF9" />
            <rect x="14" y="12" width="4" height="14" rx="1" fill="#836EF9" />
            <rect x="22" y="22" width="4" height="4" rx="1" fill="#836EF9" />
            <path
              d="M16 8l1.176 2.382 2.624.381-1.9 1.852.449 2.617L16 13.236l-2.349 1.246.449-2.617-1.9-1.852 2.624-.381z"
              fill="#836EF9"
            />
          </svg>
          <span className="text-[10px] text-[#836EF9] mt-0">(soon)</span>
        </button>
        <div className="relative">
          <button
            className="flex flex-col items-center focus:outline-none"
            onClick={() => setShowProfile(true)}
            disabled={showProfile}
          >
            <Image
              src={context?.user?.pfpUrl!}
              className="w-6 h-6 rounded-full"
              alt="User Profile Picture"
              width={12}
              height={12}
            />
          </button>
          {showProfile && (
            <div className="absolute bottom-full right-0 mb-2 z-50 min-w-[320px]">
              <div className="relative bg-white border border-[#836EF9] rounded-xl shadow-lg p-0">
                <button
                  className="absolute top-2 right-2 text-[#836EF9] bg-white rounded-full p-1 shadow focus:outline-none"
                  onClick={() => setShowProfile(false)}
                  aria-label="Close profile"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <User />
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
