"use client";

import React, { useRef, useState, useEffect } from "react";
import { useInView } from "motion/react";

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
      className={`p-3.5 sm:p-4 flex items-center space-x-3 bg-[var(--color-panel)] border border-[var(--color-hairline)] rounded-[10px] shadow-card ${className}`}
    >
      {icon && (
        <div className="w-9 h-9 rounded-[8px] flex items-center justify-center bg-black/30 border border-[var(--color-hairline)] text-[var(--color-accent)] flex-shrink-0">
          {icon}
        </div>
      )}

      <div className="min-w-0">
        <span className="text-[12px] font-body uppercase font-semibold tracking-wider text-[var(--color-dim)] block truncate">
          {label}
        </span>
        <div className="flex items-baseline space-x-1.5 mt-0.5">
          <span className="font-mono font-medium text-base sm:text-lg text-[var(--color-accent)] tracking-tight">
            {typeof displayValue === "number" ? displayValue.toLocaleString() : displayValue}
          </span>
          {subValue && (
            <span className="text-[11px] font-mono text-[var(--color-dim)] uppercase">{subValue}</span>
          )}
        </div>
      </div>
    </div>
  );
}
