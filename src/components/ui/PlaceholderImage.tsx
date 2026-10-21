"use client";

import { cn } from "@/lib/utils";
import type { CreatureType, PrintCategory } from "@/lib/types";

type PlaceholderCategory = CreatureType | PrintCategory;

/** SVG icon paths for each creature type and print category */
const categoryIcons: Record<PlaceholderCategory, string> = {
  Dragon:
    "M12 2C8 2 4 6 4 10c0 2 1 4 3 5l-1 5h2l1-3 3 3 3-3 1 3h2l-1-5c2-1 3-3 3-5 0-4-4-8-8-8zm-2 8a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z",
  Undead:
    "M12 2a8 8 0 00-8 8c0 3 2 5.5 4 7v3h8v-3c2-1.5 4-4 4-7a8 8 0 00-8-8zm-2 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z",
  Beast:
    "M12 3C8 3 5 6 5 9c0 1.5.5 3 1.5 4L5 18h3l1-2h6l1 2h3l-1.5-5c1-1 1.5-2.5 1.5-4 0-3-3-6-7-6zm-3 7a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z",
  Humanoid:
    "M12 4a3 3 0 100 6 3 3 0 000-6zm-4 8c-2 0-4 1-4 3v3h16v-3c0-2-2-3-4-3h-8z",
  Elemental:
    "M12 2c-1 0-2 1-3 3-1 3-2 5-2 8 0 3 2 6 5 6s5-3 5-6c0-3-1-5-2-8-1-2-2-3-3-3zm-1 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-2a1 1 0 110-2 1 1 0 010 2z",
  Aberration:
    "M12 2C7 2 3 6 3 11s4 9 9 9 9-4 9-9-4-9-9-9zm0 3a6 6 0 110 12 6 6 0 010-12zm0 2a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z",
  Construct:
    "M8 2v4H4v12h16V6h-4V2H8zm2 2h4v2h-4V4zm-2 6h8v2h-8v-2zm0 4h6v2h-6v-2z",
  Fiend:
    "M12 2L8 6v2L4 10v4l4 2v2l4 4 4-4v-2l4-2v-4l-4-2V6l-4-4zm-2 8a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z",
  Celestial:
    "M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z",
  Fey:
    "M12 2C9 2 7 4 7 7c0 1.5.5 3 1.5 4-2 1-3.5 3-3.5 5.5 0 .8.7 1.5 1.5 1.5h11c.8 0 1.5-.7 1.5-1.5 0-2.5-1.5-4.5-3.5-5.5 1-1 1.5-2.5 1.5-4 0-3-2-5-5-5z",
  Giant:
    "M12 2c-2 0-3.5 1.5-3.5 3.5S10 9 12 9s3.5-1.5 3.5-3.5S14 2 12 2zM8 10c-1.5 0-3 1-3 2.5V18l2 4h2l1-4h4l1 4h2l2-4v-5.5c0-1.5-1.5-2.5-3-2.5H8z",
  Monstrosity:
    "M12 2C8 2 5 5 5 9c0 2.5 1.5 4.5 3 6l-2 5h3l1-2.5c.6.3 1.3.5 2 .5s1.4-.2 2-.5l1 2.5h3l-2-5c1.5-1.5 3-3.5 3-6 0-4-3-7-7-7zm-3 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z",
  Ooze:
    "M12 4c-4 0-7 2-8 5-.5 1.5 0 3 1 4 .5 2 2 3.5 3.5 4.5 1 .5 2.2.5 3.5.5s2.5 0 3.5-.5c1.5-1 3-2.5 3.5-4.5 1-1 1.5-2.5 1-4-1-3-4-5-8-5z",
  Plant:
    "M12 2c-1 0-2 .5-2 1.5v3C8 7 6 8.5 6 11c0 1.5.5 3 1.5 4-.5 1.5-.5 3.5 0 5h9c.5-1.5.5-3.5 0-5 1-1 1.5-2.5 1.5-4 0-2.5-2-4-4-4.5v-3C14 2.5 13 2 12 2z",
  // Print categories
  Decor:
    "M12 3c-.6 0-1 .4-1 1v1.1C7 5.6 4 8.6 4 12.5 4 17 7.6 21 12 21s8-4 8-8.5c0-3.9-3-6.9-7-7.4V4c0-.6-.4-1-1-1zm-3 8l1.5 2h-3L9 11zm6 0l1.5 2h-3L15 11zm-6 5h6l-1 1.5h-4L9 16z",
  Toy:
    "M12 3l-2 3H6l1 4-3 2 3 2-1 4h4l2 3 2-3h4l-1-4 3-2-3-2 1-4h-4l-2-3zm0 6a3 3 0 110 6 3 3 0 010-6z",
  Figurine:
    "M12 2a3 3 0 100 6 3 3 0 000-6zm-3 7c-1 0-2 1-2 2v4h2v4H7v3h10v-3h-2v-4h2v-4c0-1-1-2-2-2H9z",
  Accessory:
    "M4 7l8-4 8 4v10l-8 4-8-4V7zm8-1.8L6.5 8 12 10.8 17.5 8 12 5.2z",
  Other:
    "M4 7l8-4 8 4v10l-8 4-8-4V7zm2 1.6v7.2l5 2.5v-7.2l-5-2.5zm12 0l-5 2.5v7.2l5-2.5V8.6z",
};

