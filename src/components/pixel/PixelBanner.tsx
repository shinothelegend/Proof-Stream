"use client";

import React, { useRef, useEffect } from "react";

interface PixelBannerProps {
  seed?: string;
  slug?: string;
  className?: string;
}

// Simple deterministic PRNG from string seed
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

export function PixelBanner({ seed, slug, className = "" }: PixelBannerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeSeed = seed || slug || "default-campaign";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    const w = 64;
    const h = 32;
    canvas.width = w;
    canvas.height = h;

    const rand = createRandom(activeSeed);

    // 5-Color Discipline Palette from tokens
    const skyColor = "#0B0B14";
    const mountainFar = "#15152A";
    const mountainNear = "#25254A";
    const waterColor = "#0077A8";
    const waterAccent = "#43E8FF";
    const sunColor = "#FFC93C";

    // 1. Sky
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, w, h);

    // 2. Stars
    ctx.fillStyle = "#F4F4FF";
    for (let i = 0; i < 16; i++) {
      const sx = Math.floor(rand() * w);
      const sy = Math.floor(rand() * 12);
      ctx.fillRect(sx, sy, 1, 1);
    }

    // 3. Pixel Sun/Moon
    const sunX = Math.floor(10 + rand() * 40);
    const sunY = 5;
    ctx.fillStyle = sunColor;
    ctx.fillRect(sunX, sunY, 6, 6);
    ctx.fillStyle = skyColor;
    ctx.fillRect(sunX + 2, sunY + 2, 2, 2);

    // 4. Distant Mountains
    ctx.fillStyle = mountainFar;
    for (let x = 0; x < w; x++) {
      const peakY = Math.floor(12 + Math.sin(x * 0.12 + rand() * 2) * 5);
      ctx.fillRect(x, peakY, 1, h - peakY);
    }

    // 5. Near Mountains / Hills
    ctx.fillStyle = mountainNear;
    for (let x = 0; x < w; x++) {
      const hillY = Math.floor(18 + Math.cos(x * 0.18 + rand()) * 4);
      ctx.fillRect(x, hillY, 1, h - hillY);
    }

    // 6. River / Water Basin (Kalimantan Theme)
    ctx.fillStyle = waterColor;
    ctx.fillRect(0, 24, w, 8);

    // 7. Water Shimmer (Cyan highlights)
    ctx.fillStyle = waterAccent;
    for (let y = 24; y < h; y += 2) {
      const startX = Math.floor(rand() * w);
      const length = Math.floor(3 + rand() * 8);
      ctx.fillRect(startX % w, y, length, 1);
    }

    // 8. Tiny River Boat/Camp
    const boatX = Math.floor(15 + rand() * 30);
    ctx.fillStyle = "#FFC93C";
    ctx.fillRect(boatX, 26, 4, 1);
    ctx.fillRect(boatX + 1, 25, 2, 1);
    ctx.fillRect(boatX + 2, 24, 1, 1);
  }, [activeSeed]);

  return (
    <div className={`relative w-full overflow-hidden border-b-2 border-black bg-[#0B0B14] ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
