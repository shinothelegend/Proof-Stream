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
        return "bg-pix-mint/10 text-pix-mint border-pix-mint";
      case "flagged":
      case "rejected":
        return "bg-pix-alert/10 text-pix-alert border-pix-alert";
      case "testnet":
        return "bg-pix-gold/10 text-pix-gold border-pix-gold";
      case "pending":
      default:
        return "bg-pix-panel text-pix-dim border-pix-dim/40";
    }
  };

  const renderIcon = () => {
    if (!icon) return null;
    switch (variant) {
      case "verified":
      case "released":
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-pix-mint" />;
      case "flagged":
      case "rejected":
        return <AlertTriangle className="w-3.5 h-3.5 mr-1 text-pix-alert" />;
      case "testnet":
        return <ShieldCheck className="w-3.5 h-3.5 mr-1 text-pix-gold" />;
      case "pending":
      default:
        return <Clock className="w-3.5 h-3.5 mr-1 text-pix-dim" />;
    }
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2 py-0.5 text-[11px] font-heading uppercase tracking-wider border-2 rounded-none transition-colors",
          getStyles(),
          className
        )
      )}
    >
      {renderIcon()}
      {children}
    </span>
  );
}
