import { Cpu } from "lucide-react";
import type { TechItem } from "../data/portfolio.types";
import { categoryLabels, categoryOrder } from "../data/portfolio.en";

interface TechStackCardProps {
  techData: TechItem[];
}

export default function TechStackCard({ techData }: TechStackCardProps) {
  return (
    <div
      id="stack"
      className="col-span-4 sm:col-span-2 card-base card-glow h-full flex flex-col"
    >
      <div className="terminal-header">
        <Cpu size={11} />
        <span>stack.json</span>
      </div>
      <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1 min-h-0">
        {categoryOrder.map((cat) => {
          const items = techData.filter((t) => t.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat}>
              <span className="section-label text-terminal-info/60">
                {categoryLabels[cat] || cat}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {items.map((item) => (
                  <span
                    key={item.name}
                    className="px-2 py-0.5 text-[10px] bg-terminal-highlight border border-terminal-border/50
                               text-terminal-text/70 rounded-sm hover:border-terminal-accent/30
                               hover:text-terminal-accent transition-colors duration-200 cursor-default"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
