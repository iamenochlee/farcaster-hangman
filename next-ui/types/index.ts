export interface SafeAreaInsets {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}
export const categories = {
  shuffle: "Shuffle",
  random: "Random",
  countries: "Countries",
  dapps: "DApps",
  blockchains: "Blockchains",
  sports: "Sports",
  social: "Social Platforms",
  colours: "Colors",
} as const;

export interface GameState {
  timeLimit: unknown;
  wordLength: number;
  maskedWord: string;
  remainingGuesses: number;
  gameId: string;
  guessedLetters: Set<string>;
  gameStatus: "idle" | "playing" | "won" | "lost";
  category: string | null;
  word?: string;
  nonce?: string;
  commitment?: string;
  startTime?: number;
}
