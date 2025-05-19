import { parseEther } from "viem";
import HangmanGameABI from "./HangmanGameAbi.json";

export const HANGMAN_CONTRACT_ADDRESS =
  "0x712657E17E41fb9909063B047D4CC2FEC71905E3";
export const HANGMAN_CONTRACT_ABI = HangmanGameABI;
export const MIN_STAKE = parseEther("0.01");
