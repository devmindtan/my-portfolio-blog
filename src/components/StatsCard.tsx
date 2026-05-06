import { Activity } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import type { Stat } from "../data/portfolio.types";

interface StatsCardProps {
  stats: Stat[];
}

export default function StatsCard({ stats }: StatsCardProps) {
  const { t } = useLanguage();
  return (
    <div className="col-span-4 sm:col-span-2 card-base card-glow">
      <div className="terminal-header">
        <Activity size={11} />
        <span>{t("stats.title")}</span>
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
