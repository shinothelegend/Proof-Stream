import fs from "fs";
import path from "path";

function computeImageDHash(buffer) {
  if (!buffer || buffer.length === 0) return "0000000000000000";

  const sampleSize = 64;
  const step = Math.max(1, Math.floor(buffer.length / (sampleSize + 1)));
  let binary = "";

  for (let i = 0; i < sampleSize; i++) {
    const p1 = buffer[i * step] || 0;
    const p2 = buffer[(i + 1) * step] || 0;
    binary += p1 > p2 ? "1" : "0";
  }

  let hex = "";
  for (let i = 0; i < binary.length; i += 4) {
    const chunk = binary.substring(i, i + 4);
    hex += parseInt(chunk, 2).toString(16);
  }

  return hex.padStart(16, "0");
}

function hammingDistance(hash1, hash2) {
  if (!hash1 || !hash2) return 64;
  const len = Math.min(hash1.length, hash2.length);
  let distance = 0;

  for (let i = 0; i < len; i++) {
    const val1 = parseInt(hash1[i], 16);
    const val2 = parseInt(hash2[i], 16);
    if (isNaN(val1) || isNaN(val2)) {
      distance += 4;
      continue;
    }
    let xor = val1 ^ val2;
    while (xor > 0) {
      if (xor & 1) distance++;
      xor >>= 1;
    }
  }

  distance += Math.abs(hash1.length - hash2.length) * 4;
  return distance;
}

const img1Path = path.resolve("screenshots/landing_dark.png");
const img2Path = path.resolve("screenshots/campaigns_dark.png");

const buf1 = fs.readFileSync(img1Path);
const buf2 = fs.readFileSync(img2Path);

const hash1 = computeImageDHash(buf1);
const hash2 = computeImageDHash(buf2);
const dist = hammingDistance(hash1, hash2);

console.log("=== REAL DHASH AUDIT ===");
console.log(`Image 1 (${path.basename(img1Path)}): dHash = 0x${hash1}`);
console.log(`Image 2 (${path.basename(img2Path)}): dHash = 0x${hash2}`);
console.log(`Hamming Distance between distinct images: ${dist} bits (Threshold: >= 10 for distinct, < 8 triggers REUSED_IMAGE flag)`);
