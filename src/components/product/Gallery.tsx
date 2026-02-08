"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import type { CreatureType } from "@/lib/types";

interface GalleryProps {
  images: string[];
  name: string;
  creatureType: CreatureType;
}

export default function Gallery({ images, name, creatureType }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Track which image indices have failed to load
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());

  const markFailed = useCallback((idx: number) => {
    setFailedIndices((prev) => new Set(prev).add(idx));
  }, []);

  const hasRealImages = images.length > 0 && images[0] !== "";
  const count = hasRealImages ? images.length : 1;

  const activeImageOk = hasRealImages && !failedIndices.has(activeIndex);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-xl overflow-hidden border border-neutral/15 bg-white">
        {activeImageOk ? (
          <Image
            src={images[activeIndex]}
            alt={`${name} - image ${activeIndex + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => markFailed(activeIndex)}
          />
        ) : (
          <PlaceholderImage
            name={`${name} - image ${activeIndex + 1}`}
            creatureType={creatureType}
            className="w-full h-full"
            size="lg"
          />
        )}
        {/* Image counter */}
        {count > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white font-medium">
            {activeIndex + 1} / {count}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="flex gap-2" role="tablist" aria-label="Image gallery">
          {Array.from({ length: count }).map((_, idx) => {
            const thumbOk = hasRealImages && !failedIndices.has(idx);
            return (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`View image ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                  idx === activeIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-neutral/20 hover:border-neutral/50"
                )}
              >
                {thumbOk ? (
                  <Image
                    src={images[idx]}
                    alt={`${name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    onError={() => markFailed(idx)}
                  />
                ) : (
                  <PlaceholderImage
                    name={`${name} thumbnail ${idx + 1}`}
                    creatureType={creatureType}
                    className="w-full h-full"
                    size="sm"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
