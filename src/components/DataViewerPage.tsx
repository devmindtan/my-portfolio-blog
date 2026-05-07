import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  Database,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { portfolioDataEn } from "../data/portfolio.en";
import { portfolioDataVi } from "../data/portfolio.vi";

type EntityKey =
  | "projects"
  | "certificates"
  | "techStack"
  | "stats"
  | "profile";
type LangView = "en" | "vi" | "both";

const ENTITY_LABELS: Record<EntityKey, string> = {
  projects: "Projects",
  certificates: "Certificates",
  techStack: "Tech Stack",
  stats: "Stats",
  profile: "Profile",
};

// ── Syntax highlighter ────────────────────────────────────────────────────────
function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          // key
          return `<span style="color:#00e5a0">${match}</span>`;
        }
        // string value
        return `<span style="color:#7ee787">${match}</span>`;
      }
      if (/true|false/.test(match)) {
        return `<span style="color:#f0c040">${match}</span>`;
      }
      if (/null/.test(match)) {
        return `<span style="color:#ff4466">${match}</span>`;
      }
      // number
      return `<span style="color:#40aaff">${match}</span>`;
    },
  );
}

// ── Copy button ────────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider rounded-sm border border-terminal-border/40 text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/30 transition-colors"
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── Collapsible JSON block ─────────────────────────────────────────────────────
function JsonBlock({
  label,
  data,
  defaultOpen = true,
}: {
  label: string;
  data: unknown;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const jsonStr = JSON.stringify(data, null, 2);
  const highlighted = syntaxHighlight(jsonStr);

  return (
    <div className="border border-terminal-border/30 rounded-sm overflow-hidden mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-terminal-surface/60 hover:bg-terminal-surface text-left transition-colors"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown size={13} className="text-terminal-muted" />
          ) : (
            <ChevronRight size={13} className="text-terminal-muted" />
          )}
          <span className="text-xs font-mono text-terminal-accent">
            {label}
          </span>
          {Array.isArray(data) && (
            <span className="text-[10px] text-terminal-muted">
              [{data.length}]
            </span>
          )}
        </div>
        <CopyButton text={jsonStr} />
      </button>
      {open && (
        <div className="overflow-x-auto bg-terminal-bg/60 p-4">
          <pre
            className="text-[11px] font-mono leading-relaxed text-terminal-text whitespace-pre"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}
    </div>
  );
}

// ── Side-by-side panel ─────────────────────────────────────────────────────────
function SideBySideBlock({
  label,
  dataEn,
  dataVi,
}: {
  label: string;
  dataEn: unknown;
  dataVi: unknown;
}) {
  const [open, setOpen] = useState(true);
  const jsonEn = JSON.stringify(dataEn, null, 2);
  const jsonVi = JSON.stringify(dataVi, null, 2);

  return (
    <div className="border border-terminal-border/30 rounded-sm overflow-hidden mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-terminal-surface/60 hover:bg-terminal-surface text-left transition-colors"
      >
        {open ? (
          <ChevronDown size={13} className="text-terminal-muted" />
        ) : (
          <ChevronRight size={13} className="text-terminal-muted" />
        )}
        <span className="text-xs font-mono text-terminal-accent">{label}</span>
        {Array.isArray(dataEn) && (
          <span className="text-[10px] text-terminal-muted">
            [{(dataEn as unknown[]).length}]
          </span>
        )}
      </button>
      {open && (
        <div className="grid grid-cols-2 divide-x divide-terminal-border/30">
          <div className="overflow-x-auto bg-terminal-bg/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-terminal-muted font-mono">
                EN
              </span>
              <CopyButton text={jsonEn} />
            </div>
            <pre
              className="text-[11px] font-mono leading-relaxed text-terminal-text whitespace-pre"
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonEn) }}
            />
          </div>
          <div className="overflow-x-auto bg-terminal-bg/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-terminal-muted font-mono">
                VI
              </span>
              <CopyButton text={jsonVi} />
            </div>
            <pre
              className="text-[11px] font-mono leading-relaxed text-terminal-text whitespace-pre"
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonVi) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DataViewerPage({ onBack }: { onBack: () => void }) {
  const [activeEntities, setActiveEntities] = useState<Set<EntityKey>>(
    new Set(["projects", "certificates", "techStack", "stats", "profile"]),
  );
  const [langView, setLangView] = useState<LangView>("both");

  const toggleEntity = (k: EntityKey) => {
    setActiveEntities((prev) => {
      const next = new Set(prev);
      if (next.has(k)) {
        if (next.size > 1) next.delete(k);
      } else {
        next.add(k);
      }
      return next;
    });
  };

  const enData = useMemo(
    () => ({
      projects: portfolioDataEn.projects,
      certificates: portfolioDataEn.certificates,
      techStack: portfolioDataEn.techStack,
      stats: portfolioDataEn.stats,
      profile: portfolioDataEn.profile,
    }),
    [],
  );

  const viData = useMemo(
    () => ({
      projects: portfolioDataVi.projects,
      certificates: portfolioDataVi.certificates,
      techStack: portfolioDataVi.techStack,
      stats: portfolioDataVi.stats,
      profile: portfolioDataVi.profile,
    }),
    [],
  );

  const allJsonEn = JSON.stringify(enData, null, 2);
  const allJsonVi = JSON.stringify(viData, null, 2);

  const entities: EntityKey[] = [
    "projects",
    "certificates",
    "techStack",
    "stats",
    "profile",
  ];

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      {/* Header */}
      <header className="border-b border-terminal-border/40 bg-terminal-surface/50 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-terminal-muted hover:text-terminal-accent transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Database size={14} className="text-terminal-accent" />
          <span className="text-xs font-mono uppercase tracking-widest text-terminal-accent">
            Data Viewer
          </span>
        </div>
        <div className="flex items-center gap-1 bg-terminal-card rounded-sm border border-terminal-border/40 p-0.5">
          {(["en", "vi", "both"] as LangView[]).map((l) => (
            <button
              key={l}
              onClick={() => setLangView(l)}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-sm transition-colors ${
                langView === l
                  ? "bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/30"
                  : "text-terminal-muted hover:text-terminal-text"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Entity filter */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-terminal-muted mr-1">
            Show:
          </span>
          {entities.map((key) => (
            <button
              key={key}
              onClick={() => toggleEntity(key)}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-sm border transition-colors ${
                activeEntities.has(key)
                  ? "bg-terminal-accent/15 border-terminal-accent/40 text-terminal-accent"
                  : "border-terminal-border/40 text-terminal-muted hover:text-terminal-text"
              }`}
            >
              {ENTITY_LABELS[key]}
            </button>
          ))}
          <div className="ml-auto">
            <CopyButton text={langView === "vi" ? allJsonVi : allJsonEn} />
          </div>
        </div>

        {/* Content */}
        {entities
          .filter((k) => activeEntities.has(k))
          .map((key) => {
            if (langView === "both") {
              return (
                <SideBySideBlock
                  key={key}
                  label={ENTITY_LABELS[key]}
                  dataEn={enData[key]}
                  dataVi={viData[key]}
                />
              );
            }
            const data = langView === "en" ? enData[key] : viData[key];
            return (
              <JsonBlock
                key={key}
                label={`${ENTITY_LABELS[key]} · ${langView.toUpperCase()}`}
                data={data}
              />
            );
          })}
      </div>
    </div>
  );
}
