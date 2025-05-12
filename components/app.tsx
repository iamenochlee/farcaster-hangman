"use client";

import { SafeAreaContainer } from "@/utils/safe-area-container";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { HangmanGame } from "./Game/HangmanGame";
import { User } from "./User";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Home() {
  const { context } = useMiniAppContext();
  const { isConnected, address, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <div>
        <User />
        {isConnected ? (
          <HangmanGame />
        ) : (
          <button
            type="button"
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect Wallet
          </button>
        )}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    </SafeAreaContainer>
  );
}
