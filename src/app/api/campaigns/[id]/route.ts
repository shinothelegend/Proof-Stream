import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const campaign = await db.campaign.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        milestones: {
          orderBy: { idx: "asc" },
          include: {
            submissions: {
              include: {
                evidence: true,
                verdict: true,
              },
              orderBy: { createdAt: "desc" },
            },
          },
        },
        donations: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: campaign,
    });
  } catch (error: any) {
    console.error("API /api/campaigns/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}
