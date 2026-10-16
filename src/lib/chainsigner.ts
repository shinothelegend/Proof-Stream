import { createWalletClient, createPublicClient, http, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { ESCROW_ABI } from "./contracts";

/**
 * Isolated Backend Chain Signer for ProofStream
 * Adheres strictly to Non-Negotiable #5:
 * The verifier release key lives ONLY on the server environment.
 * The client bundle never imports or accesses this module.
 */

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.base.org";

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});

export function getVerifierAccount() {
  const rawKey = process.env.VERIFIER_PRIVATE_KEY;
  if (!rawKey) {
    throw new Error(
      "VERIFIER_PRIVATE_KEY is missing from environment. In accordance with ProofStream strict real-data law §1.3, on-chain release cannot be simulated. Please configure a valid testnet private key."
    );
  }
  const formattedKey = (rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`) as Hex;
  return privateKeyToAccount(formattedKey);
}

export function getVerifierWalletClient() {
  const account = getVerifierAccount();
  return createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
}

/**
 * Releases milestone tranche on-chain through CampaignEscrow
 */
export async function releaseTrancheOnChain(
  escrowAddress: `0x${string}`,
  milestoneId: number,
  attestationUID: `0x${string}`
) {
  const client = getVerifierWalletClient();
  const account = getVerifierAccount();

  const hash = await client.writeContract({
    address: escrowAddress,
    abi: ESCROW_ABI,
    functionName: "release",
    args: [BigInt(milestoneId), attestationUID],
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return { hash, receipt };
}

/**
 * Emits DecisionLogged audit record event on-chain
 */
export async function logDecisionOnChain(
  escrowAddress: `0x${string}`,
  milestoneId: number,
  verdictEnum: number, // 0: PENDING, 1: PASSED, 2: REJECTED, 3: FLAGGED
  confidenceScaled: number, // 0 to 10000
  evidenceCidBytes32: `0x${string}`,
  reasoningHashBytes32: `0x${string}`
) {
  const client = getVerifierWalletClient();
  const account = getVerifierAccount();

  const hash = await client.writeContract({
    address: escrowAddress,
    abi: ESCROW_ABI,
    functionName: "logDecision",
    args: [
      BigInt(milestoneId),
      verdictEnum,
      BigInt(confidenceScaled),
      evidenceCidBytes32,
      reasoningHashBytes32,
    ],
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return { hash, receipt };
}
