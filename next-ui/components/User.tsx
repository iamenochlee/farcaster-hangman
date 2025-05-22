"use client";

import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { useHangmanStats } from "@/hooks/useHangmanStats";
import { useEffect } from "react";
import { monadTestnet } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";
import Image from "next/image";

export function User() {
  const { context } = useMiniAppContext();
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { gamesPlayed, wordsGuessed, isLoading, error } = useHangmanStats();

  useEffect(() => {
    if (chainId !== monadTestnet.id) {
      switchChain({ chainId: monadTestnet.id });
    }
  }, [chainId, switchChain]);

  const winRate =
    gamesPlayed > 0 ? ((wordsGuessed / gamesPlayed) * 100).toFixed(1) : "0";

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-4">
      <div className="flex flex-row items-center space-x-4 border border-[#836EF9] rounded-md p-4 bg-white">
        {context?.user?.pfpUrl && (
          <Image
            src={context?.user?.pfpUrl}
            className="w-14 h-14 rounded-full"
            alt="User Profile Picture"
            width={56}
            height={56}
          />
        )}
        <span className="text-lg text-[#200052] font-semibold">
          {context?.user?.username ? `@${context.user.username}` : "User"}
        </span>
      </div>
      <div className="mt-6 w-full max-w-xs bg-white rounded-xl p-6 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold text-[#836EF9] mb-2">Hangman Stats</h2>
        {isLoading ? (
          <div className="text-[#836EF9]">Loading stats...</div>
        ) : error ? (
          <div className="text-red-500">Error loading stats</div>
        ) : (
          <>
            <div className="flex justify-between w-full text-[#200052]">
              <span>Games Played:</span>
              <span className="font-semibold">{gamesPlayed}</span>
            </div>
            <div className="flex justify-between w-full text-[#200052]">
              <span>Words Guessed:</span>
              <span className="font-semibold">{wordsGuessed}</span>
            </div>
            <div className="flex justify-between w-full text-[#200052]">
              <span>Win Rate:</span>
              <span className="font-semibold">{winRate}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
