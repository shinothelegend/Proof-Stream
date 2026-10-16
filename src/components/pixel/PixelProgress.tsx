"use client";

import React from "react";
import { motion } from "framer-motion";

interface PixelProgressProps {
  current?: number;
  total?: number;
  value?: number;
  variant?: "mint" | "gold" | "cyan";
  height?: number; // default 14px
  showLabel?: boolean;
  className?: string;
}

export function PixelProgress({
  current,
  total,
  value,
  variant = "gold",
  height = 14,
  showLabel = false,
  className = "",
}: PixelProgressProps) {
  const percent =
    value !== undefined
      ? Math.min(100, Math.max(0, Math.round(value)))
      : Math.min(100, Math.max(0, Math.round(((current || 0) / (total || 1)) * 100)));

  const getFillColor = () => {
    switch (variant) {
      case "mint":
        return "bg-pix-mint";
      case "cyan":
        return "bg-pix-cyan";
      case "gold":
      default:
        return "bg-pix-gold";
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-[10px] font-heading uppercase text-pix-dim">
          <span>XP PROGRESS</span>
          <span className="font-mono text-pix-cyan font-bold">{percent}%</span>
        </div>
      )}

      {/* HP Bar Outer Border */}
      <div
        className="w-full bg-black/60 border-2 border-[var(--color-pix-border)] p-[2px] shadow-[2px_2px_0_0_#000000] relative overflow-hidden"
        style={{ height: `${height + 6}px` }}
      >
        {/* Animated Stepped Bar */}
        <motion.div
          className={`h-full ${getFillColor()} relative`}
          initial={{ width: "0%" }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "linear" }}
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0, 0, 0, 0.35) 6px, rgba(0, 0, 0, 0.35) 8px)",
          }}
        />
      </div>
    </div>
  );
}
