import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "promotional";
}

export default function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-3 py-1 text-xs font-sans uppercase tracking-wider";

  const variants = {
    default: "bg-evol-light-grey text-evol-dark-grey",
    promotional: "bg-evol-red text-white",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
