"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Sparkles, Check, ArrowRight, X } from "lucide-react";
import { SnapButton } from "@/components/pixel/SnapButton";

export interface TourStepConfig {
  step: number;
  route: string;
  selector: string;
  title: string;
  description: string;
  nextRoute?: string;
}

export const TOUR_STEPS: TourStepConfig[] = [
  {
    step: 1,
    route: "/",
    selector: '[data-tour="hero-escrow"]',
    title: "1. Live Campaign Escrow",
    description: "This is a live campaign escrow. Let's fund one for real.",
    nextRoute: "/campaigns",
  },
  {
    step: 2,
    route: "/campaigns",
    selector: '[data-tour="quest-card"]',
    title: "2. Verifiable Impact Quests",
    description: "Each card is escrowed USDC on Base Sepolia. Funds unlock only via verified proof.",
    nextRoute: "/campaigns/cmvba68ow0000u8tkmoa6o86t",
  },
  {
    step: 3,
    route: "/campaigns/cmvba68ow0000u8tkmoa6o86t",
    selector: '[data-tour="fund-form"]',
    title: "3. Smart Contract Escrow",
    description: "Approve USDC then fund — the money locks in the contract.",
    nextRoute: "/campaigns/cmvba68ow0000u8tkmoa6o86t",
  },
  {
    step: 4,
    route: "/campaigns/cmvba68ow0000u8tkmoa6o86t",
    selector: '[data-tour="milestone-pipeline"]',
    title: "4. Milestone Tranche Pipeline",
    description: "Funds only unlock per milestone when proof is verified.",
    nextRoute: "/submit/cmvba68ox0002u8tkzdbxp1ed",
  },
  {
    step: 5,
    route: "/submit/cmvba68ox0002u8tkzdbxp1ed",
    selector: '[data-tour="evidence-card"]',
    title: "5. Frontline Evidence Capture",
    description: "Field workers upload geotagged evidence here.",
    nextRoute: "/review",
  },
  {
    step: 6,
    route: "/review",
    selector: '[data-tour="review-queue"]',
    title: "6. Auditor Oversight",
    description: "Low-confidence cases go to humans.",
    nextRoute: "/audit",
  },
  {
    step: 7,
    route: "/audit",
    selector: '[data-tour="audit-trail"]',
    title: "7. Public Attestation Trail",
    description: "Every decision is a public attestation. Click any hash.",
  },
];

interface TourContextType {
  startTour: (fromStep?: number) => void;
  stopTour: () => void;
  isTourActive: boolean;
  currentStep: number;
}

const TourContext = createContext<TourContextType>({
  startTour: () => {},
  stopTour: () => {},
  isTourActive: false,
  currentStep: 1,
});

export function useTour() {
  return useContext(TourContext);
}

// Utility: wait for a DOM element to be mounted
function waitForSelector(selector: string, timeoutMs = 4000): Promise<Element | null> {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const found = document.querySelector(selector);
      if (found) {
        clearInterval(interval);
        resolve(found);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        resolve(null);
      }
    }, 60);
  });
}

