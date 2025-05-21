import { NextResponse } from "next/server";
import wordLists from "@/data/wordLists.json";
import { randomBytes } from "crypto";
import { keccak256 } from "ethers";

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

  // Generate a random nonce for this game (32 bytes)
  const nonceBytes = randomBytes(32);
  const nonce = `0x${nonceBytes.toString("hex")}`;

  // Store game state
  activeGames.set(newGameId, {
    word: randomWord,
    guessedLetters: new Set(),
    remainingGuesses: 6,
    startTime: Date.now(),
    nonce,
  });

  // Generate commitment using raw bytes of nonce
  const commitment = keccak256(
    Buffer.concat([Buffer.from(randomWord), nonceBytes])
  );

  console.log(randomWord, commitment, "\nnonce:", nonce);

  return NextResponse.json({
    wordLength: randomWord.length,
    maskedWord: "_".repeat(randomWord.length),
    remainingGuesses: 6,
    gameId: newGameId,
    category: selectedCategory,
    commitment,
    mode: "default",
    timeLimit: 0,
    startTime: Date.now(),
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

    // Only check remainingGuesses
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

    // Only consider remainingGuesses for game over in default mode
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
