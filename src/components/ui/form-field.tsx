import { Children, cloneElement, useId, type ReactElement, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

export interface FormFieldProps {
  label: ReactNode;
  children: ReactElement;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  className?: string;
}

export function FormField({ label, children, hint, error, id, className }: FormFieldProps) {
  const generatedId = useId();
  const control = Children.only(children) as ReactElement<Record<string, unknown>>;
  const existingId = typeof control.props.id === "string" ? control.props.id : undefined;
  const controlId = id ?? existingId ?? `field-${generatedId}`;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  const enhancedControl = cloneElement(control, {
    id: controlId,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : control.props["aria-invalid"],
  });

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={controlId}>{label}</Label>
      {enhancedControl}
      {hint ? <p className="text-small text-muted-foreground" id={hintId}>{hint}</p> : null}
      {error ? <p className="text-small text-error" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}
