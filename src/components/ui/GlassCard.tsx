"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glowOnHover?: boolean;
  chamfer?: boolean;
  className?: string;
}

/**
 * Retro-Modern Card Panel:
 * 10px radius, 1px hairline border, soft shadow, and optional chamfered top-right corner.
 */
export function GlassCard({
  children,
  glowOnHover = false,
  chamfer = true,
  className,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={twMerge(
        clsx(
          "bg-[var(--color-panel)] border border-[var(--color-hairline)] rounded-[10px] shadow-card transition-all duration-200",
          chamfer && "card-chamfer",
          glowOnHover && "hover:border-[var(--color-hairline)]/80 hover:-translate-y-[2px] hover:shadow-panel",
          className
        )
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
