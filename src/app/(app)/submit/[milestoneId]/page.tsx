"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SnapButton } from "@/components/pixel/SnapButton";
import { Typewriter } from "@/components/pixel/Typewriter";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { formatTxHash } from "@/lib/format";

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
            c.milestones.map((m: any) => ({ ...m, campaignTitle: c.title }))
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

  // Handle Photo selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Badge variant="testnet" className="mb-2">
          FIELD OPERATIVE PORTAL
        </Badge>
        <h1 className="font-heading text-xl sm:text-2xl text-pix-ink uppercase tracking-wide">
          <Typewriter text="SUBMIT FIELD PROOF" speed={40} />
        </h1>
        <p className="font-body text-xs text-pix-dim mt-1">
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
            <GlassCard className="p-8 sm:p-10 text-center space-y-6 border-4 border-pix-gold">
              <div className="relative w-16 h-16 mx-auto bg-pix-gold/20 border-2 border-pix-gold flex items-center justify-center text-pix-gold">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <h3 className="font-heading text-base sm:text-lg text-pix-ink uppercase tracking-wide">
                  {stage === "UPLOADING" ? "PINNING EVIDENCE TO IPFS..." : "GEMINI MULTIMODAL AUDIT IN PROGRESS..."}
                </h3>
                <p className="font-body text-xs text-pix-dim mt-2 max-w-sm mx-auto leading-relaxed">
                  Extracting EXIF GPS coordinates, comparing perceptual image dHash against database,
                  performing OCR on receipts, and validating against milestone budget.
                </p>
              </div>

              <div className="space-y-2 text-left max-w-xs mx-auto font-body text-xs">
                <div className="flex items-center space-x-2 text-pix-mint">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pinata IPFS Pinning</span>
                </div>
                <div className="flex items-center space-x-2 text-pix-gold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Multimodal Vision & OCR</span>
                </div>
                <div className="flex items-center space-x-2 text-pix-dim">
                  <span className="w-3.5 h-3.5 border border-pix-dim inline-block" />
                  <span>Base Sepolia Attestation</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : stage === "VERDICT" && verdictResult ? (
          <motion.div
            key="verdict-stage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <GlassCard
              className={`p-6 sm:p-8 space-y-6 border-4 ${
                verdictResult.verdict === "PASSED"
                  ? "border-pix-mint bg-pix-mint/[0.04]"
                  : verdictResult.verdict === "REJECTED"
                  ? "border-pix-alert bg-pix-alert/[0.04]"
                  : "border-pix-gold bg-pix-gold/[0.04]"
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
                  <span className="font-body text-xs text-pix-cyan font-bold">
                    CONFIDENCE: {Math.round(verdictResult.confidence * 100)}%
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-heading text-lg text-pix-ink uppercase">
                  {verdictResult.verdict === "PASSED"
                    ? "TRANCHE RELEASED ON-CHAIN!"
                    : verdictResult.verdict === "REJECTED"
                    ? "VERIFICATION REJECTED: FRAUD DETECTED"
                    : "FLAGGED FOR AUDITOR REVIEW"}
                </h3>

                <p className="font-body text-xs text-pix-dim mt-3 leading-relaxed">
                  {verdictResult.reasoning}
                </p>
              </div>

              {/* Flags list */}
              {verdictResult.flags?.length > 0 && (
                <div className="space-y-1">
                  <span className="font-heading text-[10px] uppercase text-pix-alert block">
                    Security Flags Detected
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {verdictResult.flags.map((f: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-body bg-pix-alert/20 text-pix-alert border border-pix-alert"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* On-Chain Transaction link */}
              {verdictResult.txHash && (
                <div className="p-3 bg-pix-bg border-2 border-pix-dim/30 space-y-1">
                  <span className="font-heading text-[10px] uppercase text-pix-gold block">
                    Base Sepolia Attestation Hash
                  </span>
                  <a
                    href={`https://sepolia.basescan.org/tx/${verdictResult.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs text-pix-cyan hover:underline flex items-center space-x-1"
                  >
                    <span>{formatTxHash(verdictResult.txHash)}</span>
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
            </GlassCard>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Milestone Selector */}
            <GlassCard className="p-5 space-y-2">
              <label className="font-heading text-xs uppercase text-pix-ink block">
                Select Active Milestone Tranche
              </label>
              <select
                value={selectedMilestoneId}
                onChange={(e) => setSelectedMilestoneId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-pix-bg border-2 border-pix-dim/40 font-body text-xs text-pix-ink focus:outline-none focus:border-pix-gold transition-all"
              >
                {milestones.map((m) => (
                  <option key={m.id} value={m.id} className="bg-pix-panel text-pix-ink">
                    Tranche #{m.idx + 1}: {m.description.slice(0, 48)}... (${m.amount} USDC)
                  </option>
                ))}
              </select>
            </GlassCard>

            {/* Field Worker Identity */}
            <GlassCard className="p-5 space-y-2">
              <label className="font-heading text-xs uppercase text-pix-ink block">
                Field Operative Identity
              </label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="Worker Name / Lead Engineer"
                className="w-full px-3.5 py-2 bg-pix-bg border-2 border-pix-dim/40 font-body text-xs text-pix-ink focus:outline-none focus:border-pix-gold"
              />
            </GlassCard>

            {/* Photo Capture (Mandatory) */}
            <GlassCard className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-heading text-xs uppercase text-pix-ink flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-pix-gold" />
                  <span>Field Installation Photo (GPS EXIF)</span>
                </label>
                <span className="font-heading text-[10px] uppercase text-pix-alert">MANDATORY</span>
              </div>

              {photoPreview ? (
                <div className="relative aspect-video border-2 border-pix-gold overflow-hidden">
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
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-pix-dim/40 cursor-pointer hover:border-pix-gold hover:bg-pix-gold/5 transition-all">
                  <Camera className="w-8 h-8 text-pix-dim mb-2" />
                  <span className="font-heading text-xs uppercase text-pix-ink">Take photo with camera or upload</span>
                  <span className="font-body text-[10px] text-pix-dim mt-0.5">Location tagging must be enabled</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </GlassCard>

            {/* Geolocation Tagging Helper */}
            <GlassCard className="p-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-heading text-xs uppercase text-pix-ink flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-pix-gold" />
                  <span>Device Geolocation</span>
                </span>
                <span className="font-body text-xs text-pix-cyan block">
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
                {isGettingGps ? "ACQUIRING..." : "GET GPS"}
              </SnapButton>
            </GlassCard>

            {/* Receipt / Invoice Upload (OCR) */}
            <GlassCard className="p-5 space-y-3">
              <label className="font-heading text-xs uppercase text-pix-ink flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-pix-cyan" />
                <span>Supplier Invoice / Receipt (OCR Verification)</span>
              </label>

              {receiptPreview ? (
                <div className="flex items-center justify-between p-3 bg-pix-bg border-2 border-pix-dim/30">
                  <span className="font-body text-xs text-pix-cyan truncate max-w-[200px]">{receiptFile?.name}</span>
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
                <label className="flex items-center justify-center p-4 border-2 border-dashed border-pix-dim/40 cursor-pointer hover:border-pix-gold transition-all font-heading text-xs uppercase text-pix-dim space-x-2">
                  <UploadCloud className="w-4 h-4 text-pix-gold" />
                  <span>Upload supplier bill or receipt</span>
                  <input type="file" accept="image/*,application/pdf" onChange={handleReceiptSelect} className="hidden" />
                </label>
              )}
            </GlassCard>

            {/* Optional Voice Note */}
            <GlassCard className="p-5 flex items-center justify-between">
              <div>
                <span className="font-heading text-xs uppercase text-pix-ink block">Local Language Voice Note</span>
                <span className="font-body text-[11px] text-pix-dim">Gemini transcribes and translates</span>
              </div>

              <SnapButton
                variant={isRecording ? "alert" : audioBlob ? "mint" : "secondary"}
                size="sm"
                onClick={handleToggleVoice}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5 mr-1" /> : <Mic className="w-3.5 h-3.5 mr-1" />}
                {isRecording ? "STOP RECORDING" : audioBlob ? "RECORDED ✓" : "RECORD VOICE"}
              </SnapButton>
            </GlassCard>

            {/* Field Notes */}
            <GlassCard className="p-5 space-y-2">
              <label className="font-heading text-xs uppercase text-pix-ink block">Field Notes & Observations</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details of installation, community recipient count, testing results..."
                rows={3}
                className="w-full p-3 bg-pix-bg border-2 border-pix-dim/40 font-body text-xs text-pix-ink focus:outline-none focus:border-pix-gold resize-none"
              />
            </GlassCard>

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
        )}
      </AnimatePresence>
    </div>
  );
}
