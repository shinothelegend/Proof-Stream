"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { formatTxHash } from "@/lib/format";

interface CopyHashProps {
  value: string;
  display?: string;
  className?: string;
}

export function CopyHash({ value, display, className = "" }: CopyHashProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Hash copied to clipboard", {
      description: value,
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDisplay = display || formatTxHash(value);

  return (
    <span
      onClick={handleCopy}
      title={`${value} (Click to copy)`}
      className={`inline-flex items-center space-x-1 font-mono text-[12px] text-pix-accent hover:text-pix-ink cursor-pointer transition-colors group select-none ${className}`}
    >
      <span>{formattedDisplay}</span>
      {copied ? (
        <Check className="w-3 h-3 text-pix-success flex-shrink-0" />
      ) : (
        <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      )}
    </span>
  );
}
