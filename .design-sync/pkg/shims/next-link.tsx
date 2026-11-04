// Stand-in for next/link outside Next.js: a plain anchor.
import * as React from "react";
type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string | { pathname?: string } };
const Link = React.forwardRef<HTMLAnchorElement, Props>(function Link({ href, children, ...rest }, ref) {
  const h = typeof href === "string" ? href : href.pathname ?? "#";
  return <a ref={ref} href={h} onClick={(e) => e.preventDefault()} {...rest}>{children}</a>;
});
export default Link;
