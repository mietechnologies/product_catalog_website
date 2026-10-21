import { cn, isHttpUrl } from "@/lib/utils";
import type { Attribution } from "@/lib/types";

interface AttributionCreditProps {
  attribution?: Attribution | null;
  className?: string;
}

/** "Model by {creator}" credit linking to the original 3D model. Renders nothing for in-house models. */
export default function AttributionCredit({ attribution, className }: AttributionCreditProps) {
  const creator = attribution?.creator?.trim();
  const modelUrl = attribution?.modelUrl?.trim();
  const href = modelUrl && isHttpUrl(modelUrl) ? modelUrl : undefined;

  if (!creator && !href) return null;

  const label = creator ?? "original creator";

  return (
    <p className={cn("text-sm text-neutral", className)}>
      3D model by{" "}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="font-medium text-primary hover:text-primary-light transition-colors underline-offset-2 hover:underline"
        >
          {label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <span className="font-medium text-gray-900">{label}</span>
      )}
    </p>
  );
}
