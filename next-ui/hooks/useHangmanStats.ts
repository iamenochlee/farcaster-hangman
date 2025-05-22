import { useAccount, useReadContract } from "wagmi";
import {
  HANGMAN_CONTRACT_ADDRESS,
  HANGMAN_CONTRACT_ABI,
} from "@/contracts/config";

export function useHangmanStats() {
  const { address } = useAccount();
  const { data, isLoading, error } = useReadContract({
    address: HANGMAN_CONTRACT_ADDRESS,
    abi: HANGMAN_CONTRACT_ABI,
    functionName: "userStats",
    args: address ? [address] : undefined,
  });

  // data is [wordsGuessed, gamesPlayed]
  return {
    gamesPlayed: Array.isArray(data) && data[1] ? Number(data[1]) : 0,
    wordsGuessed: Array.isArray(data) && data[0] ? Number(data[0]) : 0,
    isLoading,
    error,
  };
}
