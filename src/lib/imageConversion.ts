function isHeic(file: File): boolean {
  const type = file.type.toLowerCase();
  if (type === "image/heic" || type === "image/heif") return true;
  // Some browsers don't set the MIME type for HEIC files, so check extension
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "heic" || ext === "heif";
}

async function convertOne(file: File): Promise<File> {
  // Dynamic import to avoid "window is not defined" during SSR
  const { heicTo } = await import("heic-to");
  const jpegBlob = await heicTo({
    blob: file,
    type: "image/jpeg",
    quality: 0.92,
  });
  const stem = file.name.replace(/\.[^.]+$/, "");
  return new File([jpegBlob], `${stem}.jpg`, { type: "image/jpeg" });
}

/** Convert any HEIC/HEIF files in the array to JPEG. Non-HEIC files pass through unchanged. */
export async function convertHeicFiles(files: File[]): Promise<File[]> {
  return Promise.all(files.map((f) => (isHeic(f) ? convertOne(f) : f)));
}
