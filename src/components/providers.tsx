"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "sonner";
import { config } from "@/lib/wagmi";
import { SnapCursorProvider } from "@/components/pixel/SnapCursorProvider";
import { SpotlightTourProvider } from "@/components/tour/SpotlightTour";
import "@rainbow-me/rainbowkit/styles.css";

function ThemedProviders({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client hydration, guarantee darkTheme to match server rendering.
  // Once mounted on client, seamlessly resolve the active theme.
  const isDark = mounted ? resolvedTheme !== "light" : true;

  const rainbowTheme = isDark
    ? darkTheme({
        accentColor: "#FFB454",
        accentColorForeground: "#0E0E12",
        borderRadius: "medium",
        fontStack: "system",
        overlayBlur: "none",
      })
    : lightTheme({
        accentColor: "#B36612",
        accentColorForeground: "#FFFFFF",
        borderRadius: "medium",
        fontStack: "system",
        overlayBlur: "none",
      });

  return (
    <RainbowKitProvider theme={rainbowTheme}>
      <SnapCursorProvider>
        <SpotlightTourProvider>
          {children}
        </SpotlightTourProvider>
      </SnapCursorProvider>
      <Toaster
        theme={isDark ? "dark" : "light"}
        position="top-right"
        toastOptions={{
          className: "pixel-toast font-mono text-xs",
          style: {
            background: "var(--color-panel)",
            border: "1px solid var(--color-hairline)",
            boxShadow: isDark
              ? "0 8px 24px rgba(0, 0, 0, 0.4)"
              : "0 8px 24px rgba(0, 0, 0, 0.08)",
            color: "var(--color-ink)",
            borderRadius: "10px",
          },
        }}
      />
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 5000,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ThemedProviders>{children}</ThemedProviders>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
