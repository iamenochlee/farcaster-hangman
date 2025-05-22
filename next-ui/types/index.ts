export interface SafeAreaInsets {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}
export const categories = {
  shuffle: "Shuffle",
  countries: "Countries",
  colours: "Colors",
  dapps: "DApps",
  blockchains: "Blockchains",
  sports: "Sports",
  social: "Social Platforms",
  random: "Random",
} as const;

export interface GameState {
  wordLength: number;
  maskedWord: string;
  remainingGuesses: number;
  gameId: string;
  guessedLetters: Set<string>;
  gameStatus: "idle" | "playing" | "won" | "lost" | "success";
  category: string | null;
  word?: string;
  nonce?: string;
  commitment?: string;
  startTime?: number;
  transactionHash?: string;
}
