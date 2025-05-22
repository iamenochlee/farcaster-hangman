import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    accountAssociation: {
      header:
        "eyJmaWQiOjQ0NTA5NSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEZDQ2I5MTBENTM0OGZCZDU5MkU4NjM2RDk5OTI2QWNFRUVhRmU1ZDEifQ",
      payload: "eyJkb21haW4iOiJmYXJjYXN0ZXItaGFuZ21hbi52ZXJjZWwuYXBwIn0",
      signature:
        "MHhmZjdlMzVkZWJhZjQwYWE1YTU2M2ZmYzVhOTVmNWJjOWYxMWNhYjcwYmQyNTBhOGNkNzA3MDhlMGMwNDZjMDM1NjRjMTQwN2M3YTZmMzk2MjA5YmM1YzY4ZTdkZjk4NTEzY2Y2MGYyMjc3YzBlMzM2Yzg3NTlhZjMyNzFmNmRmMDFi",
    },

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
