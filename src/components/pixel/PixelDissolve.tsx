"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function PixelDissolve() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionBg, setTransitionBg] = useState("#0B0B14");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = (resolvedTheme || theme) === "dark";

  const handleToggle = () => {
    if (isTransitioning) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setTheme(isDark ? "light" : "dark");
      return;
    }

    setTransitionBg(isDark ? "#0E0E12" : "#F6F4EE");
    setIsTransitioning(true);

    // Swap theme halfway through cover (~350ms)
    setTimeout(() => {
      setTheme(isDark ? "light" : "dark");
    }, 350);

    // End transition after ~700ms
    setTimeout(() => {
      setIsTransitioning(false);
    }, 720);
  };

  // 18 columns x 10 rows grid of squares
  const cols = 18;
  const rows = 10;
  const totalCells = cols * rows;

  return (
    <>
      {/* The Toggle Button (Pixel Sun/Moon Sprite) */}
      <button
        onClick={handleToggle}
        aria-label="Toggle Ember & Paper Theme"
        className="w-10 h-10 p-1 flex items-center justify-center rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] shadow-sm hover:border-[var(--color-pix-accent)] active:scale-95 cursor-pointer transition-all"
      >
        {mounted && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
            className="w-5 h-5 transition-transform duration-150"
          >
            {isDark ? (
              /* Moon Sprite (Ember Amber) */
              <g fill="#FFB454">
                <rect x="5" y="1" width="6" height="2" />
                <rect x="3" y="3" width="4" height="2" />
                <rect x="2" y="5" width="3" height="6" />
                <rect x="3" y="11" width="4" height="2" />
                <rect x="5" y="13" width="6" height="2" />
                <rect x="9" y="11" width="3" height="2" />
                <rect x="10" y="5" width="2" height="6" />
                <rect x="9" y="3" width="3" height="2" />
              </g>
            ) : (
              /* Sun Sprite (Paper Amber) */
              <g fill="#B36612">
                <rect x="7" y="0" width="2" height="2" />
                <rect x="7" y="14" width="2" height="2" />
                <rect x="0" y="7" width="2" height="2" />
                <rect x="14" y="7" width="2" height="2" />
                <rect x="2" y="2" width="2" height="2" />
                <rect x="12" y="2" width="2" height="2" />
                <rect x="2" y="12" width="2" height="2" />
                <rect x="12" y="12" width="2" height="2" />
                <rect x="4" y="4" width="8" height="8" />
              </g>
            )}
          </svg>
        )}
      </button>

      {/* 18x10 Checkerboard Dissolve Portal Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <div
            className="fixed inset-0 z-[200] pointer-events-none w-screen h-screen"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(18, 1fr)",
              gridTemplateRows: "repeat(10, 1fr)",
            }}
          >
            {Array.from({ length: totalCells }).map((_, i) => {
              const col = i % cols;
              const row = Math.floor(i / cols);
              // Checkerboard stagger from top-right towards bottom-left
              const distance = (cols - 1 - col) + row;
              const delay = distance * 0.016;

              return (
                <motion.div
                  key={i}
                  style={{ backgroundColor: transitionBg }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 0.65,
                    times: [0, 0.35, 0.65, 1],
                    delay,
                    ease: "linear",
                  }}
                  className="w-full h-full"
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
