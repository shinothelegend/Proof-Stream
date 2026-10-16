import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ProofStream realistic campaign & milestone data...");

  // Clean existing records if any
  await prisma.donation.deleteMany({});
  await prisma.verdict.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.campaign.deleteMany({});

  // Real-feeling NGO campaign: Kalimantan Clean Water & Sanitation
  const campaign = await prisma.campaign.create({
    data: {
      slug: "kalimantan-clean-water",
      title: "Clean Drinking Water & Sanitation for Kahayan Basin Communities",
      ngoName: "Tirta Lestari Borneo Initiative",
      ngoAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      story: `Over 3,400 indigenous Dayak families along the Kahayan River basin in Central Kalimantan rely directly on river water increasingly contaminated by upstream alluvial mining and seasonal dry-season pathogen blooms. Waterborne diarrheal illnesses represent the leading cause of preventable child morbidity in the sub-district.

The Tirta Lestari Borneo Initiative deploys proven, locally serviceable gravity-fed ceramic bio-sand filtration systems directly to village communal hubs, coupled with family hygiene distribution and certified water quality testing. 

With ProofStream, every dollar of your donation sits securely in a Base Sepolia smart contract escrow. Funds are streamed to our field teams only when on-site geotagged installation photos, supplier receipts, and certified laboratory water assays are verified by independent AI and logged forever on-chain via public attestations.`,
      goal: 2500.0, // 2,500 USDC
      escrowBalance: 2500.0,
      coverImageCid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      siteLat: -0.9614,
      siteLng: 113.9213,
      siteAddress: "Kahayan River Basin, Palangka Raya, Central Kalimantan, Indonesia",
      status: "ACTIVE",
      contractAddress: process.env.NEXT_PUBLIC_ESCROW_ADDRESS || null,
      milestones: {
        create: [
          {
            idx: 0,
            description: "Procure and install 5 communal gravity-fed ceramic water filtration units in Bukama and Danau Rawah villages.",
            amount: 1200.0, // 5 units @ $240/unit = $1,200
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
            geoFenceKm: 7.5,
            budgetLines: JSON.stringify([
              { item: "5x Heavy-Duty Ceramic Filter Systems", unitPrice: 195.0, qty: 5, total: 975.0 },
              { item: "Local River Freight & Installation Piping", unitPrice: 45.0, qty: 5, total: 225.0 }
            ]),
            status: "RELEASED",
            released: true,
            attestationUID: "0x3f5c1d8892ea012488319e7a859a7f347898858a7be76cb0db87b1c4b7890123",
            releaseTxHash: "0x789b4f2c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a",
          },
          {
            idx: 1,
            description: "Assemble and distribute 200 family hygiene kits (water purification tablets, medical soap, jerrycans, guidance charts).",
            amount: 800.0, // 200 kits @ $4/kit = $800
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45), // 45 days
            geoFenceKm: 10.0,
            budgetLines: JSON.stringify([
              { item: "Family Sanitation & Hygiene Kits", unitPrice: 3.5, qty: 200, total: 700.0 },
              { item: "Field Distribution Logistics & Village Guides", unitPrice: 100.0, qty: 1, total: 100.0 }
            ]),
            status: "PENDING",
            released: false,
          },
          {
            idx: 2,
            description: "Conduct certified independent laboratory water quality assay (E. coli, heavy metals, turbidity) and publish community transparency report.",
            amount: 500.0, // $500 assay & report
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days
            geoFenceKm: 15.0,
            budgetLines: JSON.stringify([
              { item: "Certified Lab Microbiological & Turbidity Panel (3 samples)", unitPrice: 110.0, qty: 3, total: 330.0 },
              { item: "Community Verification Report Printing & Translation", unitPrice: 170.0, qty: 1, total: 170.0 }
            ]),
            status: "PENDING",
            released: false,
          }
        ]
      }
    },
    include: {
      milestones: true,
    }
  });

  // Seed one completed submission with genuine AI reasoning for Milestone 0
  const milestone0 = campaign.milestones[0];
  const submission0 = await prisma.submission.create({
    data: {
      milestoneId: milestone0.id,
      workerName: "Budi Santoso (Lead Field Engineer)",
      workerAddress: "0x1b3c96de72565C13D1a457492987E23a7e584739",
      notes: "Completed installation of all 5 ceramic filtration towers across Bukama village central shelter. Water flow rate tested at 42L/hr, zero leakages.",
      status: "PASSED",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36h ago
      evidence: {
        create: [
          {
            kind: "photo",
            cid: "bafybeig47m24z2dzy4x6gqum64j5r5t7g76vdfsfqklj3x7qplp245c43q",
            phash: "a1b2c3d4e5f60718",
            fileName: "filter_installation_bukama_site1.jpg",
            mimeType: "image/jpeg",
            exif: JSON.stringify({
              lat: -0.9621,
              lng: 113.9205,
              time: new Date(Date.now() - 1000 * 60 * 60 * 38).toISOString(),
              device: "Samsung Galaxy A54 5G",
              distanceKm: 0.12
            })
          },
          {
            kind: "receipt",
            cid: "bafybeih4j2k7l9m2n4p6q8r0s2t4u6v8w0x2y4z6a8b0c2d4e6f8g0h2j",
            phash: "f8e7d6c5b4a39281",
            fileName: "supplier_invoice_filter_elements_1200usdc.pdf",
            mimeType: "application/pdf",
            exif: JSON.stringify({
              vendor: "CV Borneo Filter Mandiri",
              invoiceNumber: "BFM-2026-0891",
              totalClaimed: 1200.0
            })
          }
        ]
      },
      verdict: {
        create: {
          confidence: 0.94,
          verdict: "PASSED",
          reasoning: "Visual evidence clearly depicts 5 industrial ceramic filtration cylinders mounted on concrete pads matching the specified Bukama village communal site. OCR extraction of invoice #BFM-2026-0891 confirms 5 filter units @ $195.00 plus river freight totaling exactly $1,200.00 USDC, in 100% agreement with milestone tranche budget. Geotag coordinates (-0.9621, 113.9205) fall within 120 meters of the declared milestone geofence, and EXIF timestamp confirms installation during the active milestone period.",
          flags: JSON.stringify([]),
          receiptTotal: 1200.0,
          budgetMatch: true,
          photoMatchesClaim: true,
          attestationUID: milestone0.attestationUID,
          txHash: milestone0.releaseTxHash,
          releasedAt: new Date(Date.now() - 1000 * 60 * 60 * 35),
        }
      }
    }
  });

  // Seed one real donor record on Base Sepolia
  await prisma.donation.create({
    data: {
      campaignId: campaign.id,
      donorAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      amount: 2500.0,
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    }
  });

  console.log("✅ Seed completed successfully!");
  console.log(`Campaign ID: ${campaign.id}`);
  console.log(`Milestone 0 (Released): ${milestone0.id}`);
  console.log(`Milestone 1 (Pending demo target): ${campaign.milestones[1].id}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
