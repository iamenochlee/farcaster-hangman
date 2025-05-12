import { NextResponse } from "next/server";
import wordLists from "@/data/wordLists.json";
import { randomBytes } from "crypto";
import { keccak256, concat } from "ethers";

// Store active games in memory (in production, use a proper database)
const activeGames = new Map<
  string,
  {
    word: string;
    guessedLetters: Set<string>;
    remainingGuesses: number;
    startTime: number;
    nonce: string;
  }
>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "shuffle";

  // For shuffle category, randomly select from all categories including random
  let selectedCategory = category;
  if (category === "shuffle") {
    const allCategories = Object.keys(wordLists);
    selectedCategory =
      allCategories[Math.floor(Math.random() * allCategories.length)];
  }

  // Start new game
  let availableWords =
    wordLists[selectedCategory as keyof typeof wordLists] || [];

  const randomWord =
    availableWords[
      Math.floor(Math.random() * availableWords.length)
    ].toUpperCase();
  const newGameId = Date.now().toString();
  const remainingGuesses = Math.max(
    6,
    6 + Math.floor((randomWord.length - 6) / 3)
  );

  // Generate a random nonce for this game
  const nonce = randomBytes(32).toString("hex");

  // Store game state
  activeGames.set(newGameId, {
    word: randomWord,
    guessedLetters: new Set(),
    remainingGuesses,
    startTime: Date.now(),
    nonce,
  });

  const commitment = keccak256(new TextEncoder().encode(randomWord + nonce));

  console.log(randomWord, commitment, "\nnonce:", nonce);

  return NextResponse.json({
    wordLength: randomWord.length,
    maskedWord: "_".repeat(randomWord.length),
    remainingGuesses,
    gameId: newGameId,
    category: selectedCategory,
    commitment,
  });
}

export async function POST(request: Request) {
  try {
    const { gameId, letter } = await request.json();

    if (!gameId || !letter || !activeGames.has(gameId)) {
      return NextResponse.json(
        { error: "Invalid game or guess" },
        { status: 400 }
      );
    }

    const game = activeGames.get(gameId)!;
    if (game.remainingGuesses <= 0) {
      return NextResponse.json({ error: "Game already over" }, { status: 400 });
    }

    const upperLetter = letter.toUpperCase();
    // Process the guess
    const isCorrectGuess = game.word.includes(upperLetter);
    if (!game.guessedLetters.has(upperLetter)) {
      game.guessedLetters.add(upperLetter);
      if (!isCorrectGuess) {
        game.remainingGuesses--;
      }
    }

    // Check win condition
    const isWon = game.word
      .toUpperCase()
      .split("")
      .every((char) => game.guessedLetters.has(char));

    // Update masked word
    const maskedWord = game.word
      .split("")
      .map((char) => (game.guessedLetters.has(char.toUpperCase()) ? char : "_"))
      .join("");

    const isGameOver = game.remainingGuesses <= 0 || isWon;

    return NextResponse.json({
      maskedWord,
      remainingGuesses: game.remainingGuesses,
      isCorrectGuess,
      isWon,
      isGameOver,
      guessedLetters: Array.from(game.guessedLetters),
      word: isGameOver ? game.word : undefined,
      nonce: isWon ? game.nonce : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  }
}
