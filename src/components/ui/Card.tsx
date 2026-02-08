import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article";
}

export default function Card({ children, className, as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-neutral/15 bg-white shadow-sm overflow-hidden",
        "transition-shadow hover:shadow-md",
        className
      )}
    >
      {children}
    </Tag>
  );
}
