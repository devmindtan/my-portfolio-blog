import { useEffect, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import type { Project } from "../data/portfolio.types";
import { X, FolderGit2, ExternalLink } from "lucide-react";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  const { t } = useLanguage();
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (project) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, handleKeyDown]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-terminal-bg/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto card-base rounded-t-sm sm:rounded-sm animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="terminal-header sticky top-0 bg-terminal-card z-10">
          <div className="terminal-dot bg-terminal-error/80" />
          <div className="terminal-dot bg-terminal-warning/80" />
          <div className="terminal-dot bg-terminal-accent/80" />
          <span className="ml-2 flex items-center gap-1.5">
            <FolderGit2 size={11} />
            {project.tag}/{project.id.slice(0, 8)}
          </span>
          <button
            onClick={onClose}
            className="ml-auto text-terminal-muted hover:text-terminal-accent transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Title + Tag */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider border border-terminal-accent/30 text-terminal-accent bg-terminal-accent/5 rounded-sm">
                {project.tag}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-terminal-text leading-tight">
              {project.title}
            </h2>
          </div>

          {/* Problem */}
          <div>
            <span className="text-[12px] section-label text-terminal-error/70">
              {t("project.problem")}
            </span>
            <p className="text-xs text-terminal-text/80 mt-1.5 leading-relaxed">
              {project.problem}
            </p>
          </div>

          {/* Actions */}
          <div>
            <span className="text-[12px] section-label text-terminal-info/70">
              {t("project.action")}
            </span>
            <ul className="mt-1.5 space-y-1.5">
              {project.actions.map((action, i) => (
                <li
                  key={i}
                  className="text-xs text-terminal-text/70 flex items-start gap-2"
                >
                  <span className="text-terminal-accent/60 mt-0.5 flex-shrink-0">
                    {">"}
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div>
            <span className="text-[12px] section-label text-terminal-accent/70">
              {t("project.result")}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
              {project.results.map((result, i) => (
                <div
                  key={i}
                  className="p-3 bg-terminal-highlight border border-terminal-border/30 rounded-sm"
                >
                  <span className="mono-value text-lg text-terminal-accent text-shadow-glow block">
                    {result.value}
                  </span>
                  <span className="text-[10px] text-terminal-muted uppercase tracking-wider">
                    {result.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <span className="text-[12px] section-label text-terminal-info/70">
              {t("project.techStack")}
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-[10px] bg-terminal-highlight border border-terminal-border/50
                             text-terminal-text/70 rounded-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Insight */}
          <div className="pt-4 border-t border-terminal-border/30">
            <p className="text-xs text-terminal-muted/80 italic leading-relaxed">
              <span className="text-terminal-warning/60 not-italic mr-1">
                //
              </span>
              {project.insight}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-terminal-border/20 text-[10px] text-terminal-muted/40">
            <span>id: {project.id.slice(0, 8)}</span>
            <span className="flex items-center gap-1">
              <ExternalLink size={9} />
              {t("project.clickToClose")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
