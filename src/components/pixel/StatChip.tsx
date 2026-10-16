"use client";

import React, { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

interface StatChipProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatChip({
  label,
  value,
  subValue,
  icon,
  className = "",
}: StatChipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState<string | number>(
    typeof value === "number" ? 0 : value
  );

  useEffect(() => {
    if (!isInView || typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    const duration = 900; // ms
    const steps = 24;
    const increment = value / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      if (stepCount >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(stepCount * increment));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div
      ref={ref}
      className={`pixel-panel p-3 sm:p-4 flex items-center space-x-3 bg-pix-panel border-2 border-[var(--color-pix-border)] shadow-[4px_4px_0_0_#000000] ${className}`}
    >
      {icon && (
        <div className="w-8 h-8 flex items-center justify-center bg-black/40 border border-white/10 text-pix-gold flex-shrink-0">
          {icon}
        </div>
      )}

      <div className="min-w-0">
        <span className="text-[10px] sm:text-[11px] font-heading uppercase tracking-wider text-pix-dim block truncate">
          {label}
        </span>
        <div className="flex items-baseline space-x-1.5 mt-0.5">
          <span className="font-mono font-bold text-base sm:text-lg text-pix-cyan tracking-tight">
            {typeof displayValue === "number" ? displayValue.toLocaleString() : displayValue}
          </span>
          {subValue && (
            <span className="text-[10px] font-mono text-pix-dim uppercase">{subValue}</span>
          )}
        </div>
      </div>
    </div>
  );
}
