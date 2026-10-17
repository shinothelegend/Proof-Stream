import React from "react";
import Link from "next/link";
import { Accent } from "@/components/ui/Accent";

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
  href?: string;
  size?: number;
}

export function BrandLogo({
  className = "",
  showWordmark = true,
  showTagline = false,
  href,
  size = 28,
}: BrandLogoProps) {
  const content = (
    <div className={`inline-flex items-center space-x-2.5 select-none ${className}`}>
      {/* 28x28 Amber Coin with Wave Cutting Through */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <circle
          cx="14"
          cy="14"
          r="11"
          fill="var(--color-accent)"
          stroke="var(--color-hairline)"
          strokeWidth="1"
        />
        <path
          d="M4 16 q3 -4 6 0 t6 0 t6 0"
          stroke="var(--color-ink)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          shapeRendering="crispEdges"
        />
      </svg>

      {showWordmark && (
        <div className="flex flex-col text-left">
          <span className="font-display font-semibold text-lg tracking-tight text-[var(--color-ink)] leading-none">
            ProofStream
          </span>
          {showTagline && (
            <span className="text-[13px] font-sans text-pix-dim leading-tight mt-1 hidden sm:inline-block">
              streaming trust <Accent className="text-[14px]">on-chain</Accent>
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
