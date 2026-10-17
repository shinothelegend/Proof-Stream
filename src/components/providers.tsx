"use client";

import React, { useState } from "react";
import { ThemeProvider } from "next-themes";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "sonner";
import { config } from "@/lib/wagmi";
import { SnapCursorProvider } from "@/components/pixel/SnapCursorProvider";
import "@rainbow-me/rainbowkit/styles.css";

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
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#FFC93C",
              accentColorForeground: "#000000",
              borderRadius: "none",
              fontStack: "system",
              overlayBlur: "none",
            })}
          >
            <SnapCursorProvider>
              {children}
            </SnapCursorProvider>
            <Toaster
              theme="dark"
              position="top-right"
              toastOptions={{
                className: "pixel-toast font-mono text-xs",
                style: {
                  background: "var(--color-pix-panel)",
                  border: "2px solid var(--color-pix-gold)",
                  boxShadow: "4px 4px 0 0 #000000",
                  color: "var(--color-pix-ink)",
                  borderRadius: "0px",
                },
              }}
            />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
