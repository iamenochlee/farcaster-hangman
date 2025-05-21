import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { useEffect } from "react";
import { monadTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { useSwitchChain } from "wagmi";

export function User() {
  const { context } = useMiniAppContext();
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (chainId !== monadTestnet.id) {
      switchChain({ chainId: monadTestnet.id });
    }
  }, [chainId, switchChain]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-4 bg-[#200052]">
      <div className="flex flex-row items-center space-x-4 border border-[#333] rounded-md p-4">
        {context?.user?.pfpUrl && (
          <img
            src={context?.user?.pfpUrl}
            className="w-14 h-14 rounded-full"
            alt="User Profile Picture"
            width={56}
            height={56}
          />
        )}
        <span className="text-lg text-white font-semibold">
          {`Let's save the day @${context?.user?.username}`}
        </span>
      </div>
    </div>
  );
}
