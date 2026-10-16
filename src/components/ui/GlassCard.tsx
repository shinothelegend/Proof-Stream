"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glowOnHover?: boolean;
  className?: string;
}

/**
 * PixelPanel (historically GlassCard):
 * Standard arcade panel with 2px solid border, zero border-radius, and hard 4px shadow.
 */
export function GlassCard({
  children,
  glowOnHover = false,
  className,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={twMerge(
        clsx(
          "bg-pix-panel border-2 border-pix-dim/30 shadow-pixel transition-all rounded-none",
          glowOnHover && "hover:border-pix-gold hover:-translate-y-0.5 hover:shadow-pixel-lg",
          className
        )
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
