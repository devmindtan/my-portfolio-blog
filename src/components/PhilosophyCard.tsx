import { BookOpen } from "lucide-react";
import type { Principle } from "../data/portfolio.types";

interface PhilosophyCardProps {
  principles: Principle[];
}

export default function PhilosophyCard({ principles }: PhilosophyCardProps) {
  return (
    <div className="col-span-4 sm:col-span-2 card-base card-glow h-full flex flex-col">
      <div className="terminal-header">
        <BookOpen size={11} />
        <span>principles.config</span>
      </div>
      <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1 min-h-0">
        {principles.map((p, i) => (
          <div key={i} className="flex items-start gap-3 group">
            <span className="text-[10px] text-terminal-accent/50 font-mono mt-0.5 w-20 flex-shrink-0 uppercase tracking-wider">
              {p.label}
            </span>
            <span className="text-[11px] text-terminal-text/60 leading-relaxed group-hover:text-terminal-text/80 transition-colors">
              {p.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
