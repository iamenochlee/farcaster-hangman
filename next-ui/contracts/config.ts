import { parseEther } from "viem";
import HangmanGameABI from "./HangmanGame.json";

export const HANGMAN_CONTRACT_ADDRESS =
  "0x90Fc423842f552D61B52a47e6E6eaA8F8c76A1CD";
export const HANGMAN_CONTRACT_ABI = HangmanGameABI;
export const MIN_STAKE = parseEther("0.01");
