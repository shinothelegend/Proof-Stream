import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pix: {
          bg: "var(--color-pix-bg)",
          panel: "var(--color-pix-panel)",
          ink: "var(--color-pix-ink)",
          dim: "var(--color-pix-dim)",
          gold: "var(--color-pix-gold)",
          cyan: "var(--color-pix-cyan)",
          mint: "var(--color-pix-mint)",
          alert: "var(--color-pix-alert)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", '"Press Start 2P"', "monospace"],
        heading: ["var(--font-heading)", '"Silkscreen"', "monospace"],
        mono: ["var(--font-body)", '"IBM Plex Mono"', "monospace"],
      },
      boxShadow: {
        pixel: "4px 4px 0 0 rgba(0, 0, 0, 0.9)",
        "pixel-sm": "2px 2px 0 0 rgba(0, 0, 0, 0.9)",
        "pixel-gold": "4px 4px 0 0 var(--color-pix-gold)",
        "pixel-cyan": "4px 4px 0 0 var(--color-pix-cyan)",
        "pixel-btn": "4px 4px 0 0 #000000",
        "pixel-btn-active": "2px 2px 0 0 #000000",
      },
    },
  },
  plugins: [],
};

export default config;
