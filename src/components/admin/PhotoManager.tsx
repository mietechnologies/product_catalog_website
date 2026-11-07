"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";
import {
  deleteVariantImage,
  imagesMapToPhotos,
  reorderVariantImages,
  type ProductPhoto,
} from "@/lib/api/client";
import { cn } from "@/lib/utils";
import ImageUpload from "./ImageUpload";

interface PhotoManagerProps {
  productCode: string;
  /** Current photo URLs, in display order */
  images: string[];
  /** Backend keys parallel to `images` */
  imageKeys?: string[];
  /** Called after every saved change so the page can refresh */
  onChange: () => void;
}

/**
 * Admin photo editor for one variant or print: add, delete, reorder, and pick
 * the cover (the first photo). Every change saves right away.
 */
export default function PhotoManager({ productCode, images, imageKeys, onChange }: PhotoManagerProps) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<ProductPhoto[]>(() => toPhotos(images, imageKeys));
  const [busy, setBusy] = useState(false);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);

  // Re-sync when the page reloads the product
  const signature = `${(imageKeys ?? []).join(",")}|${images.join(",")}`;
  useEffect(() => {
    setPhotos(toPhotos(images, imageKeys));
    setConfirmKey(null);
  }, [signature]);

  function applyImages(map: Record<string, string>) {
    setPhotos(imagesMapToPhotos(map));
    setConfirmKey(null);
    onChange();
  }

  async function move(from: number, to: number) {
    if (to < 0 || to >= photos.length || busy) return;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);

    setBusy(true);
    const result = await reorderVariantImages(productCode, next.map((p) => p.key));
    setBusy(false);
    if (result.ok) {
      applyImages(result.data.images);
      if (to === 0) toast("Cover photo updated", "success");
    } else {
      toast(result.error);
    }
  }

  async function remove(key: string) {
    setBusy(true);
    const result = await deleteVariantImage(productCode, key);
    setBusy(false);
    if (result.ok) {
      applyImages(result.data.images);
      toast("Photo deleted", "success");
    } else {
      toast(result.error);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-gray-700">Photos</h3>
        <p className="text-xs text-neutral mt-0.5">
          The first photo is the cover. Photo changes save right away.
        </p>
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-neutral">No photos yet.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-3">
          {photos.map((photo, idx) => {
            const confirming = confirmKey === photo.key;
            return (
              <li key={photo.key} className="space-y-1.5">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-neutral/15 bg-white">
                  <Image
                    src={photo.url}
                    alt={`Photo ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                  {idx === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Cover
                    </span>
                  )}
                </div>

                {confirming ? (
                  <div className="flex items-center justify-between gap-1 text-xs">
                    <button
                      type="button"
                      className="rounded px-1.5 py-1 font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      onClick={() => remove(photo.key)}
                      disabled={busy}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="rounded px-1.5 py-1 text-neutral-dark hover:bg-neutral/10 disabled:opacity-50"
                      onClick={() => setConfirmKey(null)}
                      disabled={busy}
                    >
                      Keep
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      <IconButton
                        label={`Move photo ${idx + 1} earlier`}
                        disabled={busy || idx === 0}
                        onClick={() => move(idx, idx - 1)}
                        path="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                      <IconButton
                        label={`Move photo ${idx + 1} later`}
                        disabled={busy || idx === photos.length - 1}
                        onClick={() => move(idx, idx + 1)}
                        path="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                      {idx !== 0 && (
                        <IconButton
                          label={`Make photo ${idx + 1} the cover`}
                          disabled={busy}
                          onClick={() => move(idx, 0)}
                          path="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                        />
                      )}
                    </div>
                    <IconButton
                      label={`Delete photo ${idx + 1}`}
                      disabled={busy}
                      onClick={() => setConfirmKey(photo.key)}
                      path="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      danger
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ImageUpload productCode={productCode} onSuccess={applyImages} label="Add Photos" />
    </div>
  );
}

function toPhotos(images: string[], imageKeys?: string[]): ProductPhoto[] {
  return images
    .map((url, idx) => ({ key: imageKeys?.[idx] ?? "", url }))
    .filter((photo) => photo.key !== "" && photo.url !== "");
}

function IconButton({
  label,
  path,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  path: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded p-1 transition-colors disabled:pointer-events-none disabled:opacity-30",
        danger ? "text-red-600 hover:bg-red-50" : "text-neutral-dark hover:bg-neutral/10",
      )}
    >
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </button>
  );
}
