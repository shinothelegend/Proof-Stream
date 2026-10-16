export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const OFFICIAL_BASE_SEPOLIA_USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
export const OFFICIAL_BASE_SEPOLIA_EAS = "0x4200000000000000000000000000000000000021";
export const OFFICIAL_BASE_SEPOLIA_SCHEMA_REGISTRY = "0x4200000000000000000000000000000000000020";

export const ESCROW_ABI = [
  {
    type: "function",
    name: "fund",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "release",
    inputs: [
      { name: "milestoneId", type: "uint256" },
      { name: "_attestationUID", type: "bytes32" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "logDecision",
    inputs: [
      { name: "milestoneId", type: "uint256" },
      { name: "verdict", type: "uint8" },
      { name: "confidence", type: "uint256" },
      { name: "evidenceCid", type: "bytes32" },
      { name: "reasoningHash", type: "bytes32" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "refund",
    inputs: [{ name: "milestoneId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getMilestonesCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getMilestone",
    inputs: [{ name: "idx", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "description", type: "string" },
          { name: "amount", type: "uint256" },
          { name: "deadline", type: "uint64" },
          { name: "released", type: "bool" },
          { name: "refunded", type: "bool" },
          { name: "attestationUID", type: "bytes32" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "usdc",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "ngo",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "Funded",
    inputs: [
      { name: "donor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "TrancheReleased",
    inputs: [
      { name: "milestoneId", type: "uint256", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "attestationUID", type: "bytes32", indexed: false }
    ]
  },
  {
    type: "event",
    name: "DecisionLogged",
    inputs: [
      { name: "milestoneId", type: "uint256", indexed: true },
      { name: "verdict", type: "uint8", indexed: false },
      { name: "confidence", type: "uint256", indexed: false },
      { name: "evidenceCid", type: "bytes32", indexed: false },
      { name: "reasoningHash", type: "bytes32", indexed: false }
    ]
  }
] as const;

export const ERC20_ABI = [
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "publicMint",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  }
] as const;
