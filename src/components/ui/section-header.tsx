import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  headingLevel?: HeadingLevel;
}

export function SectionHeader({
  className,
  eyebrow,
  title,
  description,
  headingLevel = "h2",
  ...props
}: SectionHeaderProps) {
  const Heading = headingLevel as ElementType;

  return (
    <div className={cn("max-w-3xl", className)} {...props}>
      {eyebrow ? (
        <p className="mb-3 text-caption font-semibold uppercase tracking-caps text-primary">{eyebrow}</p>
      ) : null}
      <Heading className="text-h2 font-bold tracking-tight text-foreground">{title}</Heading>
      {description ? <p className="mt-4 max-w-2xl text-body text-muted-foreground">{description}</p> : null}
    </div>
  );
}
