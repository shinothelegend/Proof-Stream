"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

interface SurferTransitionProps {
  trigger: boolean;
  onComplete?: () => void;
  destination?: string;
}

export function SurferTransition({
  trigger,
  onComplete,
  destination = "/campaigns",
}: SurferTransitionProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<"IDLE" | "WAVE" | "RIDE" | "DISSOLVE">("IDLE");

  useEffect(() => {
    if (!trigger) {
      setPhase("IDLE");
      return;
    }

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      router.push(destination);
      onComplete?.();
      return;
    }

    setPhase("WAVE");

    // Phase 1 -> Phase 2 (Surfer rides wave: 400ms - 1200ms)
    const t1 = setTimeout(() => {
      setPhase("RIDE");
    }, 400);

    // Phase 2 -> Phase 3 (Wave fills and dissolves: 1200ms - 1600ms)
    const t2 = setTimeout(() => {
      setPhase("DISSOLVE");
      router.push(destination);
    }, 1200);

    // Complete (1600ms)
    const t3 = setTimeout(() => {
      setPhase("IDLE");
      onComplete?.();
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [trigger, destination, router, onComplete]);

  if (phase === "IDLE") return null;

  return (
    <div className="fixed inset-0 z-[300] overflow-hidden pointer-events-none select-none">
      {/* 1. The Giant Pixel Wave Sweeping Left to Right */}
      <motion.div
        className="absolute inset-0 bg-[#0E0E12]"
        initial={{ x: "-100%" }}
        animate={{ x: phase === "DISSOLVE" ? "0%" : "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Wave Crest Pixel Ridge */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 bg-[#16161C]"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, #16161C 0, #16161C 16px, #FFB454 16px, #FFB454 32px)",
          }}
        />
      </motion.div>

      {/* 2. The Pixel Surfer Riding the Crest */}
      {(phase === "RIDE" || phase === "WAVE") && (
        <motion.div
          className="absolute top-[40%] z-[310]"
          initial={{ left: "-10%", y: 0 }}
          animate={{
            left: "110%",
            y: [0, -6, 0, 6, 0],
          }}
          transition={{
            left: { duration: 1.0, ease: "linear" },
            y: { duration: 0.25, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {/* Surfer Sprite (32x32 code SVG) */}
          <div className="relative">
            <svg
              width="64"
              height="64"
              viewBox="0 0 32 32"
              shapeRendering="crispEdges"
              className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            >
              {/* Arms Up */}
              <rect x="8" y="4" width="3" height="3" fill="#FFB454" />
              <rect x="21" y="4" width="3" height="3" fill="#FFB454" />
              <rect x="10" y="7" width="2" height="4" fill="#FFB454" />
              <rect x="20" y="7" width="2" height="4" fill="#FFB454" />

              {/* Head / Helmet */}
              <rect x="13" y="4" width="6" height="6" fill="#F2F0EA" />
              <rect x="15" y="6" width="3" height="2" fill="#16161C" />

              {/* Torso */}
              <rect x="12" y="10" width="8" height="8" fill="#FFB454" />

              {/* Legs */}
              <rect x="12" y="18" width="3" height="6" fill="#16161C" />
              <rect x="17" y="18" width="3" height="6" fill="#16161C" />

              {/* Surfboard (Amber Accent) */}
              <rect x="4" y="24" width="24" height="4" fill="#FFB454" />
              <rect x="8" y="25" width="16" height="2" fill="#F2F0EA" />
            </svg>

            {/* Amber Pixel Sparkles Trailing the Surfer */}
            <motion.div
              className="absolute -left-6 top-6 w-3 h-3 bg-[#FFB454]"
              animate={{ opacity: [1, 0], scale: [1, 0.4], x: [-5, -25] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
            <motion.div
              className="absolute -left-10 top-10 w-2 h-2 bg-[#FFB454]"
              animate={{ opacity: [1, 0], scale: [1, 0.4], x: [-10, -35] }}
              transition={{ repeat: Infinity, duration: 0.35, delay: 0.1 }}
            />
          </div>
        </motion.div>
      )}

      {/* 3. Final Dissolve Wipe into Midnight Dark Background */}
      {phase === "DISSOLVE" && (
        <motion.div
          className="absolute inset-0 bg-[#0E0E12]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  );
}
