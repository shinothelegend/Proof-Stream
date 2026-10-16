"use client";

import { motion } from "framer-motion";

export function AuroraOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Aurora Orb 1: Violet */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-[10%] left-[15%] w-[550px] h-[550px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124, 92, 255, 0.28) 0%, rgba(124, 92, 255, 0.05) 55%, transparent 70%)",
          filter: "blur(90px)",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.12, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Aurora Orb 2: Deep Blue */}
      <motion.div
        aria-hidden="true"
        className="absolute top-[35%] -right-[5%] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(77, 166, 255, 0.22) 0%, rgba(77, 166, 255, 0.04) 60%, transparent 75%)",
          filter: "blur(110px)",
        }}
        animate={{
          x: [0, -70, 40, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.08, 0.92, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Aurora Orb 3: Mint Glow (Subtle accent) */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[5%] left-[30%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(56, 232, 198, 0.16) 0%, rgba(56, 232, 198, 0.03) 60%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 50, -40, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.15, 0.98, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Noise Texture Overlay for authentic material feel */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
