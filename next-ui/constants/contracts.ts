export const HANGMAN_CONTRACT_ADDRESS = "" as const;

export const GAME_FEE = "0.01"; // in ETH

export const HANGMAN_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "category",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timeLimit",
        type: "uint256",
      },
    ],
    name: "startGame",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "letter",
        type: "string",
      },
    ],
    name: "makeGuess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getGameState",
    outputs: [
      {
        internalType: "string",
        name: "word",
        type: "string",
      },
      {
        internalType: "string",
        name: "maskedWord",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "remainingGuesses",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isGameOver",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isWon",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
