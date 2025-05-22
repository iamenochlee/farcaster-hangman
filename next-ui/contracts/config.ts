import { parseEther } from "viem";
import HangmanGameABI from "./HangmanGameAbi.json";

export const HANGMAN_CONTRACT_ADDRESS =
  "0xd70Feee2B69b81196d6E73B7a4FFA770a7d7d098";
export const HANGMAN_CONTRACT_ABI = HangmanGameABI;
export const MIN_STAKE = parseEther("0.05");
