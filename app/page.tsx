import { Metadata } from "next";
import dynamic from "next/dynamic";
import { APP_URL } from "@/lib/constants";

// Dynamically import App with SSR disabled
const App = dynamic(() => import("@/components/app"), { ssr: false });

const frame = {
  version: "next",
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: "Play Hangman",
    action: {
      type: "launch_frame",
      name: "Hangman Game",
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#00ff00",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hangman Game",
    description: "Play Hangman on Farcaster",
    icons: {
      icon: `${APP_URL}/images/favicon.ico`,
    },
    openGraph: {
      title: "Hangman Game",
      description: "Play Hangman on Farcaster",
      images: {
        url: `${APP_URL}/images/opengraph-image.png`,
      },
    },

    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
