"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, AnimatePresence } from "motion/react";
import { Loader2, Check } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type SnapButtonVariant =
  | "primary"
  | "secondary"
  | "gold"
  | "outline"
  | "ghost"
  | "danger"
  | "alert"
  | "mint"
  | "success"
  | "ink";

interface SnapButtonProps {
  children: React.ReactNode;
  variant?: SnapButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  isLoading?: boolean;
  loadingText?: string;
  isSuccess?: boolean;
  successText?: string;
  isError?: boolean;
  disabledReason?: string;
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  id?: string;
  title?: string;
}

export function SnapButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled,
  isLoading = false,
  loadingText,
  isSuccess = false,
  successText,
  isError = false,
  disabledReason,
  href,
  target,
  rel,
  type = "button",
  ...props
}: SnapButtonProps) {
  const ref = useRef<any>(null);
  const [showSuccessState, setShowSuccessState] = useState(false);

  // Success state auto-dismiss after 1.5s
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessState(true);
      const timer = setTimeout(() => setShowSuccessState(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Spring physics for magnetic pull / lean (stiffness 400, damping 30)
  const springX = useSpring(0, { stiffness: 400, damping: 30 });
  const springY = useSpring(0, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || isLoading) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance < 36) {
      const leanX = (deltaX / 36) * 4;
      const leanY = (deltaY / 36) * 4;
      springX.set(leanX);
      springY.set(leanY);
    }
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  const isPrimary = variant === "primary" || variant === "gold";
  const isAlert = variant === "alert" || variant === "danger";
  const isMint = variant === "mint" || variant === "success";

  const getVariantStyles = () => {
    if (showSuccessState) {
      return "bg-[var(--color-success)] text-[#0E0E12] border border-[var(--color-success)] shadow-md";
    }
    if (isError) {
      return "bg-[var(--color-panel)] text-[var(--color-alert)] border-2 border-[var(--color-alert)] shadow-md";
    }
    if (isPrimary) {
      return "bg-[var(--color-accent)] text-[#1D1D26] font-semibold border border-black/15 shadow-sm hover:shadow-[0_6px_18px_rgba(255,180,84,0.28)] hover:-translate-y-[1px]";
    }
    if (isAlert) {
      return "bg-[var(--color-alert)]/15 text-[var(--color-alert)] border border-[var(--color-alert)]/40 hover:bg-[var(--color-alert)]/25";
    }
    if (isMint) {
      return "bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/40 hover:bg-[var(--color-success)]/25";
    }
    if (variant === "ink") {
      return "bg-[var(--color-ink)] text-[var(--color-bg)] border border-transparent hover:opacity-90";
    }
    return "bg-[var(--color-panel)] text-[var(--color-ink)] border border-[var(--color-hairline)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/[0.06]";
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-[13px] px-3.5 py-1.5 rounded-[8px]";
      case "lg":
        return "text-[16px] px-6 py-3.5 rounded-[10px]";
      case "md":
      default:
        return "text-[14px] px-4 py-2.5 rounded-[10px]";
    }
  };

  const combinedClassName = twMerge(
    clsx(
      "relative inline-flex items-center justify-center font-body font-medium select-none cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none group",
      getVariantStyles(),
      getSizeStyles(),
      className
    )
  );

  const innerContent = (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.span
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center space-x-2"
        >
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span>{loadingText || "Processing…"}</span>
        </motion.span>
      ) : showSuccessState ? (
        <motion.span
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center space-x-1.5 font-semibold"
        >
          <Check className="w-4 h-4" />
          <span>{successText || "Completed ✓"}</span>
        </motion.span>
      ) : (
        <motion.span
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="inline-flex items-center space-x-1.5"
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("//") || target === "_blank";
    if (isExternal) {
      return (
        <motion.a
          ref={ref}
          href={href}
          target={target}
          rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
          data-snap
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={onClick as any}
          style={{ x: springX, y: springY }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={combinedClassName}
          {...props}
        >
          {innerContent}
        </motion.a>
      );
    }

    return (
      <Link href={href} passHref legacyBehavior={false} className="inline-block">
        <motion.span
          ref={ref}
          data-snap
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={onClick as any}
          style={{ x: springX, y: springY }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={combinedClassName}
          {...props}
        >
          {innerContent}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      data-snap
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled || isLoading}
      title={disabled && disabledReason ? disabledReason : undefined}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      animate={isError ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.3 }}
      className={combinedClassName}
      {...(props as any)}
    >
      {innerContent}
    </motion.button>
  );
}
