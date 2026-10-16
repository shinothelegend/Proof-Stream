/**
 * Pinata IPFS Service
 * Uploads evidence files directly to IPFS and returns real content identifiers (CIDs).
 * Conforms to ProofStream Strict Operating Rules §1.1 & §1.3.
 */

export async function uploadToPinata(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ cid: string; size: number }> {
  const jwt = process.env.PINATA_JWT;

  if (!jwt || jwt.trim() === "") {
    throw new Error(
      "PINATA_JWT is not configured. In accordance with ProofStream strict real-data law §1.1, placeholder CIDs are strictly prohibited. Please provide a valid Pinata JWT in .env."
    );
  }

  const blob = new Blob([new Uint8Array(fileBuffer)], { type: contentType });
  const formData = new FormData();
  formData.append("file", blob, fileName);

  const metadata = JSON.stringify({
    name: fileName,
    keyvalues: {
      app: "ProofStream",
      uploadedAt: new Date().toISOString(),
    },
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 1,
  });
  formData.append("pinataOptions", options);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Pinata upload failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    cid: data.IpfsHash,
    size: data.PinSize,
  };
}

export function getIpfsGatewayUrl(cid: string): string {
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud";
  const cleanGateway = gateway.replace(/\/$/, "");
  return `${cleanGateway}/ipfs/${cid}`;
}
