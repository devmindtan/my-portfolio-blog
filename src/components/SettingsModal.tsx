import {
  X,
  Languages,
  PanelTopClose,
  FileText,
  SlidersHorizontal,
  Database,
} from "lucide-react";

interface SettingsModalProps {
  lang: "en" | "vi";
  onToggleLanguage: () => void;
  compactView: boolean;
  onToggleCompact: () => void;
  onExportCV: () => void;
  onOpenAdmin: () => void;
  onOpenDataViewer: () => void;
  onClose: () => void;
  t: (key: string) => string;
}

export default function SettingsModal({
  lang,
  onToggleLanguage,
  compactView,
  onToggleCompact,
  onExportCV,
  onOpenAdmin,
  onOpenDataViewer,
  onClose,
  t,
}: SettingsModalProps) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-terminal-bg/80 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md card-base rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="terminal-header">
          <div className="terminal-dot bg-terminal-error/80" />
          <div className="terminal-dot bg-terminal-warning/80" />
          <div className="terminal-dot bg-terminal-accent/80" />
          <span className="ml-2">{t("settings.title")}</span>
          <button
            onClick={onClose}
            className="ml-auto text-terminal-muted hover:text-terminal-accent transition-colors"
            aria-label={t("settings.close")}
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={onToggleLanguage}
            className="w-full flex items-center justify-between px-3 py-2 border border-terminal-border/40 rounded-sm text-xs text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/40 transition-colors"
          >
            <span className="inline-flex items-center gap-2 uppercase tracking-wider">
              <Languages size={13} />
              {t("nav.language")}
            </span>
            <span className="mono-value">{lang === "en" ? "EN" : "VI"}</span>
          </button>

          <button
            onClick={onToggleCompact}
            className="w-full flex items-center justify-between px-3 py-2 border border-terminal-border/40 rounded-sm text-xs text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/40 transition-colors"
          >
            <span className="inline-flex items-center gap-2 uppercase tracking-wider">
              <PanelTopClose size={13} />
              {compactView ? t("compact.expand") : t("compact.compact")}
            </span>
          </button>

          <button
            onClick={onExportCV}
            className="w-full flex items-center justify-between px-3 py-2 border border-terminal-border/40 rounded-sm text-xs text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/40 transition-colors"
          >
            <span className="inline-flex items-center gap-2 uppercase tracking-wider">
              <FileText size={13} />
              {t("nav.exportCv")}
            </span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="w-full flex items-center justify-between px-3 py-2 border border-terminal-border/40 rounded-sm text-xs text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/40 transition-colors"
          >
            <span className="inline-flex items-center gap-2 uppercase tracking-wider">
              <SlidersHorizontal size={13} />
              Admin
            </span>
          </button>

          <button
            onClick={onOpenDataViewer}
            className="w-full flex items-center justify-between px-3 py-2 border border-terminal-border/40 rounded-sm text-xs text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/40 transition-colors"
          >
            <span className="inline-flex items-center gap-2 uppercase tracking-wider">
              <Database size={13} />
              Data Viewer
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
