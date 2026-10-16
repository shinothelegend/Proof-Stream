import { NextRequest, NextResponse } from "next/server";
import { verifySubmission } from "@/server/agent/verify";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: "Missing submissionId" },
        { status: 400 }
      );
    }

    const verdict = await verifySubmission(submissionId);

    return NextResponse.json({
      success: true,
      data: verdict,
    });
  } catch (error: any) {
    console.error("API /api/verify error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
