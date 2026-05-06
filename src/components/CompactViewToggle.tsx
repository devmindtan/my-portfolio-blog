import { Maximize2, Minimize2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface CompactViewToggleProps {
  compact: boolean;
  onToggle: () => void;
  mobile?: boolean;
}

export default function CompactViewToggle({
  compact,
  onToggle,
  mobile = false,
}: CompactViewToggleProps) {
  const { t } = useLanguage();
  const Icon = compact ? Maximize2 : Minimize2;
  const label = compact ? t("compact.expand") : t("compact.compact");

  if (mobile) {
    return (
      <button
        onClick={onToggle}
        className={`flex w-full items-start gap-1.5 py-1 text-left transition-all duration-200 ${
          compact
            ? "text-terminal-accent"
            : "text-terminal-muted hover:text-terminal-accent"
        }`}
        aria-pressed={compact}
        title={compact ? t("compact.expandTitle") : t("compact.compactTitle")}
      >
        <span
          className="mt-[1px] transition-transform duration-300 ease-in-out"
          style={{ transform: compact ? "scale(0.85)" : "scale(1)" }}
        >
          <Icon size={12} />
        </span>
        <span className="leading-tight">
          <span className="block text-[10px] uppercase tracking-wider">
            {label}
          </span>
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={`group relative flex items-center gap-1.5 px-2 py-1 border rounded-sm transition-all duration-200 normal-case text-left overflow-hidden ${
        compact
          ? "border-terminal-accent/50 text-terminal-accent bg-terminal-accent/5"
          : "border-terminal-border/40 text-terminal-muted hover:border-terminal-accent/40 hover:text-terminal-accent hover:bg-terminal-accent/5"
      }`}
      aria-pressed={compact}
      title={compact ? t("compact.expandTitle") : t("compact.compactTitle")}
    >
      {/* Animated icon swap */}
      <span className="relative w-[11px] h-[11px] mt-[2px] flex-shrink-0">
        {/* Minimize icon — visible when NOT compact */}
        <Minimize2
          size={11}
          className={`absolute inset-0 transition-all duration-200 ${
            compact
              ? "opacity-0 scale-75 rotate-45"
              : "opacity-100 scale-100 rotate-0"
          }`}
        />
        {/* Maximize icon — visible when compact */}
        <Maximize2
          size={11}
          className={`absolute inset-0 transition-all duration-200 ${
            compact
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-75 -rotate-45"
          }`}
        />
      </span>

      {/* Label */}
      <span className="leading-tight min-w-[36px]">
        <span className="block text-[10px] uppercase tracking-wider transition-all duration-200">
          {label}
        </span>
      </span>

      {/* Active indicator dot */}
      {compact && (
        <span className="absolute top-[3px] right-[3px] w-[4px] h-[4px] rounded-full bg-terminal-accent animate-pulse" />
      )}
    </button>
  );
}
