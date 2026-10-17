"use client";

import React from "react";
import { motion } from "motion/react";

interface PixelProgressProps {
  current?: number;
  total?: number;
  value?: number;
  variant?: "mint" | "gold" | "cyan" | "accent" | "success";
  height?: number; // default 14px
  showLabel?: boolean;
  className?: string;
}

export function PixelProgress({
  current,
  total,
  value,
  variant = "accent",
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
      case "success":
        return "bg-[var(--color-success)]";
      case "gold":
      case "cyan":
      case "accent":
      default:
        return "bg-[var(--color-accent)]";
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-[13px] font-body uppercase font-semibold text-[var(--color-dim)] tracking-wider">
          <span>FUNDING PROGRESS</span>
          <span className="font-mono text-[var(--color-accent)] font-medium">{percent}%</span>
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className="w-full bg-black/40 border border-[var(--color-hairline)] p-[2px] rounded-[6px] relative overflow-hidden shadow-inner"
        style={{ height: `${height + 4}px` }}
      >
        {/* Animated Stepped Bar with subtle segments */}
        <motion.div
          className={`h-full ${getFillColor()} rounded-[4px] relative`}
          initial={{ width: "0%" }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0, 0, 0, 0.25) 6px, rgba(0, 0, 0, 0.25) 8px)",
          }}
        />
      </div>
    </div>
  );
}
