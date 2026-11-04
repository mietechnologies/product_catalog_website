// Stand-in for next/image outside Next.js: a plain img (supports the `fill` prop).
import * as React from "react";
type Props = React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; unoptimized?: boolean; quality?: number };
export default function Image({ fill, priority, unoptimized, quality, style, ...rest }: Props) {
  const s: React.CSSProperties = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : { ...style };
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img style={s} {...rest} />;
}
