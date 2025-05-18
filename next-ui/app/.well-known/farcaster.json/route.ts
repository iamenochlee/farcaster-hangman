import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    // TODO: Add account association
    frame: {
      version: "1",
      name: "Hangman Game",
      subtitle: "Play Hangman on Farcaster",
      description: "Play Hangman on Farcaster",
      iconUrl: `${APP_URL}/images/icon.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/feed.png`,
      tags: ["monad", "farcaster", "miniapp", "game", "hangman"],
      primaryCategory: "games",
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#00ff00",
    },
  };

  return NextResponse.json(farcasterConfig);
}