export function SpotlightTourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [showChecklistModal, setShowChecklistModal] = useState<boolean>(false);

  const driverInstanceRef = useRef<Driver | null>(null);

  // Stop tour cleanly
  const stopTour = useCallback(() => {
    if (driverInstanceRef.current) {
      driverInstanceRef.current.destroy();
      driverInstanceRef.current = null;
    }
    setIsTourActive(false);
    sessionStorage.removeItem("proofstream.tour.step");
    localStorage.setItem("proofstream.tour.dismissed", "true");
  }, []);

  // Launch driver at specific step
  const executeStep = useCallback(
    async (stepNum: number) => {
      const stepConfig = TOUR_STEPS.find((s) => s.step === stepNum);
      if (!stepConfig) return stopTour();

      setCurrentStep(stepNum);
      sessionStorage.setItem("proofstream.tour.step", String(stepNum));

      // Destroy previous driver instance if any
      if (driverInstanceRef.current) {
        driverInstanceRef.current.destroy();
      }

      // Wait for target element to mount
      const targetEl = await waitForSelector(stepConfig.selector, 4000);
      if (!targetEl) {
        // Element not found on this page, retry once or gracefully move
        console.warn(`[SpotlightTour] Target selector ${stepConfig.selector} not found`);
        return;
      }

      const isLastStep = stepNum === TOUR_STEPS.length;

      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayColor: "rgba(10, 10, 13, 0.75)",
        stageRadius: 10,
        stagePadding: 8,
        popoverClass: "proofstream-tour-popover",
        nextBtnText: isLastStep ? "Finish Tour ✓" : "Next →",
        prevBtnText: stepNum > 1 ? "← Back" : "",
        showButtons: stepNum > 1 ? ["next", "previous", "close"] : ["next", "close"],
        onDestroyed: () => {
          // If closed manually via X or ESC
          if (sessionStorage.getItem("proofstream.tour.step") === String(stepNum)) {
            stopTour();
          }
        },
        onNextClick: () => {
          driverObj.destroy();
          if (isLastStep) {
            stopTour();
          } else {
            const nextStepNum = stepNum + 1;
            const nextConfig = TOUR_STEPS.find((s) => s.step === nextStepNum);
            if (nextConfig) {
              if (pathname !== nextConfig.route) {
                sessionStorage.setItem("proofstream.tour.step", String(nextStepNum));
                router.push(nextConfig.route);
              } else {
                executeStep(nextStepNum);
              }
            }
          }
        },
        onPrevClick: () => {
          driverObj.destroy();
          const prevStepNum = stepNum - 1;
          const prevConfig = TOUR_STEPS.find((s) => s.step === prevStepNum);
          if (prevConfig) {
            if (pathname !== prevConfig.route) {
              sessionStorage.setItem("proofstream.tour.step", String(prevStepNum));
              router.push(prevConfig.route);
            } else {
              executeStep(prevStepNum);
            }
          }
        },
        steps: [
          {
            element: stepConfig.selector,
            popover: {
              title: stepConfig.title,
              description: stepConfig.description,
              side: "bottom",
              align: "start",
            },
          },
        ],
      });

      driverInstanceRef.current = driverObj;
      driverObj.drive();
    },
    [pathname, router, stopTour]
  );

  // Start tour from step
  const startTour = useCallback(
    (fromStep = 1) => {
      // Check reduced motion
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        setShowChecklistModal(true);
        return;
      }

      setIsTourActive(true);
      const targetConfig = TOUR_STEPS.find((s) => s.step === fromStep);
      if (!targetConfig) return;

      if (pathname !== targetConfig.route) {
        sessionStorage.setItem("proofstream.tour.step", String(fromStep));
        router.push(targetConfig.route);
      } else {
        executeStep(fromStep);
      }
    },
    [pathname, router, executeStep]
  );

  // Route change resume listener
  useEffect(() => {
    const savedStep = sessionStorage.getItem("proofstream.tour.step");
    if (savedStep) {
      const stepNum = parseInt(savedStep, 10);
      const stepConfig = TOUR_STEPS.find((s) => s.step === stepNum);
      if (stepConfig && pathname === stepConfig.route) {
        setIsTourActive(true);
        const timer = setTimeout(() => {
          executeStep(stepNum);
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, executeStep]);

  return (
    <TourContext.Provider value={{ startTour, stopTour, isTourActive, currentStep }}>
      {children}

      {/* Reduced-Motion Static Numbered Checklist Dialog (§7) */}
      {showChecklistModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-xl w-full rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--color-pix-hairline)] pb-4">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-5 h-5 text-pix-accent" />
                <h3 className="font-display font-bold text-xl text-pix-ink">
                  ProofStream Walkthrough Checklist
                </h3>
              </div>
              <button
                onClick={() => setShowChecklistModal(false)}
                className="text-pix-dim hover:text-pix-ink p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-sans text-sm text-pix-dim">
              Motion-reduced interactive guide. Explore every step of the verification pipeline directly:
            </p>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {TOUR_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-3.5 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)] flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="font-sans text-xs uppercase font-semibold text-pix-accent">
                      Step 0{step.step}
                    </span>
                    <h4 className="font-display font-semibold text-sm text-pix-ink">
                      {step.title.replace(/^\d+\.\s*/, "")}
                    </h4>
                    <p className="font-sans text-xs text-pix-dim">{step.description}</p>
                  </div>

                  <SnapButton
                    href={step.route}
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowChecklistModal(false)}
                  >
                    <span>VISIT</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </SnapButton>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <SnapButton
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowChecklistModal(false);
                  localStorage.setItem("proofstream.tour.dismissed", "true");
                }}
              >
                I&apos;M READY
              </SnapButton>
            </div>
          </div>
        </div>
      )}
    </TourContext.Provider>
  );
}
