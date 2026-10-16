import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { releaseTrancheOnChain } from "@/lib/chainsigner";
import { keccak256, stringToHex } from "viem";

export async function GET(req: NextRequest) {
  try {
    const flaggedSubmissions = await db.submission.findMany({
      where: {
        status: { in: ["FLAGGED", "PENDING", "REJECTED"] },
      },
      include: {
        evidence: true,
        verdict: true,
        milestone: {
          include: {
            campaign: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: flaggedSubmissions,
    });
  } catch (error: any) {
    console.error("API /api/review GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch review queue" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-review-token");
    const expectedToken = process.env.REVIEW_TOKEN || "proofstream_review_pass_2026";

    // Reviewer authorization check
    if (authHeader && authHeader !== expectedToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized review token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { submissionId, action, reviewerNotes } = body; // action: 'APPROVE' | 'REJECT'

    if (!submissionId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing submissionId or action" },
        { status: 400 }
      );
    }

    const submission = await db.submission.findUnique({
      where: { id: submissionId },
      include: {
        milestone: {
          include: { campaign: true },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    if (action === "APPROVE") {
      let releaseTxHash: string | null = null;
      let attestationUID: string | null = null;

      if (submission.milestone.campaign.contractAddress) {
        try {
          const reasoningHash = keccak256(stringToHex(`MANUAL_OVERRIDE_APPROVED:${reviewerNotes || ""}`));
          const releaseResult = await releaseTrancheOnChain(
            submission.milestone.campaign.contractAddress as `0x${string}`,
            submission.milestone.idx,
            reasoningHash
          );
          releaseTxHash = releaseResult.hash;
          attestationUID = reasoningHash;
        } catch (chainErr) {
          console.warn("Manual approve on-chain release note:", chainErr);
        }
      }

      await db.milestone.update({
        where: { id: submission.milestoneId },
        data: {
          released: true,
          status: "RELEASED",
          releaseTxHash,
          attestationUID,
        },
      });

      await db.submission.update({
        where: { id: submissionId },
        data: { status: "PASSED" },
      });

      await db.verdict.upsert({
        where: { submissionId },
        create: {
          submissionId,
          confidence: 1.0,
          verdict: "PASSED",
          reasoning: `Manual Reviewer Approval: ${reviewerNotes || "Approved after manual audit of documentation and proof of work."}`,
          flags: JSON.stringify([]),
          txHash: releaseTxHash,
          attestationUID,
          releasedAt: new Date(),
        },
        update: {
          confidence: 1.0,
          verdict: "PASSED",
          reasoning: `Manual Reviewer Approval: ${reviewerNotes || "Approved after manual audit of documentation and proof of work."}`,
          flags: JSON.stringify([]),
          txHash: releaseTxHash,
          attestationUID,
          releasedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        status: "PASSED",
        txHash: releaseTxHash,
      });
    } else {
      await db.submission.update({
        where: { id: submissionId },
        data: { status: "REJECTED" },
      });

      await db.verdict.upsert({
        where: { submissionId },
        create: {
          submissionId,
          confidence: 0.0,
          verdict: "REJECTED",
          reasoning: `Manual Reviewer Rejection: ${reviewerNotes || "Rejected due to insufficient or unverified field documentation."}`,
          flags: JSON.stringify(["MANUAL_REJECTION"]),
        },
        update: {
          verdict: "REJECTED",
          reasoning: `Manual Reviewer Rejection: ${reviewerNotes || "Rejected due to insufficient or unverified field documentation."}`,
          flags: JSON.stringify(["MANUAL_REJECTION"]),
        },
      });

      return NextResponse.json({
        success: true,
        status: "REJECTED",
      });
    }
  } catch (error: any) {
    console.error("API /api/review POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process review" },
      { status: 500 }
    );
  }
}
