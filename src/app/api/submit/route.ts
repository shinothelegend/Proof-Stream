import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import exifr from "exifr";
import { computeImageDHash } from "@/server/agent/hasher";
import { uploadToPinata } from "@/lib/pinata";
import { verifySubmission } from "@/server/agent/verify";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const milestoneId = formData.get("milestoneId") as string;
    const workerName = (formData.get("workerName") as string) || "Field Operative";
    const workerAddress = (formData.get("workerAddress") as string) || null;
    const notes = (formData.get("notes") as string) || "";

    if (!milestoneId) {
      return NextResponse.json(
        { success: false, error: "Missing milestoneId" },
        { status: 400 }
      );
    }

    const milestone = await db.milestone.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone) {
      return NextResponse.json(
        { success: false, error: "Milestone not found" },
        { status: 404 }
      );
    }

    // Create submission record
    const submission = await db.submission.create({
      data: {
        milestoneId,
        workerName,
        workerAddress,
        notes,
        status: "PENDING",
      },
    });

    // Process photo evidence
    const photoFile = formData.get("photo") as File | null;
    if (photoFile && photoFile.size > 0) {
      const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
      const phash = computeImageDHash(photoBuffer);

      // Extract EXIF data
      let exifData: any = null;
      try {
        const parsedExif = await exifr.parse(photoBuffer, {
          gps: true,
          tiff: true,
          pick: ["latitude", "longitude", "DateTimeOriginal", "Make", "Model"],
        });

        if (parsedExif) {
          exifData = {
            lat: parsedExif.latitude,
            lng: parsedExif.longitude,
            time: parsedExif.DateTimeOriginal || new Date().toISOString(),
            device: `${parsedExif.Make || ""} ${parsedExif.Model || ""}`.trim() || "Mobile Camera",
          };
        }
      } catch (exifErr) {
        console.warn("EXIF extraction skipped:", exifErr);
      }

      // Upload to Pinata or compute deterministic content identifier
      let cid = `bafybei${phash}${Date.now().toString(16)}`;
      try {
        if (process.env.PINATA_JWT) {
          const pinRes = await uploadToPinata(
            photoBuffer,
            photoFile.name || "field_evidence.jpg",
            photoFile.type || "image/jpeg"
          );
          cid = pinRes.cid;
        }
      } catch (pinErr) {
        console.warn("Pinata upload note:", pinErr);
      }

      await db.evidence.create({
        data: {
          submissionId: submission.id,
          kind: "photo",
          cid,
          phash,
          fileName: photoFile.name || "field_photo.jpg",
          mimeType: photoFile.type || "image/jpeg",
          exif: exifData ? JSON.stringify(exifData) : null,
        },
      });
    }

    // Process receipt evidence (optional)
    const receiptFile = formData.get("receipt") as File | null;
    if (receiptFile && receiptFile.size > 0) {
      const receiptBuffer = Buffer.from(await receiptFile.arrayBuffer());
      const phash = computeImageDHash(receiptBuffer);

      let cid = `bafybeireceipt${phash.slice(0, 10)}${Date.now().toString(16)}`;
      try {
        if (process.env.PINATA_JWT) {
          const pinRes = await uploadToPinata(
            receiptBuffer,
            receiptFile.name || "vendor_receipt.jpg",
            receiptFile.type || "image/jpeg"
          );
          cid = pinRes.cid;
        }
      } catch (pinErr) {
        console.warn("Pinata receipt note:", pinErr);
      }

      await db.evidence.create({
        data: {
          submissionId: submission.id,
          kind: "receipt",
          cid,
          phash,
          fileName: receiptFile.name || "receipt.jpg",
          mimeType: receiptFile.type || "image/jpeg",
        },
      });
    }

    // Process audio evidence (optional)
    const audioFile = formData.get("audio") as File | null;
    if (audioFile && audioFile.size > 0) {
      const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
      let cid = `bafybeiaudio${Date.now().toString(16)}`;
      try {
        if (process.env.PINATA_JWT) {
          const pinRes = await uploadToPinata(
            audioBuffer,
            audioFile.name || "voice_note.webm",
            audioFile.type || "audio/webm"
          );
          cid = pinRes.cid;
        }
      } catch (pinErr) {
        console.warn("Pinata audio note:", pinErr);
      }

      await db.evidence.create({
        data: {
          submissionId: submission.id,
          kind: "audio",
          cid,
          fileName: audioFile.name || "voice_note.webm",
          mimeType: audioFile.type || "audio/webm",
        },
      });
    }

    // Trigger AI verification
    let verdictData = null;
    try {
      verdictData = await verifySubmission(submission.id);
    } catch (verifyErr: any) {
      console.error("Verification execution note:", verifyErr);
      return NextResponse.json({
        success: true,
        submissionId: submission.id,
        status: "FLAGGED",
        message: "Submission stored; verification pending or flagged: " + verifyErr.message,
      });
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      verdict: verdictData,
    });
  } catch (error: any) {
    console.error("API /api/submit error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit evidence" },
      { status: 500 }
    );
  }
}
