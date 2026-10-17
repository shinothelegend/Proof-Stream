"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";

interface PixelBannerProps {
  seed?: string;
  slug?: string;
  className?: string;
  title?: string;
  height?: number | string; // default 220px
  showScrim?: boolean;
}

// Deterministic PRNG from string seed
function createRandom(seedStr: string) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  return function () {
    hash = Math.imul(hash ^ (hash >>> 15), 1 | hash);
    hash = (hash + Math.imul(hash ^ (hash >>> 7), 61 | hash)) ^ hash;
    return ((hash ^ (hash >>> 14)) >>> 0) / 4294967296;
  };
}

export function PixelBanner({
  seed,
  slug,
  className = "",
  title,
  height,
  showScrim = true,
}: PixelBannerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeSeed = seed || slug || "default-campaign";

  // Parallax spring translation ±6px on hover
  const parallaxX = useSpring(0, { stiffness: 200, damping: 20 });
  const parallaxY = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    parallaxX.set(xPct * 12);
    parallaxY.set(yPct * 6);
  };

  const handleMouseLeave = () => {
    parallaxX.set(0);
    parallaxY.set(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    // High-def retro canvas: 128x72
    const w = 128;
    const h = 72;
    canvas.width = w;
    canvas.height = h;

    const rand = createRandom(activeSeed);

    // Ember & Paper disciplined landscape palette
    const skyColor = "#0E0E12";
    const mountainFar = "#16161C";
    const mountainNear = "#22222A";
    const waterBase = "#18202E";
    const waterShimmer = "#FFB454"; // amber accent shimmer
    const celestialColor = "#FFB454"; // amber sun/moon

    // 1. Sky
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, w, h);

    // 2. Stars
    ctx.fillStyle = "rgba(242, 240, 234, 0.7)";
    for (let i = 0; i < 28; i++) {
      const sx = Math.floor(rand() * w);
      const sy = Math.floor(rand() * 26);
      ctx.fillRect(sx, sy, 1, 1);
    }

    // 3. Celestial Body (Sun/Moon)
    const sunX = Math.floor(20 + rand() * 80);
    const sunY = 10;
    ctx.fillStyle = celestialColor;
    ctx.fillRect(sunX, sunY, 10, 10);
    ctx.fillStyle = skyColor;
    ctx.fillRect(sunX + 3, sunY + 3, 4, 4);

    // 4. Distant Mountain Range
    ctx.fillStyle = mountainFar;
    for (let x = 0; x < w; x++) {
      const peakY = Math.floor(24 + Math.sin(x * 0.08 + rand() * 2) * 8);
      ctx.fillRect(x, peakY, 1, h - peakY);
    }

    // 5. Near Foothills
    ctx.fillStyle = mountainNear;
    for (let x = 0; x < w; x++) {
      const hillY = Math.floor(38 + Math.cos(x * 0.12 + rand()) * 6);
      ctx.fillRect(x, hillY, 1, h - hillY);
    }

    // 6. River Basin
    ctx.fillStyle = waterBase;
    ctx.fillRect(0, 48, w, 24);

    // 7. Water Shimmer Highlights
    ctx.fillStyle = waterShimmer;
    for (let y = 50; y < h; y += 3) {
      const startX = Math.floor(rand() * w);
      const len = Math.floor(4 + rand() * 12);
      ctx.fillRect(startX % w, y, len, 1);
    }

    // 8. Field Team Outpost/Boat motif
    const boatX = Math.floor(30 + rand() * 60);
    ctx.fillStyle = "#FFB454";
    ctx.fillRect(boatX, 54, 8, 2);
    ctx.fillRect(boatX + 2, 52, 4, 2);
    ctx.fillRect(boatX + 4, 50, 1, 2);
  }, [activeSeed]);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ minHeight: height || "220px" }}
      className={`relative w-full overflow-hidden bg-[#0E0E12] select-none ${className}`}
    >
      {/* 128x72 canvas scaled pixelated with spring parallax */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className="w-full h-full absolute inset-0"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover scale-[1.04]"
          style={{ imageRendering: "pixelated" }}
        />
      </motion.div>

      {/* Soft gradient scrim from transparent -> panel color at bottom 40% */}
      {showScrim && (
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-panel)] via-[var(--color-panel)]/40 to-transparent pointer-events-none" />
      )}

      {/* Overlaid Title in Space Grotesk 24px */}
      {title && (
        <div className="absolute bottom-4 left-5 right-5 z-10">
          <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--color-ink)] drop-shadow-md leading-tight">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
}
