import { encodeAbiParameters, parseAbiParameters, keccak256, toHex, stringToHex, Hex } from "viem";
import { getVerifierWalletClient, getVerifierAccount, publicClient } from "./chainsigner";

// Verified canonical Base Sepolia EAS predeploy (Chain 84532)
export const EAS_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_EAS_ADDRESS as `0x${string}`) ||
  "0x4200000000000000000000000000000000000021";

export const EAS_SCHEMA_REGISTRY_ADDRESS =
  (process.env.NEXT_PUBLIC_SCHEMA_REGISTRY as `0x${string}`) ||
  "0x4200000000000000000000000000000000000020";

export const PROOFSTREAM_EAS_SCHEMA =
  "uint256 milestoneId, bytes32 evidenceCid, uint8 verdict, uint256 confidence, bytes32 reasoningHash, string reasoningUri";

export const EAS_ABI = [
  {
    type: "function",
    name: "attest",
    inputs: [
      {
        name: "request",
        type: "tuple",
        components: [
          { name: "schema", type: "bytes32" },
          {
            name: "data",
            type: "tuple",
            components: [
              { name: "recipient", type: "address" },
              { name: "expirationTime", type: "uint64" },
              { name: "revocable", type: "bool" },
              { name: "refUID", type: "bytes32" },
              { name: "data", type: "bytes" },
              { name: "value", type: "uint256" }
            ]
          }
        ]
      }
    ],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "getAttestation",
    inputs: [{ name: "uid", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "uid", type: "bytes32" },
          { name: "schema", type: "bytes32" },
          { name: "time", type: "uint64" },
          { name: "expirationTime", type: "uint64" },
          { name: "revocationTime", type: "uint64" },
          { name: "refUID", type: "bytes32" },
          { name: "recipient", type: "address" },
          { name: "attester", type: "address" },
          { name: "revocable", type: "bool" },
          { name: "data", type: "bytes" }
        ]
      }
    ],
    stateMutability: "view"
  }
] as const;

export interface AttestationData {
  milestoneId: number;
  evidenceCid: string;
  verdict: number; // 1: PASSED, 2: REJECTED, 3: FLAGGED
  confidence: number; // 0..10000
  reasoningHash: string;
  reasoningUri: string;
}

export function encodeAttestationPayload(data: AttestationData): `0x${string}` {
  // Convert evidence CID string to bytes32 or keccak hash if longer than 32 bytes
  const evidenceCidBytes32 = keccak256(stringToHex(data.evidenceCid));
  const reasoningHashBytes32 = data.reasoningHash.startsWith("0x")
    ? (data.reasoningHash as `0x${string}`)
    : (keccak256(stringToHex(data.reasoningHash)) as `0x${string}`);

  return encodeAbiParameters(
    parseAbiParameters(
      "uint256 milestoneId, bytes32 evidenceCid, uint8 verdict, uint256 confidence, bytes32 reasoningHash, string reasoningUri"
    ),
    [
      BigInt(data.milestoneId),
      evidenceCidBytes32,
      data.verdict,
      BigInt(data.confidence),
      reasoningHashBytes32,
      data.reasoningUri,
    ]
  );
}

export async function createAttestationOnChain(
  recipient: `0x${string}`,
  schemaUID: `0x${string}`,
  data: AttestationData
): Promise<{ attestationUID: `0x${string}`; txHash: `0x${string}` }> {
  const walletClient = getVerifierWalletClient();
  const account = getVerifierAccount();
  const encodedData = encodeAttestationPayload(data);

  const txHash = await walletClient.writeContract({
    address: EAS_CONTRACT_ADDRESS,
    abi: EAS_ABI,
    functionName: "attest",
    args: [
      {
        schema: schemaUID,
        data: {
          recipient,
          expirationTime: 0n,
          revocable: false,
          refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
          data: encodedData,
          value: 0n,
        },
      },
    ],
    account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  
  // Extract attestation UID from receipt logs or generate deterministic UID
  const attestationUID = receipt.logs[0]?.topics[1] || keccak256(stringToHex(`${txHash}-${data.milestoneId}`));

  return {
    attestationUID: attestationUID as `0x${string}`,
    txHash,
  };
}
