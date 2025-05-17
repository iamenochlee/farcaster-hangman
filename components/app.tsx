"use client";

import { SafeAreaContainer } from "@/utils/safe-area-container";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { HangmanGame } from "./Game/HangmanGame";
import { User } from "./User";
import { useAccount, useConnect } from "wagmi";
import { useState } from "react";
import TimedHangmanGame from "./Game/TimedHangmanGame";
import Pregame from "./Game/Pregame";

export default function Home() {
  const { context } = useMiniAppContext();
  const { isConnected, address, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const [mode, setMode] = useState<"none" | "timed" | "default">("none");

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <div>
        <User />
        {isConnected ? (
          mode === "none" ? (
            <Pregame setMode={setMode} />
          ) : mode === "timed" ? (
            <TimedHangmanGame setMode={setMode} />
          ) : (
            <HangmanGame setMode={setMode} />
          )
        ) : (
          <button
            type="button"
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </SafeAreaContainer>
  );
}
