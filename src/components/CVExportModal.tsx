import { useState, useCallback, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useLanguage } from "../contexts/LanguageContext";
import {
  X,
  FileText,
  Download,
  Eye,
  Palette,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import type {
  Profile,
  Project,
  Certificate,
  TechItem,
} from "../data/portfolio.types";

interface CVExportModalProps {
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  techStack?: TechItem[];
  onClose: () => void;
}

type TemplateKey = "minimal" | "modern" | "executive";

export default function CVExportModal({
  profile,
  projects,
  certificates,
  techStack,
  onClose,
}: CVExportModalProps) {
  const { t } = useLanguage();

  const templates: { key: TemplateKey; label: string; desc: string }[] = [
    {
      key: "minimal",
      label: t("cvExport.tplMinimalLabel"),
      desc: t("cvExport.tplMinimalDesc"),
    },
    {
      key: "modern",
      label: t("cvExport.tplModernLabel"),
      desc: t("cvExport.tplModernDesc"),
    },
    {
      key: "executive",
      label: t("cvExport.tplExecutiveLabel"),
      desc: t("cvExport.tplExecutiveDesc"),
    },
  ];

  const getAllActionIndexes = (project: Project) =>
    project.actions.map((_, index) => index);

  const getDefaultProjectIds = () =>
    new Set(projects.slice(0, 10).map((p) => p.id));

  const getDefaultProjectActionIndexes = () =>
    Object.fromEntries(
      projects
        .slice(0, 10)
        .map((project) => [project.id, getAllActionIndexes(project)]),
    ) as Record<string, number[]>;

  const [selected, setSelected] = useState<TemplateKey>("minimal");
  const [showProjectPicker, setShowProjectPicker] = useState(true);
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(
    () => getDefaultProjectIds(),
  );
  const [selectedProjectActionIndexes, setSelectedProjectActionIndexes] =
    useState<Record<string, number[]>>(() => getDefaultProjectActionIndexes());
  const [projectSearch, setProjectSearch] = useState("");
  const [projectTagFilter, setProjectTagFilter] = useState<string>("all");

  // Which project's actions are shown in the right panel (wide layout)
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const docTitle = () => `CV_${profile.name.replace(/\s+/g, "_")}_${selected}`;

  const basePageStyle = `
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    [data-cv-item] { break-inside: avoid; page-break-inside: avoid; }
    html { margin: 0; background: #fff !important; }
  `;

  const printA4 = useReactToPrint({
    contentRef: printRef,
    documentTitle: docTitle,
    pageStyle: `@page { size: A4 portrait; margin: 20mm 15mm; } ${basePageStyle}`,
  });

  const handlePreview = () => {
    if (!contentRef.current) return;
    const content = contentRef.current.outerHTML;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(`<!DOCTYPE html><html>
<head>
  <meta charset="utf-8">
  <title>CV Preview — ${profile.name}</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; background: #e8e8e8; }
    .preview-stage { max-width: 980px; margin: 20px auto; padding: 10px; }
    .cv-wrap { max-width: 880px; margin: 0 auto; background: #fff;
               box-shadow: 0 4px 24px rgba(0,0,0,0.18); }
  </style>
</head>
<body><div class="preview-stage"><div class="cv-wrap">${content}</div></div></body>
</html>`);
    win.document.close();
  };

  const handleDownloadPDF = () => printA4();

  const allTags = Array.from(new Set(projects.map((p) => p.tag))).sort();

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      projectSearch.trim() === "" ||
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.tag.toLowerCase().includes(projectSearch.toLowerCase());
    const matchTag = projectTagFilter === "all" || p.tag === projectTagFilter;
    return matchSearch && matchTag;
  });

  const toggleProject = useCallback(
    (id: string) => {
      setSelectedProjectIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          // Clear focus if this project was focused
          setFocusedProjectId((f) => (f === id ? null : f));
        } else if (next.size < 10) {
          next.add(id);
          // Auto-focus newly added project to show its actions
          setFocusedProjectId(id);
        }
        return next;
      });
      setSelectedProjectActionIndexes((prev) => {
        const project = projects.find((item) => item.id === id);
        if (!project) return prev;
        if (id in prev) {
          const next = { ...prev };
          delete next[id];
          return next;
        }
        return { ...prev, [id]: getAllActionIndexes(project) };
      });
    },
    [projects],
  );

  const toggleProjectAction = useCallback(
    (projectId: string, actionIndex: number) => {
      setSelectedProjectActionIndexes((prev) => {
        const current = prev[projectId] ?? [];
        const exists = current.includes(actionIndex);
        return {
          ...prev,
          [projectId]: exists
            ? current.filter((index) => index !== actionIndex)
            : [...current, actionIndex].sort((a, b) => a - b),
        };
      });
    },
    [],
  );

  const selectedProjects = projects
    .filter((p) => selectedProjectIds.has(p.id))
    .map((project) => ({
      ...project,
      actions: project.actions.filter((_, index) =>
        (selectedProjectActionIndexes[project.id] ?? []).includes(index),
      ),
    }));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const focusedProject = projects.find((p) => p.id === focusedProjectId);

  // Shared search + tag filter bar
  const SearchBar = (
    <div className="p-2 border-b border-terminal-border/20 space-y-1.5">
      <div className="flex items-center gap-1.5 bg-terminal-bg/60 border border-terminal-border/30 rounded-sm px-2 py-1">
        <Search size={9} className="text-terminal-muted flex-shrink-0" />
        <input
          type="text"
          placeholder={t("cvExport.searchPlaceholder")}
          value={projectSearch}
          onChange={(e) => setProjectSearch(e.target.value)}
          className="flex-1 bg-transparent text-[10px] text-terminal-text placeholder:text-terminal-muted/50 outline-none"
        />
        {projectSearch && (
          <button
            onClick={() => setProjectSearch("")}
            className="text-terminal-muted hover:text-terminal-error transition-colors text-[9px]"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {["all", ...allTags].map((tag) => (
          <button
            key={tag}
            onClick={() => setProjectTagFilter(tag)}
            className={`px-2 py-0.5 text-[8px] rounded-sm border transition-all ${
              projectTagFilter === tag
                ? "border-terminal-accent/50 bg-terminal-accent/10 text-terminal-accent"
                : "border-terminal-border/30 text-terminal-muted hover:text-terminal-text"
            }`}
          >
            {tag === "all" ? t("cvExport.searchTagAll") : tag}
          </button>
        ))}
      </div>
    </div>
  );

  // Project list rows (shared between narrow/wide)
  const ProjectRows = (
    <div className="overflow-y-auto max-h-44 sm:max-h-full sm:flex-1">
      {filteredProjects.length === 0 && (
        <div className="px-3 py-3 text-[10px] text-terminal-muted text-center">
          {t("cvExport.noResults")}
        </div>
      )}
      {filteredProjects.map((proj) => {
        const checked = selectedProjectIds.has(proj.id);
        const atMax = selectedProjectIds.size >= 10 && !checked;
        const isFocused = focusedProjectId === proj.id;

        return (
          <div
            key={proj.id}
            className={`border-b border-terminal-border/20 last:border-0 ${
              checked
                ? isFocused
                  ? "bg-terminal-accent/10"
                  : "bg-terminal-accent/5"
                : atMax
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-terminal-surface/30"
            }`}
          >
            {/* Row — checkbox + title + tag + focus trigger */}
            <div className="flex items-center gap-2 px-3 py-2">
              {/* Checkbox */}
              <button
                disabled={atMax}
                onClick={() => toggleProject(proj.id)}
                className="flex-shrink-0"
              >
                <div
                  className={`w-3.5 h-3.5 border rounded-[2px] flex items-center justify-center transition-colors ${
                    checked
                      ? "border-terminal-accent bg-terminal-accent/20"
                      : "border-terminal-border/50"
                  }`}
                >
                  {checked && (
                    <Check size={8} className="text-terminal-accent" />
                  )}
                </div>
              </button>

              {/* Title — clicking focuses on wide layout, toggles expand on narrow */}
              <button
                className={`flex-1 text-left text-[10px] truncate transition-colors ${
                  checked ? "text-terminal-text" : "text-terminal-muted"
                } ${checked ? "hover:text-terminal-accent" : ""}`}
                onClick={() => {
                  if (!checked) return;
                  setFocusedProjectId((prev) =>
                    prev === proj.id ? null : proj.id,
                  );
                }}
                disabled={!checked}
              >
                {proj.title}
              </button>

              <span className="text-[9px] text-terminal-muted/50 flex-shrink-0 ml-1">
                {proj.tag}
              </span>

              {/* Inline chevron for narrow screens only (sm:hidden) */}
              {checked && proj.actions.length > 0 && (
                <button
                  className="sm:hidden text-terminal-muted hover:text-terminal-accent transition-colors"
                  onClick={() =>
                    setFocusedProjectId((prev) =>
                      prev === proj.id ? null : proj.id,
                    )
                  }
                >
                  {isFocused ? (
                    <ChevronUp size={10} />
                  ) : (
                    <ChevronDown size={10} />
                  )}
                </button>
              )}
            </div>

            {/* Inline actions — narrow only (sm:hidden) */}
            {checked && isFocused && proj.actions.length > 0 && (
              <div className="sm:hidden px-3 pb-2 pt-0.5 space-y-1.5">
                <div className="text-[8px] uppercase tracking-wider text-terminal-info/60">
                  {t("cvExport.selectedActions")} (
                  {(selectedProjectActionIndexes[proj.id] ?? []).length}/
                  {proj.actions.length})
                </div>
                <div className="space-y-1">
                  {proj.actions.map((action, actionIndex) => {
                    const actionChecked = (
                      selectedProjectActionIndexes[proj.id] ?? []
                    ).includes(actionIndex);
                    return (
                      <label
                        key={`${proj.id}-${actionIndex}`}
                        className="flex items-start gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="mt-[2px]"
                          checked={actionChecked}
                          onChange={() =>
                            toggleProjectAction(proj.id, actionIndex)
                          }
                        />
                        <span className="text-[9px] leading-4 text-terminal-muted">
                          {action}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-terminal-bg/80 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto card-base rounded-t-sm sm:rounded-sm animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="terminal-header sticky top-0 bg-terminal-card z-10">
          <div className="terminal-dot bg-terminal-error/80" />
          <div className="terminal-dot bg-terminal-warning/80" />
          <div className="terminal-dot bg-terminal-accent/80" />
          <span className="ml-2 flex items-center gap-1.5">
            <FileText size={11} />
            cv.export
          </span>
          <button
            onClick={onClose}
            className="ml-auto text-terminal-muted hover:text-terminal-accent transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Template selector */}
          <div>
            <span className="section-label text-terminal-info/70 flex items-center gap-1.5">
              <Palette size={10} />
              {t("cvExport.selectTemplate")}
            </span>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.key}
                  onClick={() => setSelected(tpl.key)}
                  className={`p-3 border rounded-sm text-left transition-all ${
                    selected === tpl.key
                      ? "border-terminal-accent/40 bg-terminal-accent/5"
                      : "border-terminal-border/40"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold block ${selected === tpl.key ? "text-terminal-accent" : "text-terminal-text"}`}
                  >
                    {tpl.label}
                  </span>
                  <span className="text-[9px] text-terminal-muted mt-0.5">
                    {tpl.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Project picker */}
          <div>
            {/* Picker header */}
            <div className="flex items-center justify-between">
              <span className="section-label text-terminal-info/70">
                {t("cvExport.projects")}&nbsp;
                <span
                  className={`font-mono ${
                    selectedProjectIds.size >= 10
                      ? "text-terminal-warning"
                      : "text-terminal-accent/60"
                  }`}
                >
                  ({selectedProjectIds.size}/10)
                </span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedProjectIds(getDefaultProjectIds());
                    setSelectedProjectActionIndexes(
                      getDefaultProjectActionIndexes(),
                    );
                  }}
                  className="text-[9px] text-terminal-muted hover:text-terminal-accent transition-colors"
                >
                  {t("cvExport.selectAll")}
                </button>
                <button
                  onClick={() => {
                    setSelectedProjectIds(new Set());
                    setSelectedProjectActionIndexes({});
                    setFocusedProjectId(null);
                  }}
                  className="text-[9px] text-terminal-muted hover:text-terminal-error transition-colors"
                >
                  {t("cvExport.clear")}
                </button>
                <button
                  onClick={() => setShowProjectPicker((v) => !v)}
                  className="text-[9px] text-terminal-muted hover:text-terminal-accent transition-colors flex items-center gap-0.5"
                >
                  {showProjectPicker ? (
                    <ChevronUp size={10} />
                  ) : (
                    <ChevronDown size={10} />
                  )}
                </button>
              </div>
            </div>

            {showProjectPicker && (
              <div className="mt-2 border border-terminal-border/30 rounded-sm">
                {/* ── WIDE layout: side-by-side ── */}
                <div className="hidden sm:flex" style={{ minHeight: "220px" }}>
                  {/* Left: search + list */}
                  <div className="flex flex-col w-1/2 border-r border-terminal-border/20">
                    {SearchBar}
                    {ProjectRows}
                  </div>

                  {/* Right: action detail panel */}
                  <div className="flex flex-col w-1/2">
                    {focusedProject &&
                    selectedProjectIds.has(focusedProject.id) ? (
                      <div className="flex flex-col h-full">
                        {/* Panel header */}
                        <div className="px-3 py-2 border-b border-terminal-border/20 flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-[10px] text-terminal-text font-medium truncate">
                              {focusedProject.title}
                            </div>
                            <div className="text-[8px] uppercase tracking-wider text-terminal-info/60 mt-0.5">
                              {t("cvExport.actionsOf")} (
                              {
                                (
                                  selectedProjectActionIndexes[
                                    focusedProject.id
                                  ] ?? []
                                ).length
                              }
                              /{focusedProject.actions.length} selected)
                            </div>
                          </div>
                          <button
                            onClick={() => setFocusedProjectId(null)}
                            className="ml-2 flex-shrink-0 text-terminal-muted hover:text-terminal-error transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </div>

                        {/* Action list */}
                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                          {focusedProject.actions.length === 0 ? (
                            <div className="text-[9px] text-terminal-muted text-center py-4">
                              {t("cvExport.noActions")}
                            </div>
                          ) : (
                            focusedProject.actions.map(
                              (action, actionIndex) => {
                                const actionChecked = (
                                  selectedProjectActionIndexes[
                                    focusedProject.id
                                  ] ?? []
                                ).includes(actionIndex);
                                return (
                                  <label
                                    key={`${focusedProject.id}-wide-${actionIndex}`}
                                    className="flex items-start gap-2 cursor-pointer group"
                                  >
                                    <div
                                      className={`mt-[2px] w-3 h-3 flex-shrink-0 border rounded-[2px] flex items-center justify-center transition-colors ${
                                        actionChecked
                                          ? "border-terminal-accent bg-terminal-accent/20"
                                          : "border-terminal-border/50 group-hover:border-terminal-accent/40"
                                      }`}
                                      onClick={() =>
                                        toggleProjectAction(
                                          focusedProject.id,
                                          actionIndex,
                                        )
                                      }
                                    >
                                      {actionChecked && (
                                        <Check
                                          size={7}
                                          className="text-terminal-accent"
                                        />
                                      )}
                                    </div>
                                    <span
                                      className={`text-[9px] leading-4 transition-colors ${
                                        actionChecked
                                          ? "text-terminal-text"
                                          : "text-terminal-muted"
                                      }`}
                                      onClick={() =>
                                        toggleProjectAction(
                                          focusedProject.id,
                                          actionIndex,
                                        )
                                      }
                                    >
                                      {action}
                                    </span>
                                  </label>
                                );
                              },
                            )
                          )}
                        </div>

                        {/* Quick select all/none */}
                        <div className="px-3 py-1.5 border-t border-terminal-border/20 flex gap-3">
                          <button
                            onClick={() =>
                              setSelectedProjectActionIndexes((prev) => ({
                                ...prev,
                                [focusedProject.id]:
                                  getAllActionIndexes(focusedProject),
                              }))
                            }
                            className="text-[8px] text-terminal-muted hover:text-terminal-accent transition-colors"
                          >
                            {t("cvExport.allActions")}
                          </button>
                          <button
                            onClick={() =>
                              setSelectedProjectActionIndexes((prev) => ({
                                ...prev,
                                [focusedProject.id]: [],
                              }))
                            }
                            className="text-[8px] text-terminal-muted hover:text-terminal-error transition-colors"
                          >
                            {t("cvExport.noneActions")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Empty state */
                      <div className="flex flex-col items-center justify-center h-full text-center px-4 py-6 gap-1.5">
                        <div className="text-terminal-muted/40 text-[10px] uppercase tracking-wider">
                          {t("cvExport.actionsPanel")}
                        </div>
                        <div className="text-terminal-muted/30 text-[9px]">
                          {selectedProjectIds.size === 0
                            ? t("cvExport.selectProjectHint")
                            : t("cvExport.clickProjectHint")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── NARROW layout: stacked (original) ── */}
                <div className="sm:hidden">
                  {SearchBar}
                  {ProjectRows}
                </div>
              </div>
            )}
          </div>

          {/* Live preview */}
          <div className="card-base p-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-terminal-muted">
              <span>{t("cvExport.livePreview")}</span>
              <span className="text-terminal-accent/50">{selected}.pdf</span>
            </div>
            <div
              className="border border-terminal-border/30 rounded-sm overflow-auto bg-white"
              style={{ maxHeight: "400px" }}
            >
              <div
                ref={contentRef}
                style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}
              >
                <CVContent
                  template={selected}
                  profile={profile}
                  projects={selectedProjects}
                  certificates={certificates}
                  techStack={techStack}
                  renderMode="preview"
                />
              </div>
            </div>
          </div>

          {/* Off-screen print render */}
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              left: "-9999px",
              top: 0,
              width: "210mm",
              pointerEvents: "none",
              backgroundColor: "#fff",
            }}
          >
            <div ref={printRef}>
              <CVContent
                template={selected}
                profile={profile}
                projects={selectedProjects}
                certificates={certificates}
                techStack={techStack}
                renderMode="print"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-wider
                         border border-terminal-border/50 text-terminal-muted rounded-sm hover:text-terminal-accent transition-colors"
            >
              <Eye size={12} />
              {t("cvExport.preview")}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-wider
                         bg-terminal-accent/10 border border-terminal-accent/30 text-terminal-accent rounded-sm hover:bg-terminal-accent/20 transition-colors"
            >
              <Download size={12} />
              {t("cvExport.download")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CVContent, Section, SidebarSection, SkillsGrid unchanged below ──

function CVContent({
  template,
  profile,
  projects,
  certificates,
  techStack,
  renderMode = "print",
}: {
  template: TemplateKey;
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  techStack?: TechItem[];
  renderMode?: "preview" | "print";
}) {
  const { t } = useLanguage();
  if (template === "minimal") {
    const minimalPadding = renderMode === "preview" ? "24px " : "0px";
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: minimalPadding,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "13px",
          lineHeight: "1.7",
          color: "#2c3e50",
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h1
            style={{
              fontSize: "33px",
              fontWeight: "bold",
              margin: "0 0 6px 0",
              color: "#1a1a1a",
            }}
          >
            {profile.name}
          </h1>
          <p
            style={{
              fontSize: "15px",
              fontStyle: "italic",
              margin: "0 0 12px 0",
              color: "#555",
            }}
          >
            {profile.title}
          </p>
          <div style={{ fontSize: "11px", color: "#777", marginBottom: "4px" }}>
            {[profile.email, profile.phone, profile.location]
              .filter(Boolean)
              .join(" • ")}
          </div>
          <div style={{ fontSize: "11px", color: "#777" }}>
            {[profile.website, profile.linkedin, profile.github]
              .filter(Boolean)
              .join(" • ")}
          </div>
        </div>
        <hr
          style={{
            margin: "16px 0",
            border: "none",
            borderTop: "2px solid #ddd",
          }}
        />
        <Section title={t("cv.summary")}>
          <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.7" }}>
            {profile.summary}
          </p>
        </Section>
        <Section title={t("cv.experience")}>
          {profile.experience.map((exp, i) => (
            <div key={i} data-cv-item="true" style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "4px",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}>
                  {exp.role}
                  {exp.organization && (
                    <span style={{ fontWeight: "normal" }}>
                      {" "}
                      — {exp.organization}
                    </span>
                  )}
                  <span
                    style={{
                      fontWeight: "normal",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      color: "#777",
                      marginLeft: "8px",
                    }}
                  >
                    [{exp.type}]
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    fontStyle: "italic",
                    marginLeft: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {exp.period}
                </div>
              </div>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: "#444",
                }}
              >
                {exp.description}
              </p>
            </div>
          ))}
        </Section>
        {techStack && techStack.length > 0 && (
          <Section title={t("cv.skills")}>
            <SkillsGrid techStack={techStack} />
          </Section>
        )}
        {profile.education && profile.education.length > 0 && (
          <Section title={t("cv.education")}>
            {profile.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "8px", fontSize: "12px" }}>
                <strong>{edu.degree}</strong> — {edu.school} ({edu.year})
              </div>
            ))}
          </Section>
        )}
        {projects.length > 0 && (
          <Section title={t("cv.projects")}>
            {projects.map((proj, i) => (
              <div key={i} data-cv-item="true" style={{ marginBottom: "14px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}
                  >
                    {proj.title} ({proj.tag})
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      marginLeft: "8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {proj.created_at}
                  </div>
                </div>
                <p
                  style={{
                    margin: "3px 0",
                    fontSize: "13px",
                    lineHeight: "1.6",
                  }}
                >
                  <strong>{t("cv.problem")}</strong> {proj.problem}
                </p>
                {proj.actions.length > 0 && (
                  <div style={{ margin: "5px 0" }}>
                    <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                      {t("cv.actions")}
                    </div>
                    <ul
                      style={{
                        margin: "4px 0 0 18px",
                        padding: 0,
                        fontSize: "13px",
                        lineHeight: "1.5",
                        listStyleType: "disc",
                        listStylePosition: "outside",
                      }}
                    >
                      {proj.actions.map((action, actionIndex) => (
                        <li key={`${proj.id}-minimal-action-${actionIndex}`}>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {proj.results && proj.results.length > 0 && (
                  <p
                    style={{
                      margin: "3px 0",
                      fontSize: "13px",
                      lineHeight: "1.6",
                    }}
                  >
                    <strong>{t("cv.results")}</strong>{" "}
                    {proj.results
                      .map((r) => `${r.value} ${r.label}`)
                      .join(" • ")}
                  </p>
                )}
                <p style={{ margin: "3px 0", fontSize: "12px", color: "#666" }}>
                  <strong>{t("cv.tech")}</strong> {proj.tech.join(", ")}
                </p>
              </div>
            ))}
          </Section>
        )}
        {certificates.length > 0 && (
          <Section title={t("cv.certifications")}>
            {certificates.map((cert, i) => (
              <div key={i} data-cv-item="true" style={{ marginBottom: "8px" }}>
                <div style={{ fontWeight: "bold", fontSize: "12px" }}>
                  {cert.name} — {cert.issuer} ({cert.date})
                </div>
                {cert.credentialId && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#777",
                      marginTop: "2px",
                    }}
                  >
                    ID: {cert.credentialId}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "8px",
            borderTop: "1px solid #ddd",
            fontSize: "10px",
            color: "#aaa",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{profile.name}</span>
          <span>{profile.email}</span>
        </div>
      </div>
    );
  }

  if (template === "modern") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          backgroundColor: "#fff",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "13px",
          lineHeight: "1.6",
        }}
      >
        <div
          style={{
            width: "170px",
            backgroundColor: "#122430",
            color: "#bcd6d2",
            padding: "20px 14px 24px",
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        >
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt=""
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                margin: "0 auto 10px",
              }}
            />
          )}
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              textAlign: "center",
              color: "#fff",
              margin: "0 0 4px 0",
              lineHeight: "1.35",
            }}
          >
            {profile.name}
          </h2>
          <p
            style={{
              fontSize: "10.5px",
              fontStyle: "italic",
              textAlign: "center",
              margin: "0 0 14px 0",
              color: "#bcd6d2",
              lineHeight: "1.35",
            }}
          >
            {profile.title}
          </p>
          <SidebarSection title={t("cv.contact")}>
            <div style={{ fontSize: "9.5px", lineHeight: "1.65" }}>
              {profile.email && (
                <div style={{ wordBreak: "break-all" }}>{profile.email}</div>
              )}
              {profile.phone && <div>{profile.phone}</div>}
              {profile.location && <div>{profile.location}</div>}
              {profile.linkedin && (
                <div style={{ wordBreak: "break-all", marginTop: "2px" }}>
                  {profile.linkedin}
                </div>
              )}
              {profile.github && (
                <div style={{ wordBreak: "break-all" }}>{profile.github}</div>
              )}
            </div>
          </SidebarSection>
          {profile.education && profile.education.length > 0 && (
            <SidebarSection title={t("cv.education")}>
              {profile.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: "5px", fontSize: "9.5px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#fff",
                      lineHeight: "1.35",
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div style={{ lineHeight: "1.35", opacity: 0.85 }}>
                    {edu.school}, {edu.year}
                  </div>
                </div>
              ))}
            </SidebarSection>
          )}
          {certificates.length > 0 && (
            <SidebarSection title={t("cv.certifications")}>
              {certificates.map((cert, i) => (
                <div key={i} style={{ marginBottom: "6px", fontSize: "9.5px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#fff",
                      lineHeight: "1.35",
                    }}
                  >
                    {cert.name}
                  </div>
                  <div
                    style={{
                      lineHeight: "1.3",
                      opacity: 0.75,
                      fontSize: "9px",
                    }}
                  >
                    {cert.date}
                  </div>
                </div>
              ))}
            </SidebarSection>
          )}
        </div>
        <div
          style={{
            flex: 1,
            padding: "20px 24px 24px",
            color: "#2c3e50",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Section title={t("cv.summary")}>
            <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.6" }}>
              {profile.summary}
            </p>
          </Section>
          <Section title={t("cv.experience")}>
            {profile.experience.map((exp, i) => (
              <div key={i} data-cv-item="true" style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "2px",
                  }}
                >
                  <div
                    style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}
                  >
                    {exp.role}
                    {exp.organization && (
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        — {exp.organization}
                      </span>
                    )}
                    <span
                      style={{
                        fontWeight: "normal",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        color: "#777",
                        marginLeft: "8px",
                      }}
                    >
                      [{exp.type}]
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      fontStyle: "italic",
                      marginLeft: "8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {exp.period}
                  </div>
                </div>
                <p
                  style={{
                    margin: "2px 0 0 0",
                    fontSize: "13px",
                    lineHeight: "1.6",
                  }}
                >
                  {exp.description}
                </p>
              </div>
            ))}
          </Section>
          {projects.length > 0 && (
            <Section title={t("cv.projects")}>
              {projects.map((proj, i) => (
                <div
                  key={i}
                  data-cv-item="true"
                  style={{ marginBottom: "12px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "3px",
                    }}
                  >
                    <div
                      style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}
                    >
                      {proj.title}{" "}
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#0e6e64",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        - {proj.tag}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        marginLeft: "8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {proj.created_at}
                    </div>
                  </div>
                  <p
                    style={{
                      margin: "2px 0",
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    <strong>{t("cv.problem")}</strong> {proj.problem}
                  </p>
                  {proj.actions.length > 0 && (
                    <div style={{ margin: "4px 0" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          marginBottom: "2px",
                        }}
                      >
                        {t("cv.actions")}
                      </div>
                      <ul
                        style={{
                          margin: "0 0 0 18px",
                          padding: 0,
                          fontSize: "13px",
                          lineHeight: "1.45",
                          listStyleType: "disc",
                          listStylePosition: "outside",
                        }}
                      >
                        {proj.actions.map((action, actionIndex) => (
                          <li key={`${proj.id}-modern-action-${actionIndex}`}>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {proj.results && proj.results.length > 0 && (
                    <p
                      style={{
                        margin: "2px 0",
                        fontSize: "13px",
                        lineHeight: "1.5",
                        color: "#0e6e64",
                        fontWeight: "bold",
                      }}
                    >
                      {t("cv.results")}{" "}
                      {proj.results
                        .map((r) => `${r.value} ${r.label}`)
                        .join(" • ")}
                    </p>
                  )}
                  <p
                    style={{
                      margin: "2px 0 0 0",
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    {t("cv.tech")} {proj.tech.slice(0, 5).join(", ")}
                  </p>
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    );
  }

  // Executive
  return (
    <div
      style={{
        backgroundColor: "#fff",
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "13px",
        lineHeight: "1.6",
        color: "#2c3e50",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "#142e5c",
          color: "#fff",
          padding: "20px 24px",
          marginBottom: "16px",
        }}
      >
        <h1
          style={{ fontSize: "29px", fontWeight: "bold", margin: "0 0 6px 0" }}
        >
          {profile.name}
        </h1>
        <p
          style={{
            fontSize: "15px",
            fontStyle: "italic",
            margin: "0 0 8px 0",
            color: "#d6dce8",
          }}
        >
          {profile.title}
        </p>
        <div
          style={{ fontSize: "11px", color: "#d6dce8", marginBottom: "3px" }}
        >
          {[profile.email, profile.phone, profile.location]
            .filter(Boolean)
            .join(" | ")}
        </div>
        <div style={{ fontSize: "11px", color: "#d6dce8" }}>
          {[profile.website, profile.linkedin, profile.github]
            .filter(Boolean)
            .join(" | ")}
        </div>
      </div>
      <div style={{ padding: "0 24px" }}>
        <Section title={t("cv.summary")}>
          <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.6" }}>
            {profile.summary}
          </p>
        </Section>
        <Section title={t("cv.experience")}>
          {profile.experience.map((exp, i) => (
            <div key={i} data-cv-item="true" style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "2px",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}>
                  {exp.role}
                  {exp.organization && (
                    <span style={{ fontWeight: "normal" }}>
                      {" "}
                      — {exp.organization}
                    </span>
                  )}
                  <span
                    style={{
                      fontWeight: "normal",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      color: "#777",
                      marginLeft: "8px",
                    }}
                  >
                    [{exp.type}]
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    fontStyle: "italic",
                    marginLeft: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {exp.period}
                </div>
              </div>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "13px",
                  lineHeight: "1.6",
                }}
              >
                {exp.description}
              </p>
            </div>
          ))}
        </Section>
        {techStack && techStack.length > 0 && (
          <Section title={t("cv.skills")}>
            <SkillsGrid techStack={techStack} />
          </Section>
        )}
        {profile.education && profile.education.length > 0 && (
          <Section title={t("cv.education")}>
            {profile.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "6px", fontSize: "12px" }}>
                <strong>{edu.degree}</strong> — {edu.school} ({edu.year})
              </div>
            ))}
          </Section>
        )}
        {projects.length > 0 && (
          <Section title={t("cv.projects")}>
            {projects.map((proj, i) => (
              <div key={i} data-cv-item="true" style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "2px",
                  }}
                >
                  <div
                    style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}
                  >
                    {proj.title} ({proj.tag})
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      marginLeft: "8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {proj.created_at}
                  </div>
                </div>
                <p
                  style={{
                    margin: "2px 0",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  <strong>{t("cv.problem")}</strong> {proj.problem}
                </p>
                {proj.actions.length > 0 && (
                  <div style={{ margin: "4px 0" }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginBottom: "2px",
                      }}
                    >
                      {t("cv.actions")}
                    </div>
                    <ul
                      style={{
                        margin: "0 0 0 18px",
                        padding: 0,
                        fontSize: "13px",
                        lineHeight: "1.45",
                      }}
                    >
                      {proj.actions.map((action, actionIndex) => (
                        <li key={`${proj.id}-executive-action-${actionIndex}`}>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {proj.results && proj.results.length > 0 && (
                  <p
                    style={{
                      margin: "2px 0",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      color: "#2d569c",
                      fontWeight: "bold",
                    }}
                  >
                    {t("cv.results")}{" "}
                    {proj.results
                      .map((r) => `${r.value} ${r.label}`)
                      .join(" • ")}
                  </p>
                )}
                <p
                  style={{
                    margin: "2px 0 0 0",
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  {t("cv.tech")} {proj.tech.join(", ")}
                </p>
              </div>
            ))}
          </Section>
        )}
        {certificates.length > 0 && (
          <Section title={t("cv.certifications")}>
            {certificates.map((cert, i) => (
              <div
                key={i}
                data-cv-item="true"
                style={{ marginBottom: "6px", fontSize: "12px" }}
              >
                <strong>{cert.name}</strong> — {cert.issuer} ({cert.date})
              </div>
            ))}
          </Section>
        )}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "8px",
            borderTop: "1px solid #c8d2e0",
            fontSize: "10px",
            color: "#aaa",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{profile.name}</span>
          <span>{profile.email}</span>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <h2
        style={{
          fontSize: "17px",
          fontWeight: "bold",
          color: "#1a1a1a",
          margin: "0 0 8px 0",
          paddingBottom: "5px",
          borderBottom: "2px solid #ddd",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
        }}
      >
        {title}
      </h2>
      <div style={{ textAlign: "justify", textJustify: "inter-word" }}>
        {children}
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          fontSize: "9px",
          fontWeight: "bold",
          color: "#b6dcd6",
          marginBottom: "4px",
          paddingBottom: "2px",
          borderBottom: "1px solid rgba(182,220,214,0.3)",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function SkillsGrid({ techStack }: { techStack: TechItem[] }) {
  const categories = [
    "lang",
    "fe",
    "be",
    "db",
    "infra",
    "cicd",
    "data",
  ] as const;
  const labels: Record<string, string> = {
    lang: "Languages",
    fe: "Frontend",
    be: "Backend",
    db: "Database",
    infra: "Infrastructure",
    cicd: "CI/CD",
    data: "Data",
  };
  return (
    <div>
      {categories.map((cat) => {
        const items = techStack
          .filter((t) => t.category === cat)
          .map((t) => t.name);
        if (!items.length) return null;
        return (
          <div
            key={cat}
            style={{
              marginBottom: "6px",
              display: "flex",
              fontSize: "12px",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                width: "120px",
                paddingRight: "10px",
                flexShrink: 0,
                lineHeight: "1.6",
              }}
            >
              {labels[cat]}:
            </div>
            <div style={{ flex: 1, lineHeight: "1.6" }}>{items.join(", ")}</div>
          </div>
        );
      })}
    </div>
  );
}
