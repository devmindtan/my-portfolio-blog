import { Briefcase } from "lucide-react";
import { useMemo, useState } from "react";
import type { Profile } from "../data/portfolio";

interface ExperienceCardProps {
  experience: Profile["experience"];
  onProjectQuery?: (projectName: string) => void;
}

type SortMode = "newest" | "oldest";
type ExperienceType = "all" | "company" | "project";

function parsePeriodPoint(raw: string): number {
  const text = raw.trim().toLowerCase();
  if (["present", "current", "now"].includes(text)) {
    return Number.MAX_SAFE_INTEGER;
  }

  const monthYear = text.match(/^(\d{1,2})\/(\d{4})$/);
  if (monthYear) {
    const month = Number(monthYear[1]);
    const year = Number(monthYear[2]);
    return year * 12 + month;
  }

  const yearOnly = text.match(/^(\d{4})$/);
  if (yearOnly) {
    const year = Number(yearOnly[1]);
    return year * 12 + 12;
  }

  return -1;
}

function getPeriodEndValue(period: string): number {
  const parts = period
    .split("-")
    .map((p) => p.trim())
    .filter(Boolean);
  const end = parts.length > 1 ? parts[1] : parts[0] || "";
  return parsePeriodPoint(end);
}

export default function ExperienceCard({
  experience,
  onProjectQuery,
}: ExperienceCardProps) {
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [expType, setExpType] = useState<ExperienceType>("all");

  const filteredAndSorted = useMemo(() => {
    const filtered = experience.filter((item) => {
      const type: ExperienceType = item.company.trim() ? "company" : "project";
      return expType === "all" || expType === type;
    });

    const sorted = [...filtered].sort((a, b) => {
      const aEnd = getPeriodEndValue(a.period);
      const bEnd = getPeriodEndValue(b.period);
      return sortMode === "newest" ? bEnd - aEnd : aEnd - bEnd;
    });

    return sorted;
  }, [experience, expType, sortMode]);

  return (
    <div className="col-span-4 card-base card-glow ">
      <div className="terminal-header">
        <Briefcase size={11} />
        <span>experience.log</span>
        <span className="ml-auto text-[9px] text-terminal-muted/70">
          {filteredAndSorted.length}/{experience.length}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-3 ">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-1 rounded-sm border border-terminal-border/40 p-1">
            {(
              [
                { key: "all", label: "all" },
                { key: "company", label: "company" },
                { key: "project", label: "project" },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setExpType(item.key)}
                className={`px-2 py-1 text-[10px] uppercase tracking-wide rounded-sm transition-colors ${
                  expType === item.key
                    ? "bg-terminal-accent/15 text-terminal-accent"
                    : "text-terminal-muted hover:text-terminal-text"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <label className="sm:ml-auto inline-flex items-center gap-2 text-[10px] text-terminal-muted uppercase tracking-wide">
            sort
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="bg-terminal-highlight/30 border border-terminal-border/40 rounded-sm px-2 py-1 text-[10px] text-terminal-text outline-none focus:border-terminal-accent/40"
            >
              <option
                value="newest"
                className="bg-terminal-bg text-terminal-text"
              >
                newest first
              </option>
              <option
                value="oldest"
                className="bg-terminal-bg text-terminal-text"
              >
                oldest first
              </option>
            </select>
          </label>
        </div>

        <div className="max-h-[360px] overflow-y-auto pr-1 space-y-3 sm:space-y-4">
          {filteredAndSorted.map((item, i) => (
            <div
              key={`${item.role}-${item.period}-${i}`}
              className="border border-terminal-border/35 rounded-sm bg-terminal-highlight/15 p-3 sm:p-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <div className="text-[11px] text-terminal-text/85 font-semibold leading-snug">
                  {item.role}
                  {item.company ? (
                    <span className="text-terminal-muted/70 font-normal">
                      {" "}
                      at {item.company}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] text-terminal-accent/70 font-mono">
                  {item.period}
                </span>
              </div>
              <div className="mt-1">
                <span
                  className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                    item.company.trim()
                      ? "border-terminal-info/40 text-terminal-info/70"
                      : "border-terminal-accent/40 text-terminal-accent/70"
                  }`}
                >
                  {item.company.trim() ? "company" : "project"}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-terminal-text/65 mt-1.5 leading-relaxed">
                {item.description}
              </p>

              {item.links && item.links.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.links.map((link) => (
                    <a
                      key={`${item.role}-${link.href}`}
                      href={link.href}
                      target={link.projectName ? undefined : "_blank"}
                      rel={link.projectName ? undefined : "noopener noreferrer"}
                      onClick={(e) => {
                        if (!link.projectName) return;

                        e.preventDefault();

                        const projectSection =
                          document.getElementById("projects");
                        if (projectSection) {
                          projectSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }

                        if (link.projectName && onProjectQuery) {
                          onProjectQuery(link.projectName);
                        }
                      }}
                      className="text-[10px] px-2 py-1 rounded-sm border border-terminal-border/40 text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/40 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
