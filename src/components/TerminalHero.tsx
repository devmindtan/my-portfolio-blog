import { useEffect, useState } from "react";
import { Terminal, ChevronDown } from "lucide-react";
import { heroLines } from "../data/portfolio.en";
import { useLanguage } from "../contexts/LanguageContext";
import type { HeroLine } from "../data/portfolio.types";

interface TerminalHeroProps {
  lines?: HeroLine[];
}

export default function TerminalHero({ lines = heroLines }: TerminalHeroProps) {
  const { t } = useLanguage();
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), (i + 1) * 800));
    });
    timers.push(
      setTimeout(() => setShowCursor(false), lines.length * 800 + 600),
    );
    return () => timers.forEach(clearTimeout);
  }, [lines]);

  return (
    <div className="col-span-4 card-base card-glow overflow-hidden">
      <div className="terminal-header">
        <div className="terminal-dot bg-terminal-error/80" />
        <div className="terminal-dot bg-terminal-warning/80" />
        <div className="terminal-dot bg-terminal-accent/80" />
        <span className="ml-2 flex items-center gap-1.5">
          <Terminal size={11} />
          portfolio@devmindtan:~
        </span>
        <span className="ml-auto text-terminal-muted/50">zsh</span>
      </div>

      <div className="p-4 sm:p-6 space-y-4 min-h-[160px] sm:min-h-[220px]">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="text-terminal-accent font-semibold">❯</span>
              <span className="text-terminal-muted">{line.prompt}</span>
              <span className="text-terminal-text">{line.cmd}</span>
            </div>
            <div className="text-xs text-terminal-text/70 ml-5 mt-0.5 font-light">
              {line.output}
            </div>
          </div>
        ))}

        {showCursor && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-terminal-accent font-semibold">❯</span>
            <span className="text-terminal-muted">~</span>
            <span className="w-2 h-4 bg-terminal-accent/80 animate-cursor" />
          </div>
        )}

        {!showCursor && (
          <div
            className="opacity-0 animate-fade-in pt-2"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-terminal-border/40" />
              <span className="text-[10px] text-terminal-muted/50 uppercase tracking-[0.15em] sm:tracking-[0.25em]">
                {t("hero.scrollToExplore")}
              </span>
              <ChevronDown
                size={12}
                className="text-terminal-muted/40 animate-bounce"
              />
              <div className="h-px flex-1 bg-terminal-border/40" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
