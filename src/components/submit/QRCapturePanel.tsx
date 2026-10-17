"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  Loader2,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { SnapButton } from "@/components/pixel/SnapButton";

interface QRCapturePanelProps {
  milestoneId: string;
  campaignId?: string;
  onSubmissionDetected?: (submission: any) => void;
}

export function QRCapturePanel({
  milestoneId,
  campaignId,
  onSubmissionDetected,
}: QRCapturePanelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [fullUrl, setFullUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Polling state
  const [waitingStatus, setWaitingStatus] = useState<"WAITING" | "RECEIVED">("WAITING");
  const [remoteSubmission, setRemoteSubmission] = useState<any>(null);
  const initialCountRef = useRef<number | null>(null);
  const isFirstPollRef = useRef(true);

  // Compute full URL on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/submit/${milestoneId}`;
      setFullUrl(url);

      // Generate QR Code
      QRCode.toDataURL(url, {
        width: 220,
        margin: 2,
        color: {
          dark: "#0b0f17",
          light: "#ffffff",
        },
      })
        .then((dataUri) => setQrDataUrl(dataUri))
        .catch((err) => console.error("QR Code generation error:", err));

      // Check if mobile device
      const isMobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
    }
  }, [milestoneId]);

  // Live polling for submissions every 5 seconds (§4)
  useEffect(() => {
    if (!milestoneId) return;

    let isMounted = true;

    const pollSubmissions = async () => {
      try {
        let submissionsList: any[] = [];

        if (campaignId) {
          const res = await fetch(`/api/campaigns/${campaignId}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data.success && data.data?.milestones) {
            const currentMs = data.data.milestones.find((m: any) => m.id === milestoneId);
            if (currentMs?.submissions) {
              submissionsList = currentMs.submissions;
            }
          }
        } else {
          const res = await fetch("/api/campaigns");
          if (!res.ok) return;
          const data = await res.json();
          if (data.success && data.data?.length > 0) {
            for (const camp of data.data) {
              const currentMs = camp.milestones?.find((m: any) => m.id === milestoneId);
              if (currentMs) {
                // Fetch full campaign to inspect submissions
                const campRes = await fetch(`/api/campaigns/${camp.id}`);
                const campData = await campRes.json();
                if (campData.success && campData.data?.milestones) {
                  const detailedMs = campData.data.milestones.find((m: any) => m.id === milestoneId);
                  if (detailedMs?.submissions) {
                    submissionsList = detailedMs.submissions;
                    break;
                  }
                }
              }
            }
          }
        }

        if (!isMounted) return;

        if (isFirstPollRef.current) {
          initialCountRef.current = submissionsList.length;
          isFirstPollRef.current = false;
        } else if (
          initialCountRef.current !== null &&
          submissionsList.length > initialCountRef.current
        ) {
          const newest = submissionsList[0];
          setWaitingStatus("RECEIVED");
          setRemoteSubmission(newest);
          toast.success("New mobile submission received!", {
            description: `Operative: ${newest.workerName || "Field Agent"}`,
          });
          if (onSubmissionDetected) {
            onSubmissionDetected(newest);
          }
        }
      } catch (err) {
        console.warn("Poll submissions error:", err);
      }
    };

    pollSubmissions();
    const interval = setInterval(pollSubmissions, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [milestoneId, campaignId, onSubmissionDetected]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setIsCopied(true);
      toast.success("Route URL copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Could not copy URL");
    }
  };

  return (
    <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card overflow-hidden transition-all">
      {/* Header bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[var(--color-pix-hairline)] bg-pix-bg/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-pix-accent/15 border border-pix-accent/40 flex items-center justify-center text-pix-accent">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-sans text-[13px] uppercase font-bold tracking-wider text-pix-ink">
                Live Demo: Capture From Phone
              </span>
              <Badge variant="testnet" className="text-[11px] py-0">
                JUDGE INTERACTIVE
              </Badge>
            </div>
            <p className="font-sans text-[13px] text-pix-dim">
              Point your smartphone camera at the QR code to capture field proof directly.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-pix-dim hover:text-pix-ink p-1 transition-colors"
          title={isExpanded ? "Collapse panel" : "Expand panel"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-4">
          {isMobileDevice ? (
            <div className="p-4 rounded-[8px] bg-pix-accent/10 border border-pix-accent/30 text-center space-y-1">
              <span className="font-sans text-[13px] font-bold text-pix-accent block">
                Mobile Viewport Detected
              </span>
              <p className="font-sans text-[13px] text-pix-dim">
                Use the camera upload input directly below. It automatically activates your device camera with EXIF GPS tagging.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* QR Code Container */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <div className="p-2.5 bg-white rounded-[10px] shadow-md border border-[var(--color-pix-hairline)] inline-block">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Capture from phone QR code"
                      className="w-40 h-40 sm:w-44 sm:h-44 object-contain rounded-[6px]"
                    />
                  ) : (
                    <div className="w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center bg-gray-100 rounded-[6px]">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                <span className="font-mono text-[11px] text-pix-dim mt-2 tracking-tight">
                  Scannable on Base Sepolia Network
                </span>
              </div>

              {/* Status & Instructions */}
              <div className="sm:col-span-7 space-y-3.5">
                <div>
                  <h4 className="font-display font-semibold text-base text-pix-ink">
                    Judge Live Demonstration Step
                  </h4>
                  <p className="font-sans text-[13px] text-pix-dim leading-relaxed mt-1">
                    Scan with any iOS or Android camera app. The camera opens in the browser, attaches real EXIF location metadata, and sends the evidence through the Pinata IPFS &amp; Gemini verification pipeline.
                  </p>
                </div>

                {/* Live Polling Status Indicator */}
                <div className="p-3 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)] space-y-1.5">
                  <div className="flex items-center space-x-2">
                    {waitingStatus === "WAITING" ? (
                      <>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pix-accent opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pix-accent"></span>
                        </span>
                        <span className="font-mono text-[12px] font-semibold text-pix-accent">
                          WAITING FOR EVIDENCE FROM REMOTE DEVICE…
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-pix-success" />
                        <span className="font-mono text-[12px] font-semibold text-pix-success">
                          EVIDENCE RECEIVED FROM PHONE!
                        </span>
                      </>
                    )}
                  </div>
                  <p className="font-sans text-[12px] text-pix-dim">
                    {waitingStatus === "WAITING"
                      ? "Live 5-second polling active. This desktop view will update immediately when submitted."
                      : `Evidence submitted by ${remoteSubmission?.workerName || "Operative"}. Verification complete.`}
                  </p>
                </div>

                {/* Fallback Short URL */}
                <div className="space-y-1">
                  <span className="font-sans text-[12px] uppercase font-semibold text-pix-dim block">
                    Low-Bandwidth / Manual Entry URL
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={fullUrl}
                      className="flex-1 px-3 py-1.5 rounded-[6px] bg-pix-bg border border-[var(--color-pix-hairline)] font-mono text-[12px] text-pix-dim truncate select-all"
                    />
                    <SnapButton
                      variant="secondary"
                      size="sm"
                      onClick={handleCopyUrl}
                      className="flex-shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      {isCopied ? "COPIED" : "COPY"}
                    </SnapButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
