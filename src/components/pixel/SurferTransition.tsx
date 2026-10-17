"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface SurferTransitionProps {
  trigger: boolean;
  onComplete?: () => void;
  destination?: string;
}

/**
 * Surfer Wave Transition v2 (§6)
 * One coherent ~1.9s timeline synchronized on a high-precision animation clock:
 * 1. 0–650ms: 3-layer crisp wave rises from viewport bottom to ~55% height with jitter & spray burst
 * 2. 650–1400ms: Redesigned 112px pixel surfer rides crest left→right with mathematical curve-tracking & 6px bob
 * 3. 650–1500ms: Center-screen BrandLogo blooming with Caveat amber "~ streaming trust on-chain ~"
 * 4. 1500–1900ms: Wave collapses forward / translates upward, destination mounts underneath, 400ms fadeout
 * Rendered in document.body portal (outside template wrapper) so no ancestor CSS filter contains it.
 */
export function SurferTransition({
  trigger,
  onComplete,
  destination = "/campaigns",
}: SurferTransitionProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!trigger) {
      setActive(false);
      setElapsed(0);
      pushedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      router.push(destination);
      onComplete?.();
      return;
    }

    setActive(true);
    setElapsed(0);
    pushedRef.current = false;
    startRef.current = performance.now();

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const currentElapsed = now - startRef.current;
      setElapsed(currentElapsed);

      // Mount destination route at ~1450ms before wipeout completes
      if (currentElapsed >= 1450 && !pushedRef.current) {
        pushedRef.current = true;
        router.push(destination);
      }

      if (currentElapsed < 1900) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setActive(false);
        setElapsed(0);
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trigger, destination, router, onComplete]);

  if (!mounted || !active) return null;

  // Clock calculations
  // Phase 1: 0 - 650ms (Rise)
  const riseProgress = Math.min(1, Math.max(0, elapsed / 650));
  // Wave container translates from 100% to 45% of viewport height
  const waveYPercent = 100 - riseProgress * 55;

  // Phase 2: 650 - 1400ms (Surfer riding crest)
  const isSurfing = elapsed >= 650 && elapsed < 1480;
  const surfProgress = Math.min(1, Math.max(0, (elapsed - 650) / 750));
  // Surfer traverses left from -10% to 110% of screen width
  const surferXPercent = -10 + surfProgress * 120;

  // Wave crest sinusoidal curve parameters
  // Wave repeats with k = 2 * PI / 1440
  const waveScroll = (elapsed * 0.8) % 1440;
  const crestSine = Math.sin((surferXPercent * 14.4 + waveScroll) * 0.0087);
  // Crest elevation inside wave viewBox (-30px to +30px)
  const crestYOffset = crestSine * 24;
  // 6px bobbing
  const bobY = Math.sin(elapsed * 0.02) * 6;
  const surferTotalY = crestYOffset + bobY;

  // Phase 3: 650 - 1500ms (Center Logo & Depth text)
  const showCenterBloom = elapsed >= 650 && elapsed < 1550;
  const bloomProgress = Math.min(1, Math.max(0, (elapsed - 650) / 400));
  const textChars = "~ streaming trust on-chain ~";
  const typedLength = Math.min(
    textChars.length,
    Math.floor(Math.max(0, (elapsed - 800) / 25))
  );

  // Phase 4: 1500 - 1900ms (Wipe-out & Fade out)
  const isWipeout = elapsed >= 1500;
  const wipeProgress = Math.min(1, Math.max(0, (elapsed - 1500) / 400));
  const wipeTranslateY = -wipeProgress * 65; // Translates upward 0 -> -65%
  const overlayOpacity = isWipeout ? 1 - wipeProgress : 1;

  // Wave SVG path generation
  // Generates smooth sinusoidal crest path across 1440px width
  const generateWavePath = (yBaseline: number, amplitude: number, phaseShift: number) => {
    let d = `M 0 320 L 0 ${yBaseline}`;
    for (let x = 0; x <= 1440; x += 40) {
      const y = yBaseline + amplitude * Math.sin((x + phaseShift) * 0.0087);
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    d += ` L 1440 320 Z`;
    return d;
  };

  const pathDeep = generateWavePath(130, 36, waveScroll);
  const pathMid = generateWavePath(100, 32, waveScroll + 120);
  const pathCrest = generateWavePath(75, 28, waveScroll + 240);

  const overlayContent = (
    <div
      className="fixed inset-0 z-[400] pointer-events-none select-none overflow-hidden"
      style={{ opacity: overlayOpacity }}
      aria-hidden="true"
    >
      {/* Background Dim Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A0A0D]/95 transition-opacity duration-300"
        style={{ opacity: Math.min(1, elapsed / 300) }}
      />

      {/* Center Screen Depth Text & Blooming BrandLogo (650–1500ms) */}
      {showCenterBloom && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[420] text-center px-4">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="flex flex-col items-center"
          >
            <div className="p-4 rounded-2xl bg-pix-panel/80 border border-pix-accent/30 shadow-[0_0_40px_rgba(255,180,84,0.25)] backdrop-blur-md">
              <BrandLogo size={56} showWordmark={true} />
            </div>

            {/* Caveat Amber Tagline */}
            <p className="mt-4 font-script text-2xl sm:text-3xl text-pix-accent tracking-wide drop-shadow-[0_2px_12px_rgba(255,180,84,0.4)]">
              {textChars.slice(0, typedLength)}
              {typedLength < textChars.length && (
                <span className="inline-block w-1.5 h-5 ml-1 bg-pix-accent animate-pulse align-middle" />
              )}
            </p>
          </motion.div>
        </div>
      )}

      {/* Wave Container (Rises from bottom to ~55% height, then translates upward on wipeout) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[65vh] transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(${isWipeout ? wipeTranslateY : waveYPercent}%)`,
        }}
      >
        {/* Layered SVG Wave */}
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
          className="w-full h-full drop-shadow-[0_-8px_24px_rgba(0,0,0,0.6)]"
        >
          {/* Layer 1: Deep Panel (#16161C) */}
          <path d={pathDeep} fill="#16161C" />

          {/* Layer 2: Mid BG (#0E0E12) */}
          <path d={pathMid} fill="#0E0E12" opacity="0.95" />

          {/* Layer 3: Crest Outline & Foam (#FFB454 Accent) */}
          <path
            d={pathCrest}
            fill="#1E1E28"
            stroke="#FFB454"
            strokeWidth="5"
            strokeDasharray="16 8"
            className="transition-all"
          />

          {/* 2-Frame Pixel Foam Jitter */}
          {elapsed % 120 < 60 && (
            <path
              d={pathCrest}
              fill="none"
              stroke="#FFF"
              strokeWidth="2"
              strokeDasharray="8 12"
              opacity="0.8"
            />
          )}
        </svg>

        {/* Amber Foam Spray Particles at Wave Crest Rise (0-600ms) */}
        {elapsed < 600 && (
          <div className="absolute top-12 inset-x-0 flex justify-around pointer-events-none">
            {[12, 28, 44, 62, 78, 92].map((leftPct, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-pix-accent animate-ping"
                style={{
                  left: `${leftPct}%`,
                  animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* The Redesigned 112px Pixel Surfer Sprite (650–1400ms) */}
        {isSurfing && (
          <div
            className="absolute z-[430]"
            style={{
              left: `${surferXPercent}%`,
              top: `calc(16% + ${surferTotalY}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              {/* Surfer SVG: Athletic crouch, knees bent, left arm raised, board tilted 8° */}
              <svg
                width="112"
                height="112"
                viewBox="0 0 48 48"
                shapeRendering="crispEdges"
                className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
                style={{
                  transform: "rotate(8deg)",
                }}
              >
                {/* Board Stringer & Core (Amber Accent #FFB454) */}
                <rect x="4" y="38" width="40" height="4" fill="#FFB454" />
                <rect x="8" y="39" width="32" height="2" fill="#FFF8EE" />
                {/* Board Fin & Rocker Tips */}
                <rect x="2" y="36" width="3" height="3" fill="#E69530" />
                <rect x="43" y="36" width="3" height="3" fill="#E69530" />
                <rect x="10" y="42" width="3" height="3" fill="#16161C" />

                {/* Feet firmly on board */}
                <rect x="14" y="35" width="5" height="3" fill="#0E0E12" />
                <rect x="28" y="35" width="5" height="3" fill="#0E0E12" />

                {/* Crouching Bent Legs (Charcoal wetsuit) */}
                <rect x="13" y="27" width="5" height="8" fill="#16161C" />
                <rect x="18" y="30" width="5" height="5" fill="#16161C" />
                <rect x="26" y="27" width="5" height="8" fill="#16161C" />
                <rect x="22" y="30" width="5" height="5" fill="#16161C" />

                {/* Torso & Athletic Lean */}
                <rect x="18" y="16" width="11" height="11" fill="#16161C" />
                {/* Amber Wetsuit Chevron / Accent Badge */}
                <rect x="21" y="18" width="5" height="5" fill="#FFB454" />
                <rect x="23" y="23" width="2" height="2" fill="#FFF8EE" />

                {/* Back Arm Raised High for Balance */}
                <rect x="12" y="12" width="4" height="6" fill="#16161C" />
                <rect x="10" y="7" width="4" height="6" fill="#16161C" />
                <rect x="9" y="4" width="4" height="4" fill="#FFB454" />

                {/* Front Arm Extended Down for Wave Balance */}
                <rect x="29" y="18" width="5" height="4" fill="#16161C" />
                <rect x="34" y="22" width="4" height="5" fill="#16161C" />
                <rect x="37" y="26" width="3" height="3" fill="#FFB454" />

                {/* Head & Helmet */}
                <rect x="20" y="8" width="8" height="8" fill="#F2F0EA" />
                {/* Pixel Sunglasses / Visor in Obsidian */}
                <rect x="24" y="10" width="5" height="3" fill="#0E0E12" />
                {/* Helmet Accent Band */}
                <rect x="20" y="8" width="8" height="2" fill="#FFB454" />
              </svg>

              {/* 3–4 Amber Pixel Sparkles Trailing Board Tail with steps(3) Pop */}
              <div
                className="absolute -left-6 bottom-4 w-3 h-3 bg-pix-accent animate-pulse"
                style={{
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
              />
              <div
                className="absolute -left-12 bottom-6 w-2.5 h-2.5 bg-pix-accent/80"
                style={{
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  animation: "bounce 0.35s steps(3) infinite",
                }}
              />
              <div
                className="absolute -left-16 bottom-8 w-2 h-2 bg-[#FFF8EE]"
                style={{
                  animation: "ping 0.4s steps(3) infinite",
                }}
              />
              <div
                className="absolute -left-8 bottom-1 w-2 h-2 bg-pix-accent/60"
                style={{
                  animation: "pulse 0.3s steps(3) infinite",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
}
