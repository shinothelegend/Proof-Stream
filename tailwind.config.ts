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
        // "Ember & Paper" tokens
        bg: "var(--color-bg)",
        panel: "var(--color-panel)",
        hairline: "var(--color-hairline)",
        ink: "var(--color-ink)",
        dim: "var(--color-dim)",
        accent: "var(--color-accent)",
        "accent-fg": "var(--color-accent-fg)",
        success: "var(--color-success)",
        alert: "var(--color-alert)",

        // Aliases for retro components
        pix: {
          bg: "var(--color-bg)",
          panel: "var(--color-panel)",
          hairline: "var(--color-hairline)",
          ink: "var(--color-ink)",
          dim: "var(--color-dim)",
          accent: "var(--color-accent)",
          "accent-fg": "var(--color-accent-fg)",
          success: "var(--color-success)",
          alert: "var(--color-alert)",
          gold: "var(--color-accent)",
          cyan: "var(--color-accent)",
          mint: "var(--color-success)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", '"Space Grotesk"', "sans-serif"],
        heading: ["var(--font-display)", '"Space Grotesk"', "sans-serif"],
        body: ["var(--font-body)", '"Inter"', "sans-serif"],
        sans: ["var(--font-body)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", '"JetBrains Mono"', "monospace"],
        script: ["var(--font-script)", '"Caveat"', "cursive"],
      },
      spacing: {
        "18": "4.5rem",
      },
      boxShadow: {
        card: "0 4px 14px rgba(0, 0, 0, 0.25)",
        panel: "0 8px 24px rgba(0, 0, 0, 0.35)",
        "accent-glow": "0 6px 18px rgba(255, 180, 84, 0.28)",
        pixel: "0 4px 14px rgba(0, 0, 0, 0.25)",
        "pixel-lg": "0 8px 24px rgba(0, 0, 0, 0.35)",
      },
      borderRadius: {
        DEFAULT: "10px",
        lg: "10px",
        md: "8px",
        sm: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
