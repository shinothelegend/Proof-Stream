import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { campaignId, donorAddress, amount, txHash } = body;

    if (!campaignId || !donorAddress || !amount || !txHash) {
      return NextResponse.json(
        { success: false, error: "Missing required donation parameters" },
        { status: 400 }
      );
    }

    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Record donation
    const donation = await db.donation.create({
      data: {
        campaignId,
        donorAddress,
        amount: Number(amount),
        txHash,
      },
    });

    // Update campaign escrow balance
    const updatedCampaign = await db.campaign.update({
      where: { id: campaignId },
      data: {
        escrowBalance: {
          increment: Number(amount),
        },
      },
    });

    return NextResponse.json({
      success: true,
      donation,
      newEscrowBalance: updatedCampaign.escrowBalance,
    });
  } catch (error: any) {
    console.error("API /api/fund error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record donation" },
      { status: 500 }
    );
  }
}
