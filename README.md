# ProofStream: Autonomous Impact-Gated Streaming Aid Protocol

ProofStream is an on-chain escrow protocol built on Base Sepolia that replaces lump-sum humanitarian donations with autonomous, impact-verified milestone tranches. Funds remain locked in a smart contract and are released to frontline NGO wallets only when field workers submit verifiable photographic evidence and supplier invoices that pass automated forensic and multimodal AI audits. Every release decision is anchored on Base Sepolia via the Ethereum Attestation Service (EAS).

---

## Direct Links

- Live Application: https://proofstream-ashen.vercel.app/
- Video Demonstration: https://youtu.be/PWt_gj1h2lo
- GitHub Repository: https://github.com/shinothelegend/Proof-Stream
- Escrow Contract on BaseScan: https://sepolia.basescan.org/address/0xa0eb087d35d33d2306bc182beaa4222c6dd7d3e7
- EAS Attestation Schema: https://base-sepolia.easscan.org/schema/view/0xd3de6adb8faf789116a05f59a390b23af5b491a252a0bda2d11c0e8c194062b3

---

## The Problem and Architecture

International humanitarian aid faces systemic inefficiencies. According to United Nations OCHA and UNDP reports, less than 5 percent of international funding reaches frontline local non-governmental organizations directly, with billions lost annually to procurement fraud, administrative leakage, and unverified bank wire transfers.

ProofStream eliminates blind funding by implementing an end-to-end cryptographic and forensic pipeline:

```
+-----------------------------------------------------------------------------------+
| 1. CAPITAL DEPOSIT                                                                |
| Donor deposits testnet Circle USDC (6 decimals) into CampaignEscrow.sol on Base.   |
| Funds lock into discrete milestone tranches with strict financial deadlines.      |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 2. EVIDENCE SUBMISSION                                                            |
| Frontline workers capture on-site photos and supplier invoices via mobile or web. |
| Raw image buffers are parsed client-side for EXIF GPS tags and uploaded to IPFS.  |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| 3. MULTI-LAYER VERIFICATION AGENT (src/server/agent/verify.ts)                    |
|                                                                                   |
| Layer A: Perceptual Hash Check (hasher.ts)                                        |
| Computes a 64-bit gradient difference hash (dHash). Compares Hamming distance     |
| against all historical submissions in Neon PostgreSQL. Distance < 8 flags reuse.  |
|                                                                                   |
| Layer B: Geofence Validation (geofence.ts)                                        |
| Extracts EXIF coordinates (latitude, longitude) using exifr. Applies the          |
| Haversine formula against designated project coordinates (e.g. 5.0 km radius).    |
|                                                                                   |
| Layer C: Multimodal Vision and OCR Audit (verify.ts)                              |
| Sends image buffers to Gemini 3.8 Flash (@google/genai) with structured schema.   |
| Validates physical evidence against claimed milestones and itemized budget lines. |
+-----------------------------------------------------------------------------------+
                                          |
                     +--------------------+--------------------+
                     |                                         |
                     v PASSED                                  v REJECTED / FLAGGED
+-----------------------------------------+   +-------------------------------------+
| 4. ON-CHAIN SETTLEMENT                  |   | 4. ESCROW RETENTION                 |
| Signer wallet calls:                    |   | Tranche remains locked in contract. |
| a. EAS.attest() on Base Sepolia         |   | Detailed audit flags are recorded:  |
| b. CampaignEscrow.release()             |   | REUSED_IMAGE, OUT_OF_GEOFENCE,      |
| USDC transfers directly to NGO address. |   | PHOTO_MISMATCH, BUDGET_MISMATCH.    |
| Emits TrancheReleased and DecisionLogged|   | Accessible via /audit dashboard.    |
+-----------------------------------------+   +-------------------------------------+
```

---

## On-Chain Contract Specifications

All contracts run on Base Sepolia (Chain ID: 84532).

