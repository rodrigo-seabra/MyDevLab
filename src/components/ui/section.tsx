import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SectionSpacing = "sm" | "md" | "lg";

const spacingClasses: Record<SectionSpacing, string> = {
  sm: "py-8",
  md: "py-section",
  lg: "py-16 md:py-24",
};

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: SectionSpacing;
}

export function Section({ className, spacing = "md", ...props }: SectionProps) {
  return <section className={cn(spacingClasses[spacing], className)} {...props} />;
}
