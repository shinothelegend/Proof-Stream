"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  MapPin,
  Mic,
  MicOff,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { SnapButton } from "@/components/pixel/SnapButton";
import { Typewriter } from "@/components/pixel/Typewriter";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { formatTxHash } from "@/lib/format";
import { QRCapturePanel } from "@/components/submit/QRCapturePanel";

export default function SubmitEvidencePage() {
  const params = useParams();
  const router = useRouter();
  const milestoneIdParam = params.milestoneId as string;

  const [milestones, setMilestones] = useState<any[]>([]);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(milestoneIdParam);
  const [workerName, setWorkerName] = useState("Budi Santoso (Field Team A)");
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  // Audio recording
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // GPS Coordinates
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingGps, setIsGettingGps] = useState(false);

  // Pipeline Status: IDLE | UPLOADING | VERIFYING | VERDICT
  const [stage, setStage] = useState<"IDLE" | "UPLOADING" | "VERIFYING" | "VERDICT">("IDLE");
  const [verdictResult, setVerdictResult] = useState<any>(null);

  // Load active milestones for selector
  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          const allMs = data.data.flatMap((c: any) =>
            c.milestones.map((m: any) => ({ ...m, campaignId: c.id, campaignTitle: c.title }))
          );
          setMilestones(allMs);

          const match = allMs.find(
            (m: any) => m.id === milestoneIdParam || m.campaignTitle.toLowerCase().includes("kalimantan")
          );
          if (match) setSelectedMilestoneId(match.id);
          else if (allMs.length > 0) setSelectedMilestoneId(allMs[0].id);
        }
      });
  }, [milestoneIdParam]);

  const activeMilestone = milestones.find((m) => m.id === selectedMilestoneId);

  // Handle Photo selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Demo Adversarial Test Input Loader (§2)
  const handleLoadTamperedDemoAsset = async () => {
    try {
      const res = await fetch("/demo/fraud-attempt.jpg");
      if (!res.ok) throw new Error("Asset not found");
      const blob = await res.blob();
      const file = new File([blob], "fraud-attempt.jpg", { type: "image/jpeg" });
      setPhotoFile(file);
      setPhotoPreview("/demo/fraud-attempt.jpg");
      toast.info("Loaded adversarial test input: Tampered / Reused field evidence", {
        description: "Ready for live dHash / EXIF fraud rejection pipeline.",
      });
    } catch (e: any) {
      toast.error("Could not load demo fraud asset.");
    }
  };

  // Handle Receipt selection
  const handleReceiptSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  // Capture GPS from Device
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsGettingGps(false);
        toast.success(`GPS acquired: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        setIsGettingGps(false);
        toast.error("Unable to retrieve location. Defaulting to EXIF tags.");
      }
    );
  };

  // Toggle Voice Recording
  const handleToggleVoice = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setAudioBlob(blob);
          toast.success("Voice note recorded");
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        toast.error("Microphone access denied or unavailable");
      }
    }
  };

  // Submit Evidence Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestoneId) {
      toast.error("Please select an active milestone");
      return;
    }
    if (!photoFile) {
      toast.error("Photo proof of field installation is required");
      return;
    }

    try {
      setStage("UPLOADING");

      const formData = new FormData();
      formData.append("milestoneId", selectedMilestoneId);
      formData.append("workerName", workerName);
      formData.append("notes", notes);
      formData.append("photo", photoFile);

      if (receiptFile) formData.append("receipt", receiptFile);
      if (audioBlob) formData.append("audio", audioBlob, "voice_note.webm");

      setStage("VERIFYING");

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Submission failed");
      }

      setVerdictResult(data.verdict || { verdict: "FLAGGED", reasoning: data.message });
      setStage("VERDICT");
      toast.success("Verification analysis completed!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit evidence");
      setStage("IDLE");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans pb-12">
      {/* Header */}
      <div>
        <Badge variant="testnet" className="mb-2">
          FIELD OPERATIVE PORTAL
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-pix-ink tracking-tight mt-1">
          <Typewriter text="SUBMIT FIELD PROOF" speed={40} />
        </h1>
        <p className="font-sans text-[15px] text-pix-dim mt-1.5 leading-relaxed">
          Evidence is cryptographically verified against geofence coordinates and supplier receipts.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {stage === "VERIFYING" || stage === "UPLOADING" ? (
          <motion.div
            key="loading-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <div className="rounded-[10px] card-chamfer bg-pix-panel p-8 sm:p-10 text-center space-y-6 border border-pix-accent/50 shadow-2xl">
              <div className="relative w-16 h-16 mx-auto rounded-[12px] bg-pix-accent/15 border border-pix-accent flex items-center justify-center text-pix-accent">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <h3 className="font-display font-semibold text-lg sm:text-xl text-pix-ink">
                  {stage === "UPLOADING" ? "Pinning Evidence to IPFS…" : "Gemini Multimodal Audit in Progress…"}
                </h3>
                <p className="font-sans text-[14px] text-pix-dim mt-2 max-w-sm mx-auto leading-relaxed">
                  Extracting EXIF GPS coordinates, comparing perceptual image dHash against database,
                  performing OCR on receipts, and validating against milestone budget.
                </p>
              </div>

              <div className="space-y-2.5 text-left max-w-xs mx-auto font-sans text-[13px]">
                <div className="flex items-center space-x-2 text-pix-success font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pinata IPFS Pinning</span>
                </div>
                <div className="flex items-center space-x-2 text-pix-accent font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Multimodal Vision & OCR</span>
                </div>
                <div className="flex items-center space-x-2 text-pix-dim">
                  <span className="w-4 h-4 border border-[var(--color-pix-hairline)] rounded-full inline-block" />
                  <span>Base Sepolia Attestation</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : stage === "VERDICT" && verdictResult ? (
          <motion.div
            key="verdict-stage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div
              className={`rounded-[10px] card-chamfer bg-pix-panel p-6 sm:p-8 space-y-6 border shadow-card ${
                verdictResult.verdict === "PASSED"
                  ? "border-pix-success/40 bg-pix-success/[0.03]"
                  : verdictResult.verdict === "REJECTED"
                  ? "border-pix-alert/40 bg-pix-alert/[0.03]"
                  : "border-pix-accent/40 bg-pix-accent/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    verdictResult.verdict === "PASSED"
                      ? "verified"
                      : verdictResult.verdict === "REJECTED"
                      ? "rejected"
                      : "flagged"
                  }
                >
                  VERDICT: {verdictResult.verdict}
                </Badge>

                {verdictResult.confidence !== undefined && (
                  <span className="font-mono text-sm text-pix-accent font-medium">
                    CONFIDENCE: {Math.round(verdictResult.confidence * 100)}%
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display font-bold text-xl text-pix-ink">
                  {verdictResult.verdict === "PASSED"
                    ? "Tranche Released On-Chain!"
                    : verdictResult.verdict === "REJECTED"
                    ? "Verification Rejected: Anomaly Detected"
                    : "Flagged for Auditor Oversight"}
                </h3>

                <p className="font-sans text-[15px] text-pix-dim mt-2 leading-relaxed">
                  {verdictResult.reasoning}
                </p>
              </div>

              {/* Flags list */}
              {(() => {
                const parsedFlags: string[] = Array.isArray(verdictResult.flags)
                  ? verdictResult.flags
                  : typeof verdictResult.flags === "string"
                  ? (() => {
                      try {
                        const parsed = JSON.parse(verdictResult.flags);
                        return Array.isArray(parsed) ? parsed : [];
                      } catch {
                        return verdictResult.flags ? [verdictResult.flags] : [];
                      }
                    })()
                  : [];

                if (parsedFlags.length === 0) return null;

                return (
                  <div className="space-y-1.5">
                    <span className="font-sans text-[13px] uppercase font-semibold text-pix-alert block">
                      Security Flags Detected
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedFlags.map((f: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-[13px] font-mono rounded-[6px] bg-pix-alert/15 text-pix-alert border border-pix-alert/30"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* On-Chain Transaction link */}
              {verdictResult.txHash && (
                <div className="p-3.5 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)] space-y-1">
                  <span className="font-sans text-[13px] uppercase font-semibold text-pix-accent block">
                    Base Sepolia Release Transaction
                  </span>
                  <a
                    href={`https://sepolia.basescan.org/tx/${verdictResult.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[12px] text-pix-accent hover:underline flex items-center space-x-1"
                  >
                    <span>{formatTxHash(verdictResult.txHash)}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* EAS Attestation link */}
              {verdictResult.attestationUid && (
                <div className="p-3.5 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)] space-y-1">
                  <span className="font-sans text-[13px] uppercase font-semibold text-pix-accent block">
                    EAS Attestation UID
                  </span>
                  <a
                    href={`https://base-sepolia.easscan.org/attestation/view/${verdictResult.attestationUid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[12px] text-pix-accent hover:underline flex items-center space-x-1"
                  >
                    <span>{formatTxHash(verdictResult.attestationUid)}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <SnapButton
                  variant="secondary"
                  size="md"
                  onClick={() => setStage("IDLE")}
                  className="w-full"
                >
                  SUBMIT ANOTHER PROOF
                </SnapButton>
                <SnapButton
                  variant="primary"
                  size="md"
                  onClick={() => router.push("/audit")}
                  className="w-full"
                >
                  INSPECT PUBLIC AUDIT →
                </SnapButton>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <QRCapturePanel
              milestoneId={selectedMilestoneId}
              campaignId={activeMilestone?.campaignId}
              onSubmissionDetected={(sub) => {
                if (sub.verdict) {
                  setVerdictResult(sub.verdict);
                  setStage("VERDICT");
                }
              }}
            />

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Milestone Selector */}
              <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-5 space-y-2">
                <label className="font-sans text-[13px] uppercase font-semibold text-pix-ink block">
                  Select Active Milestone Tranche
                </label>
              <select
                value={selectedMilestoneId}
                onChange={(e) => setSelectedMilestoneId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] font-sans text-[15px] text-pix-ink focus:outline-none focus:border-pix-accent transition-all shadow-sm"
              >
                {milestones.map((m) => (
                  <option key={m.id} value={m.id} className="bg-pix-panel text-pix-ink">
                    Tranche #{m.idx + 1}: {m.description.slice(0, 48)}... (${m.amount} USDC)
                  </option>
                ))}
              </select>
            </div>

            {/* Field Worker Identity */}
            <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-5 space-y-2">
              <label className="font-sans text-[13px] uppercase font-semibold text-pix-ink block">
                Field Operative Identity
              </label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="Worker Name / Lead Engineer"
                className="w-full px-4 py-2.5 rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] font-sans text-[15px] text-pix-ink focus:outline-none focus:border-pix-accent shadow-sm"
              />
            </div>

            {/* Photo Capture (Mandatory) */}
            <div data-tour="evidence-card" className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="font-sans text-[13px] uppercase font-semibold text-pix-ink flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-pix-accent" />
                  <span>Field Installation Photo (GPS EXIF)</span>
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleLoadTamperedDemoAsset}
                    title="Adversarial test input: pre-loads a duplicate/tampered asset to test real AI fraud rejection"
                    className="text-[12px] font-mono uppercase px-2 py-0.5 rounded-[6px] bg-pix-alert/15 text-pix-alert border border-pix-alert/30 hover:bg-pix-alert/25 transition-colors cursor-pointer"
                  >
                    DEMO: try a tampered image
                  </button>
                  <span className="font-sans text-[11px] uppercase font-bold text-pix-alert">MANDATORY</span>
                </div>
              </div>

              {photoPreview ? (
                <div className="relative aspect-video rounded-[8px] border border-pix-accent overflow-hidden">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <SnapButton
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                    >
                      CHANGE
                    </SnapButton>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 rounded-[10px] border border-dashed border-[var(--color-pix-hairline)] cursor-pointer hover:border-pix-accent hover:bg-pix-accent/5 transition-all">
                  <Camera className="w-8 h-8 text-pix-dim mb-2" />
                  <span className="font-sans text-[15px] font-medium text-pix-ink">Take photo with camera or upload</span>
                  <span className="font-sans text-[13px] text-pix-dim mt-0.5">Location tagging must be enabled</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Geolocation Tagging Helper */}
            <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-sans text-[13px] uppercase font-semibold text-pix-ink flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-pix-accent" />
                  <span>Device Geolocation</span>
                </span>
                <span className="font-mono text-xs text-pix-accent block">
                  {gpsCoords
                    ? `${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)}`
                    : "Uses camera EXIF or browser GPS"}
                </span>
              </div>

              <SnapButton
                variant="secondary"
                size="sm"
                onClick={handleGetLocation}
                disabled={isGettingGps}
              >
                {isGettingGps ? "Acquiring…" : "Get GPS"}
              </SnapButton>
            </div>

            {/* Receipt / Invoice Upload (OCR) */}
            <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-5 space-y-3">
              <label className="font-sans text-[13px] uppercase font-semibold text-pix-ink flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-pix-accent" />
                <span>Supplier Invoice / Receipt (OCR Verification)</span>
              </label>

              {receiptPreview ? (
                <div className="flex items-center justify-between p-3 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)]">
                  <span className="font-mono text-xs text-pix-accent truncate max-w-[200px]">{receiptFile?.name}</span>
                  <SnapButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReceiptFile(null);
                      setReceiptPreview(null);
                    }}
                  >
                    REMOVE
                  </SnapButton>
                </div>
              ) : (
                <label className="flex items-center justify-center p-5 rounded-[10px] border border-dashed border-[var(--color-pix-hairline)] cursor-pointer hover:border-pix-accent transition-all font-sans text-[13px] text-pix-dim space-x-2">
                  <UploadCloud className="w-4 h-4 text-pix-accent" />
                  <span>Upload supplier bill or receipt</span>
                  <input type="file" accept="image/*,application/pdf" onChange={handleReceiptSelect} className="hidden" />
                </label>
              )}
            </div>

            {/* Optional Voice Note */}
            <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-5 flex items-center justify-between">
              <div>
                <span className="font-sans text-[13px] uppercase font-semibold text-pix-ink block">Local Language Voice Note</span>
                <span className="font-sans text-[13px] text-pix-dim">Gemini transcribes and translates</span>
              </div>

              <SnapButton
                variant={isRecording ? "alert" : audioBlob ? "success" : "secondary"}
                size="sm"
                onClick={handleToggleVoice}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5 mr-1" /> : <Mic className="w-3.5 h-3.5 mr-1" />}
                {isRecording ? "Stop Recording" : audioBlob ? "Recorded ✓" : "Record Voice"}
              </SnapButton>
            </div>

            {/* Field Notes */}
            <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-5 space-y-2">
              <label className="font-sans text-[13px] uppercase font-semibold text-pix-ink block">Field Notes & Observations</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of installation, community recipient count, testing results..."
                rows={3}
                className="w-full p-3.5 rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] font-sans text-[15px] text-pix-ink focus:outline-none focus:border-pix-accent resize-none shadow-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <SnapButton
                variant="primary"
                size="lg"
                type="submit"
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                SUBMIT FOR AI VERIFICATION & ON-CHAIN RELEASE
              </SnapButton>
            </div>
          </form>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}