| Contract / Entity | Address / Identifier | Protocol Function |
|---|---|---|
| CampaignEscrow | 0xa0eb087d35d33d2306bc182beaa4222c6dd7d3e7 | Multi-milestone USDC escrow with role-based verification controls |
| Circle USDC | 0x036CbD53842c5426634e7929541eC2318f3dCF7e | Official testnet collateral asset (6 decimals) |
| EAS Contract | 0x4200000000000000000000000000000000000021 | Canonical OP-Stack attestation predeploy |
| EAS Schema Registry | 0x4200000000000000000000000000000000000020 | Canonical OP-Stack schema registry predeploy |
| Schema UID | 0xd3de6adb8faf789116a05f59a390b23af5b491a252a0bda2d11c0e8c194062b3 | bytes32 schema: uint256 milestoneId, uint8 verdict, uint256 confidence, bytes32 evidenceCid, bytes32 reasoningHash |

### Smart Contract Implementation: CampaignEscrow.sol

Located in `contracts/src/CampaignEscrow.sol`:
- `VERIFIER_ROLE`: Controlled via OpenZeppelin AccessControl. Only authorized verification signers can call the release function.
- `Milestone` Struct: Contains description, amount (6 decimals), deadline (uint64), status flags (released, refunded), and the resulting EAS attestation UID.
- `fund(uint256 amount)`: Pulls USDC from donor using SafeERC20 `safeTransferFrom` and emits a `Funded` event.
- `release(uint256 milestoneId, bytes32 _attestationUID)`: Enforces deadline checks, marks the milestone as released, logs the attestation UID, and dispatches USDC directly to the registered NGO recipient address.
- `logDecision(uint256 milestoneId, uint8 verdict, uint256 confidence, bytes32 evidenceCid, bytes32 reasoningHash)`: Emits immutable on-chain audit records regardless of whether a submission passes or fails.

---

## Verification Pipeline Technical Details

### 1. Perceptual Hash Duplicate Detection (src/server/agent/hasher.ts)
To stop repeated submissions of stock images or previously compensated work, the pipeline runs a 64-bit gradient difference hash:
1. Images are scaled to a 9x8 grayscale matrix.
2. Adjacent pixel brightness values are compared row by row to produce a 64-bit integer bitstring.
3. The bitstring is compared against all historical image records in the database using bitwise XOR and popcount (Hamming distance).
4. Any pair with a Hamming distance under 8 bits is immediately rejected with the `REUSED_IMAGE` flag.

### 2. Geofence Distance Calculation (src/server/agent/geofence.ts)
1. Binary buffers are parsed using `exifr` to extract GPSLatitude and GPSLongitude metadata.
2. The distance between the captured coordinates and the designated milestone deployment site is calculated using the Haversine spherical formula:
   ```
   a = sin²(Δφ/2) + cos(φ1) * cos(φ2) * sin²(Δλ/2)
   c = 2 * atan2(√a, √(1−a))
   d = R * c  (where R = 6371 km)
   ```
3. Submissions exceeding the milestone radius threshold (default: 5.0 km) receive an `OUT_OF_GEOFENCE` flag. Submissions stripped of location data receive `NO_GPS`.

### 3. Multimodal Analysis (src/server/agent/verify.ts)
The payload is evaluated by Google Gemini 3.8 Flash using the official `@google/genai` SDK:
- Input parameters: Milestone scope, itemized budget line items, maximum allowable claim, and raw image buffers.
- Structured output enforcement via Zod schema (`verdictSchema`):
  - `photoMatchesClaim` (boolean): Physical verification of equipment, installation, or site work.
  - `receiptTotal` (number): Numerical total extracted from merchant receipts via optical character recognition.
  - `budgetMatch` (boolean): Consistency with the agreed milestone budget.
  - `confidence` (float: 0.0 to 1.0): Calibration score based on visual quality, legible line items, and spatial match.
  - `reasoning` (string): Audit log describing the factual basis for the determination.

---

