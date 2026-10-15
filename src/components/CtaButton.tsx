import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

interface CtaButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  Icon?: LucideIcon;
  pulse?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function CtaButton({
  children,
  to,
  href,
  onClick,
  type = "button",
  Icon,
  pulse = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
}: CtaButtonProps) {
  const isDisabled = disabled || loading;

  const cls = [
    "group relative inline-flex items-center justify-center gap-2.5",
    "min-h-13 px-8 py-3.5 rounded-2xl",
    "bg-gradient-to-b from-fco-blue to-fco-blue-hover text-white",
    "text-fco-md font-bold tracking-tight no-underline whitespace-nowrap",
    "shadow-lg shadow-fco-blue/30",
    "transition-all duration-200 ease-out",
    "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fco-blue/40 hover:brightness-110",
    "active:translate-y-0 active:scale-98 active:shadow-md",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fco-blue/40",
    fullWidth ? "w-full" : "",
    isDisabled
      ? "opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-lg hover:brightness-100 active:scale-100 pointer-events-none"
      : "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {pulse && !isDisabled && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-fco-blue/40 animate-ping pointer-events-none"
          style={{ animationDuration: "2.2s" }}
        />
      )}
      {loading ? (
        <Loader2
          size={19}
          className="animate-spin shrink-0"
          aria-hidden="true"
        />
      ) : (
        Icon && (
          <Icon
            size={19}
            strokeWidth={2.2}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        )
      )}
      <span className="relative">{children}</span>
    </>
  );

  if (to && !isDisabled) {
    return (
      <Link to={to} className={cls} aria-busy={loading || undefined}>
        {content}
      </Link>
    );
  }

  if (href && !isDisabled) {
    return (
      <a href={href} className={cls} aria-busy={loading || undefined}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cls}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
