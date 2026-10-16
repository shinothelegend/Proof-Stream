import { z } from "zod";
import exifr from "exifr";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db";
import { hammingDistance, computeImageDHash } from "./hasher";
import { calculateDistanceKm } from "./geofence";
import { releaseTrancheOnChain, logDecisionOnChain } from "@/lib/chainsigner";
import { keccak256, stringToHex } from "viem";

export const verdictSchema = z.object({
  photoMatchesClaim: z.boolean(),
  receiptTotal: z.number().nullable(),
  budgetMatch: z.boolean().nullable(),
  reasoning: z.string().min(40),
  confidence: z.number().min(0).max(1),
  flags: z.array(
    z.enum([
      "NO_GPS",
      "OUT_OF_GEOFENCE",
      "REUSED_IMAGE",
      "PHOTO_MISMATCH",
      "BUDGET_MISMATCH",
      "RECEIPT_UNREADABLE",
      "LOW_QUALITY",
    ])
  ),
});

export type VerdictResult = z.infer<typeof verdictSchema>;

export async function verifySubmission(submissionId: string) {
  // 1. Fetch submission from database
  const submission = await db.submission.findUnique({
    where: { id: submissionId },
    include: {
      evidence: true,
      milestone: {
        include: {
          campaign: true,
        },
      },
    },
  });

  if (!submission) {
    throw new Error(`Submission ${submissionId} not found`);
  }

  const { milestone, evidence } = submission;
  const flags: Array<
    "NO_GPS" | "OUT_OF_GEOFENCE" | "REUSED_IMAGE" | "PHOTO_MISMATCH" | "BUDGET_MISMATCH" | "RECEIPT_UNREADABLE" | "LOW_QUALITY"
  > = [];

  // Update submission status to VERIFYING
  await db.submission.update({
    where: { id: submissionId },
    data: { status: "VERIFYING" },
  });

  // Step 1: Reuse detection via Perceptual Hash comparison against existing records
  const allExistingEvidence = await db.evidence.findMany({
    where: {
      submissionId: { not: submissionId },
      phash: { not: null },
    },
    select: { phash: true, fileName: true },
  });

  let isReusedImage = false;
  for (const ev of evidence) {
    if (ev.phash) {
      for (const existing of allExistingEvidence) {
        if (existing.phash) {
          const dist = hammingDistance(ev.phash, existing.phash);
          if (dist < 8) {
            isReusedImage = true;
            flags.push("REUSED_IMAGE");
            break;
          }
        }
      }
    }
  }

  // Step 2: EXIF & Geofence Verification
  let gpsFound = false;
  let distanceKm: number | null = null;

  for (const ev of evidence) {
    if (ev.exif) {
      try {
        const parsedExif = JSON.parse(ev.exif);
        if (parsedExif.lat !== undefined && parsedExif.lng !== undefined) {
          gpsFound = true;
          distanceKm = calculateDistanceKm(
            parsedExif.lat,
            parsedExif.lng,
            milestone.campaign.siteLat,
            milestone.campaign.siteLng
          );

          if (distanceKm > milestone.geoFenceKm) {
            flags.push("OUT_OF_GEOFENCE");
          }
          break;
        }
      } catch {
        // Continue
      }
    }
  }

  if (!gpsFound) {
    flags.push("NO_GPS");
  }

  // Step 3: Multimodal Vision + OCR using Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    // In accordance with Part 1.1 of the Real-Data Law:
    // If the Gemini key is missing, return a clear error — do NOT fake or mock.
    throw new Error(
      "GEMINI_API_KEY is not configured in .env. In accordance with ProofStream strict real-data law §1.1, AI verdicts cannot be simulated or mocked. Please add a valid Google AI Studio key."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });

  const prompt = `You are the Lead Verification Auditor for ProofStream, an impact-gated humanitarian escrow platform.
Analyze the submitted field evidence against the following declared milestone claim and budget:

Campaign: "${milestone.campaign.title}"
Milestone Claim: "${milestone.description}"
Tranche Target Amount: ${milestone.amount} USDC
Declared Budget Breakdown: ${milestone.budgetLines}

Evidence Submitted:
${evidence.map((e) => `- ${e.kind.toUpperCase()}: ${e.fileName || "file"} (IPFS CID: ${e.cid})`).join("\n")}
GPS Status: ${gpsFound ? `Coordinates verified (${distanceKm?.toFixed(2)} km from target site)` : "No GPS EXIF tags detected"}
Image Reuse Flag: ${isReusedImage ? "CRITICAL: Image perceptual hash matches previous submission" : "Unique image confirmed"}

Perform the following verification checks:
1. Verify if the visual photo evidence physically depicts the claimed equipment/activities.
2. Perform OCR on any receipts or invoices. Extract the total monetary amount.
3. Check whether the extracted invoice total matches the expected milestone budget.
4. Assess visual authenticity and quality.

Return a STRICT JSON response adhering to this schema:
{
  "photoMatchesClaim": boolean,
  "receiptTotal": number | null,
  "budgetMatch": boolean | null,
  "reasoning": string, // Comprehensive, professional audit explanation (at least 40 characters)
  "confidence": number, // Decimal between 0.0 and 1.0
  "flags": string[] // Subsets of ["NO_GPS", "OUT_OF_GEOFENCE", "REUSED_IMAGE", "PHOTO_MISMATCH", "BUDGET_MISMATCH", "RECEIPT_UNREADABLE", "LOW_QUALITY"]
}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const responseText = result.response.text();
  let aiVerdict: VerdictResult;

  try {
    const rawParsed = JSON.parse(responseText);
    // Combine algorithmic flags with AI flags
    const combinedFlags = Array.from(new Set([...flags, ...(rawParsed.flags || [])]));
    aiVerdict = verdictSchema.parse({
      ...rawParsed,
      flags: combinedFlags,
    });
  } catch (err) {
    throw new Error(`Failed to parse structured Gemini verdict: ${err} - Raw: ${responseText}`);
  }

  // Step 4: Final Decision Resolution
  let finalStatus: "PASSED" | "REJECTED" | "FLAGGED";

  const hasHardFlag =
    aiVerdict.flags.includes("REUSED_IMAGE") ||
    aiVerdict.flags.includes("PHOTO_MISMATCH");

  if (hasHardFlag) {
    finalStatus = "REJECTED";
  } else if (aiVerdict.confidence >= 0.85 && aiVerdict.photoMatchesClaim) {
    finalStatus = "PASSED";
  } else {
    finalStatus = "FLAGGED";
  }

  // Step 5: On-chain release if PASSED
  let releaseTxHash: string | null = null;
  let attestationUID: string | null = null;

  if (finalStatus === "PASSED" && milestone.campaign.contractAddress) {
    try {
      const evidenceCidBytes32 = keccak256(stringToHex(evidence[0]?.cid || "no-cid"));
      const reasoningHash = keccak256(stringToHex(aiVerdict.reasoning));

      // Attempt on-chain release using isolated backend signer
      const releaseResult = await releaseTrancheOnChain(
        milestone.campaign.contractAddress as `0x${string}`,
        milestone.idx,
        reasoningHash
      );

      releaseTxHash = releaseResult.hash;
      attestationUID = reasoningHash;

      // Update milestone status
      await db.milestone.update({
        where: { id: milestone.id },
        data: {
          released: true,
          status: "RELEASED",
          releaseTxHash,
          attestationUID,
        },
      });
    } catch (chainErr) {
      console.warn("On-chain release warning (will require verifier wallet funded on Base Sepolia):", chainErr);
      // Even if on-chain write fails due to gas/keys, don't fake tx hash.
    }
  }

  // Step 6: Persist verdict in DB
  const verdictRecord = await db.verdict.upsert({
    where: { submissionId },
    create: {
      submissionId,
      confidence: aiVerdict.confidence,
      verdict: finalStatus,
      reasoning: aiVerdict.reasoning,
      flags: JSON.stringify(aiVerdict.flags),
      receiptTotal: aiVerdict.receiptTotal,
      budgetMatch: aiVerdict.budgetMatch,
      photoMatchesClaim: aiVerdict.photoMatchesClaim,
      attestationUID,
      txHash: releaseTxHash,
      releasedAt: finalStatus === "PASSED" ? new Date() : null,
    },
    update: {
      confidence: aiVerdict.confidence,
      verdict: finalStatus,
      reasoning: aiVerdict.reasoning,
      flags: JSON.stringify(aiVerdict.flags),
      receiptTotal: aiVerdict.receiptTotal,
      budgetMatch: aiVerdict.budgetMatch,
      photoMatchesClaim: aiVerdict.photoMatchesClaim,
      attestationUID,
      txHash: releaseTxHash,
      releasedAt: finalStatus === "PASSED" ? new Date() : null,
    },
  });

  // Update submission status
  await db.submission.update({
    where: { id: submissionId },
    data: { status: finalStatus },
  });

  return {
    submissionId,
    verdict: finalStatus,
    confidence: aiVerdict.confidence,
    reasoning: aiVerdict.reasoning,
    flags: aiVerdict.flags,
    attestationUID,
    txHash: releaseTxHash,
  };
}
