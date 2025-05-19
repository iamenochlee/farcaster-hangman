import { NextResponse } from "next/server";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { monadTestnet } from "viem/chains";
import {
  HANGMAN_CONTRACT_ADDRESS,
  HANGMAN_CONTRACT_ABI,
} from "@/contracts/config";

// Initialize the wallet client with the admin's private key
const adminAccount = privateKeyToAccount(
  process.env.ADMIN_PRIVATE_KEY as `0x${string}`
);
const walletClient = createWalletClient({
  account: adminAccount,
  transport: http(monadTestnet.rpcUrls.default.http[0]),
});

export async function POST(request: Request) {
  try {
    const { gameId, word, nonce } = await request.json();

    console.log(gameId, word, nonce);

    // The nonce should already be in the correct format (0x-prefixed hex string)
    const nonceBytes = nonce as `0x${string}`;

    // Call the completeGame function using the admin wallet
    const hash = await walletClient.writeContract({
      address: HANGMAN_CONTRACT_ADDRESS,
      abi: HANGMAN_CONTRACT_ABI,
      functionName: "completeGame",
      args: [gameId, word, nonceBytes],
      chain: monadTestnet,
    });

    return NextResponse.json({ success: true, hash });
  } catch (error) {
    console.error("Error completing game:", error);
    return NextResponse.json(
      { error: "Failed to complete game" },
      { status: 500 }
    );
  }
}