## Active Demonstration Datasets

The application is deployed with two production campaigns backed by real smart contract allocations:

### Campaign 1: Kalimantan Clean Drinking Water and Bio-Sand Filtration
- Target Region: Kahayan River Basin, Central Kalimantan, Indonesia (-0.9614, 113.9213)
- Total Allocation: 2,500.00 USDC
- Milestone 0 (Status: Released): 1,200.00 USDC. Procurement of 15 commercial grade ceramic filtration cores and PVC piping. Attestation verified and funds disbursed to NGO address `0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7`.
- Milestone 1 (Status: Pending Review): 800.00 USDC. Physical installation across 3 village communal hubs.
- Milestone 2 (Status: Pending Review): 500.00 USDC. Water quality assay certification testing for biological pathogen clearance.

### Campaign 2: Turkana Solar Cold-Chain and Vaccine Refrigeration
- Target Region: Lodwar and Lokitaung Sub-County Dispensaries, Turkana County, Kenya (3.1167, 35.6000)
- Total Allocation: 3,600.00 USDC
- Milestone 0 (Status: Pending Review): 1,800.00 USDC. Delivery and installation of 2 solar direct-drive vaccine refrigerators.
- Milestone 1 (Status: Pending Review): 1,200.00 USDC. IoT digital temperature loggers and 14-day continuous thermal monitoring.
- Milestone 2 (Status: Pending Review): 600.00 USDC. Clinical outreach cold-box carrier distribution.

---

## Local Development and Verification

### Prerequisites
- Node.js 20 or higher
- Foundry (`forge`) for smart contract testing
- PostgreSQL database (or Neon serverless instance)

### Setup Procedure

1. Clone repository and install dependencies:
```bash
git clone https://github.com/shinothelegend/Proof-Stream.git
cd Proof-Stream
npm install --legacy-peer-deps
```

2. Configure environment variables:
```bash
cp .env.example .env
```
Ensure `.env` contains your PostgreSQL credentials and API keys:
- `DATABASE_URL`: Connection string (PostgreSQL with pooling)
- `DIRECT_URL`: Direct database connection for schema migrations
- `GEMINI_API_KEY`: API key for Google Gemini verification agent
- `VERIFIER_PRIVATE_KEY`: Private key authorized with VERIFIER_ROLE on the escrow contract
- `NEXT_PUBLIC_ESCROW_ADDRESS`: `0xa0eb087d35d33d2306bc182beaa4222c6dd7d3e7`

3. Push database schema and populate active records:
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

4. Execute smart contract test suite:
```bash
forge test -vvv
```
All 5 test cases in `contracts/test/CampaignEscrow.t.sol` run with passing assertions:
- `testDeposit`: Validates USDC transfer and balances.
- `testReleaseMilestone`: Validates caller permissions, milestone status flags, and payment delivery.
- `testReentrancyProtection`: Confirms rejection of recursive calls.
- `testUnauthorizedReleaseReverts`: Verifies non-signers cannot force milestone releases.
- `testCannotReleasePastDeadline`: Asserts that expired tranches cannot be released.

5. Start local server:
```bash
npm run dev
```
Navigate to http://localhost:3000 to interact with the application.

---

## Security and Compliance Controls

- Isolated Keys: Verification signer keys (`VERIFIER_PRIVATE_KEY`) and deployer credentials are strictly server-side environment variables and are never exported to client-facing bundles.
- Real-Data Enforcement: The pipeline rejects synthetic mocks. If the AI service or database credentials are missing, calls fail explicitly with structured error logs rather than returning simulated approvals.
- On-Chain Auditability: In addition to off-chain PostgreSQL records, release hashes and decision metadata are written permanently to Base Sepolia and indexed on public explorers.
- Adversarial Validation: A pre-staged duplicate image test is available at `public/demo/fraud-attempt.jpg` to verify immediate dHash Hamming distance rejection during audits.

---

## License

This project is licensed under the MIT License.
