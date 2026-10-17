"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "motion/react";

interface TypewriterProps {
  text: string;
  speed?: number; // ms per char (default 45)
  className?: string;
  cursorColor?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div";
  highlightWord?: string;
}

export function Typewriter({
  text,
  speed = 45,
  className = "",
  as: Component = "span",
  highlightWord,
}: TypewriterProps) {
  const ref = useRef<any>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setCharIndex(text.length);
      setShowCursor(false);
      return;
    }

    if (!isInView) return;

    const interval = setInterval(() => {
      setCharIndex((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isInView, text, speed]);

  useEffect(() => {
    if (charIndex >= text.length && text.length > 0) {
      const timer = setTimeout(() => setShowCursor(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [charIndex, text.length]);

  const displayedText = text.slice(0, charIndex);

  // Optional word highlighting in gold
  const renderFormattedText = () => {
    if (!highlightWord || !displayedText.includes(highlightWord)) {
      return displayedText;
    }

    const parts = displayedText.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="text-[var(--color-accent)]">{highlightWord}</span>
        {parts.slice(1).join(highlightWord)}
      </>
    );
  };

  return (
    <Component ref={ref as any} className={className}>
      {renderFormattedText()}
      {showCursor && <span className="pixel-cursor">▮</span>}
    </Component>
  );
}
