/**
 * Formatting utilities for ProofStream
 * Adheres to Part 2.7 of strict operating rules:
 * - USDC formatted consistently (2 decimals + "USDC")
 * - Addresses always truncated with copyable representation
 * - Timestamps relative with absolute representation
 */

export function formatUSDC(amount: number | string | bigint | null | undefined): string {
  if (amount === null || amount === undefined) return "0.00 USDC";
  const num = typeof amount === "bigint" ? Number(amount) / 10**6 : Number(amount);
  if (isNaN(num)) return "0.00 USDC";
  return `${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`;
}

export function formatAddress(address: string | null | undefined): string {
  if (!address) return "0x000...0000";
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTxHash(hash: string | null | undefined): string {
  if (!hash) return "0x0000...0000";
  if (hash.length < 12) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export function formatRelativeTime(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return "Recently";
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatConfidence(confidence: number | null | undefined): string {
  if (confidence === null || confidence === undefined) return "0%";
  const pct = Math.round(confidence * 100);
  return `${pct}%`;
}
