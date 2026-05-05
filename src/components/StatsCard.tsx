import { Activity } from "lucide-react";
import type { Stat } from "../data/portfolio";

interface StatsCardProps {
  stats: Stat[];
}

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="col-span-4 sm:col-span-2 card-base card-glow">
      <div className="terminal-header">
        <Activity size={11} />
        <span>metrics</span>
      </div>
      <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="opacity-0 animate-slide-up"
            style={{ animationDelay: `${0.3 + i * 0.08}s` }}
          >
            <span className="mono-value text-lg sm:text-xl text-terminal-accent text-shadow-glow">
              {stat.value}
            </span>
            <div className="text-[9px] sm:text-[10px] text-terminal-muted mt-0.5 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
