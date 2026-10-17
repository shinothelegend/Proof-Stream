import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface AccentProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Cursive Accent Typography Component (§5)
 * Renders words in Caveat script font + amber accent color.
 * Size-compensated (~1.15em) with tighter tracking so script glyphs match Space Grotesk/Inter.
 */
export function Accent({ children, className = "", ...props }: AccentProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "font-script font-semibold text-[var(--color-accent)] inline-block tracking-tight text-[1.15em] leading-[0.9]",
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
