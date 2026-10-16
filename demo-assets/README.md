# ProofStream Demo Assets Directory

Place your test field photos and supplier receipts here:

1. `filter_installation_bukama_site1.jpg` — Real field installation photo with location tagging.
2. `supplier_invoice_1200usdc.jpg` — Clear paper receipt or supplier invoice for OCR matching.
3. `duplicate_fraud_photo.jpg` — Duplicate or slightly cropped copy of image #1 to demonstrate perceptual hash (dHash) fraud rejection.
4. `voice_update_indo.webm` — Local dialect voice recording for Gemini multimodal audio transcription.

The system will automatically compute 64-bit difference hashes (`dHash`) and extract EXIF metadata (GPS, Timestamp, Device) upon upload.
