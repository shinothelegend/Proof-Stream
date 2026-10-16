import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck } from "lucide-react";

export type BadgeVariant = "verified" | "released" | "flagged" | "rejected" | "pending" | "testnet";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: boolean;
  className?: string;
}

export function Badge({
  variant = "pending",
  children,
  icon = true,
  className,
}: BadgeProps) {
  const getStyles = () => {
    switch (variant) {
      case "verified":
      case "released":
        return "bg-[var(--color-panel)] text-[var(--color-success)] border border-[var(--color-success)]/40";
      case "flagged":
      case "rejected":
        return "bg-[var(--color-panel)] text-[var(--color-alert)] border border-[var(--color-alert)]/40";
      case "testnet":
        return "bg-[var(--color-panel)] text-[var(--color-accent)] border border-[var(--color-accent)]/40";
      case "pending":
      default:
        return "bg-[var(--color-panel)] text-[var(--color-dim)] border border-[var(--color-hairline)]";
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    switch (variant) {
      case "verified":
      case "released":
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[var(--color-success)] flex-shrink-0" />;
      case "flagged":
      case "rejected":
        return <AlertTriangle className="w-3.5 h-3.5 mr-1 text-[var(--color-alert)] flex-shrink-0" />;
      case "testnet":
        return <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[var(--color-accent)] flex-shrink-0" />;
      case "pending":
      default:
        return <Clock className="w-3.5 h-3.5 mr-1 text-[var(--color-dim)] flex-shrink-0" />;
    }
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2.5 py-0.5 text-[11px] font-body font-semibold uppercase tracking-wider rounded-[6px] transition-colors",
          getStyles(),
          className
        )
      )}
    >
      {renderIcon()}
      <span>{children}</span>
    </span>
  );
}
