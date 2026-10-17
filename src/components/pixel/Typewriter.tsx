"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { Accent } from "@/components/ui/Accent";

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

  // Optional word highlighting with Cursive Accent (§5)
  const renderFormattedText = () => {
    if (!highlightWord) {
      return displayedText;
    }

    const lowerText = text.toLowerCase();
    const lowerHighlight = highlightWord.toLowerCase();
    const matchStart = lowerText.indexOf(lowerHighlight);

    if (matchStart === -1) {
      return displayedText;
    }

    const matchEnd = matchStart + highlightWord.length;

    // Characters typed before highlight
    if (charIndex <= matchStart) {
      return text.slice(0, charIndex);
    }

    const before = text.slice(0, matchStart);

    // Currently typing the highlight word
    if (charIndex <= matchEnd) {
      const currentHighlight = text.slice(matchStart, charIndex);
      return (
        <>
          {before}
          <Accent>{currentHighlight}</Accent>
        </>
      );
    }

    // Finished typing the highlight word, continuing text after
    const fullHighlight = text.slice(matchStart, matchEnd);
    const after = text.slice(matchEnd, charIndex);

    return (
      <>
        {before}
        <Accent>{fullHighlight}</Accent>
        {after}
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