const bgColors: Record<PlaceholderCategory, string> = {
  Dragon: "bg-red-50",
  Undead: "bg-green-50",
  Beast: "bg-amber-50",
  Humanoid: "bg-blue-50",
  Elemental: "bg-orange-50",
  Aberration: "bg-purple-50",
  Construct: "bg-gray-100",
  Fiend: "bg-rose-50",
  Celestial: "bg-yellow-50",
  Fey: "bg-emerald-50",
  Giant: "bg-stone-100",
  Monstrosity: "bg-red-50",
  Ooze: "bg-lime-50",
  Plant: "bg-green-50",
  Decor: "bg-orange-50",
  Toy: "bg-sky-50",
  Figurine: "bg-violet-50",
  Accessory: "bg-slate-100",
  Other: "bg-gray-50",
};

const iconColors: Record<PlaceholderCategory, string> = {
  Dragon: "text-red-400",
  Undead: "text-green-500",
  Beast: "text-amber-500",
  Humanoid: "text-blue-400",
  Elemental: "text-orange-400",
  Aberration: "text-purple-400",
  Construct: "text-gray-400",
  Fiend: "text-rose-400",
  Celestial: "text-yellow-500",
  Fey: "text-emerald-500",
  Giant: "text-stone-500",
  Monstrosity: "text-red-500",
  Ooze: "text-lime-500",
  Plant: "text-green-500",
  Decor: "text-orange-500",
  Toy: "text-sky-500",
  Figurine: "text-violet-500",
  Accessory: "text-slate-500",
  Other: "text-gray-400",
};

interface PlaceholderImageProps {
  name: string;
  /** Creature type for miniatures, print category for prints */
  category: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function PlaceholderImage({
  name,
  category,
  className,
  size = "md",
}: PlaceholderImageProps) {
  const iconSize = size === "sm" ? 32 : size === "lg" ? 64 : 48;
  const key = category as PlaceholderCategory;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        bgColors[key] ?? "bg-gray-50",
        className
      )}
      role="img"
      aria-label={`${name} placeholder image`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn(iconColors[key] ?? "text-gray-400", "opacity-60")}
        aria-hidden="true"
      >
        <path d={categoryIcons[key] ?? categoryIcons.Other} />
      </svg>
      {size !== "sm" && (
        <span className={cn("text-xs font-medium opacity-50", iconColors[key] ?? "text-gray-400")}>
          {category}
        </span>
      )}
    </div>
  );
}
