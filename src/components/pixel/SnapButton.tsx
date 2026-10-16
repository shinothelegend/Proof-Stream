"use client";

import React, { useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type SnapButtonVariant =
  | "gold"
  | "primary"
  | "ink"
  | "outline"
  | "secondary"
  | "danger"
  | "alert"
  | "mint"
  | "ghost";

interface SnapButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: SnapButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  asChild?: boolean;
}

export function SnapButton({
  children,
  variant = "gold",
  size = "md",
  className = "",
  onClick,
  disabled,
  ...props
}: SnapButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Magnetic spring physics (stiffness 400, damping 28)
  const springX = useSpring(0, { stiffness: 400, damping: 28 });
  const springY = useSpring(0, { stiffness: 400, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    // Magnetic zone within 48px
    if (distance < 72) {
      // Lean up to 6px toward the cursor
      const leanX = (deltaX / 72) * 6;
      const leanY = (deltaY / 72) * 6;
      springX.set(leanX);
      springY.set(leanY);
    }
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
      case "gold":
        return "bg-pix-gold text-black border-2 border-black shadow-[4px_4px_0_0_#000000]";
      case "ink":
        return "bg-pix-ink text-pix-bg border-2 border-black shadow-[4px_4px_0_0_#000000]";
      case "secondary":
      case "outline":
        return "bg-pix-panel text-pix-ink border-2 border-pix-dim/40 shadow-[4px_4px_0_0_rgba(0,0,0,0.85)] hover:border-pix-gold";
      case "alert":
      case "danger":
        return "bg-pix-alert text-black border-2 border-black shadow-[4px_4px_0_0_#000000]";
      case "mint":
        return "bg-pix-mint text-black border-2 border-black shadow-[4px_4px_0_0_#000000]";
      case "ghost":
        return "bg-pix-bg text-pix-dim border-2 border-pix-dim/30 hover:border-pix-gold hover:text-pix-ink";
      default:
        return "";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-[11px] px-3 py-1.5";
      case "lg":
        return "text-sm sm:text-base px-6 py-3.5";
      case "md":
      default:
        return "text-xs sm:text-sm px-4 py-2.5";
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      style={{
        x: springX,
        y: springY,
      }}
      whileTap={{
        x: 2,
        y: 2,
        boxShadow: "2px 2px 0 0 #000000",
      }}
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider select-none cursor-pointer transition-colors active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
          getVariantStyles(),
          getSizeStyles(),
          className
        )
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
