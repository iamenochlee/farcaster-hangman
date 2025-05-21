"use client";

import { SafeAreaContainer } from "@/utils/safe-area-container";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { User } from "./User";
import { useAccount, useConnect } from "wagmi";
import { useState } from "react";
import { GameLayout, LandingPage, Pregame, DefaultHangmanGame } from "./Game";

export default function App() {
  const { context } = useMiniAppContext();
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [mode, setMode] = useState<"none" | "default">("none");

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      {context?.user ? (
        <GameLayout>
          <User />
          {isConnected ? (
            <>
              {mode === "none" ? (
                <Pregame setMode={setMode} />
              ) : (
                <DefaultHangmanGame setMode={setMode} />
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => connect({ connector: connectors[0] })}
            >
              Connect Wallet
            </button>
          )}
        </GameLayout>
      ) : (
        <LandingPage />
      )}
    </SafeAreaContainer>
  );
}
