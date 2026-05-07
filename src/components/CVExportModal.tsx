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
import CVContent from "./cv/CVContent";
import type { CVSectionKey, SectionSelection, TemplateKey } from "./cv/types";
import { useSelectableSet } from "../hooks/useSelectableSet";
import type { FontKey } from "./cv/types";
import { FONT_CSS } from "./cv/types";

interface CVExportModalProps {
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  techStack?: TechItem[];
  onClose: () => void;
}

type SectionCollapseState = Record<CVSectionKey, boolean>;

const SELECTION_LIMITS = {
  projects: 10,
  experience: undefined,
  skills: undefined,
  education: undefined,
  certifications: undefined,
} as const;

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
    new Set(projects.slice(0, SELECTION_LIMITS.projects).map((p) => p.id));

  const getDefaultProjectActionIndexes = () =>
    Object.fromEntries(
      projects
        .slice(0, SELECTION_LIMITS.projects)
        .map((project) => [project.id, getAllActionIndexes(project)]),
    ) as Record<string, number[]>;

  const [selected, setSelected] = useState<TemplateKey>("minimal");
  const [selectedFont, setSelectedFont] = useState<FontKey>("georgia");
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const projectIdSelection = useSelectableSet<string>({
    initialValues: getDefaultProjectIds(),
    maxSelections: SELECTION_LIMITS.projects,
  });
  const selectedProjectIds = projectIdSelection.selected;
  const updateSelectedProjectIds = projectIdSelection.update;
  const selectAllProjectIds = projectIdSelection.selectAll;
  const clearProjectIds = projectIdSelection.clear;
  const [selectedProjectActionIndexes, setSelectedProjectActionIndexes] =
    useState<Record<string, number[]>>(() => getDefaultProjectActionIndexes());
  const [projectSearch, setProjectSearch] = useState("");
  const [projectTagFilter, setProjectTagFilter] = useState<string>("all");
  const experienceSelection = useSelectableSet<number>({
    initialValues: profile.experience.map((_, index) => index),
    maxSelections: SELECTION_LIMITS.experience,
  });
  const selectedExperienceIndexes = experienceSelection.selected;
  const educationSelection = useSelectableSet<number>({
    initialValues: (profile.education ?? []).map((_, index) => index),
    maxSelections: SELECTION_LIMITS.education,
  });
  const selectedEducationIndexes = educationSelection.selected;
  const certificateSelection = useSelectableSet<number>({
    initialValues: certificates.map((_, index) => index),
    maxSelections: SELECTION_LIMITS.certifications,
  });
  const selectedCertificateIndexes = certificateSelection.selected;
  const skillSelection = useSelectableSet<string>({
    initialValues: (techStack ?? [])
      .map((item) => item.category)
      .filter(Boolean),
    maxSelections: SELECTION_LIMITS.skills,
  });
  const selectedSkillCategories = skillSelection.selected;
  const [selectedSections, setSelectedSections] = useState<SectionSelection>({
    experience: true,
    skills: true,
    education: true,
    projects: true,
    certifications: true,
  });
  const [collapsedSections, setCollapsedSections] =
    useState<SectionCollapseState>({
      experience: true,
      skills: true,
      education: true,
      projects: true,
      certifications: true,
    });

  // Which project's actions are shown in the right panel (wide layout)
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const docTitle = () => `CV_${profile.name.replace(/\s+/g, "_")}_${selected}`;

  const GOOGLE_FONTS_URL =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Roboto:wght@400;500;700&family=Playfair+Display:wght@400;600;700&display=swap";

  // NOTE: @import is intentionally removed — useReactToPrint copies <link> tags
  // from document.head into the print iframe, so the Google Fonts <link> in
  // index.html is sufficient and more reliable than CSS @import.
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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${GOOGLE_FONTS_URL}" rel="stylesheet">
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
      updateSelectedProjectIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          // Clear focus if this project was focused
          setFocusedProjectId((f) => (f === id ? null : f));
        } else if (next.size < SELECTION_LIMITS.projects) {
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
    [projects, updateSelectedProjectIds],
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

  const selectedProfile = {
    ...profile,
    experience: profile.experience.filter((_, index) =>
      selectedExperienceIndexes.has(index),
    ),
    education: (profile.education ?? []).filter((_, index) =>
      selectedEducationIndexes.has(index),
    ),
  };

  const selectedCertificates = certificates.filter((_, index) =>
    selectedCertificateIndexes.has(index),
  );

  const selectedTechStack = (techStack ?? []).filter((item) =>
    selectedSkillCategories.has(item.category),
  );

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
  const skillCategories = Array.from(
    new Set((techStack ?? []).map((item) => item.category)),
  );

  const sectionOptions: { key: CVSectionKey; label: string }[] = [
    { key: "experience", label: t("cv.experience") },
    { key: "skills", label: t("cv.skills") },
    { key: "education", label: t("cv.education") },
    { key: "projects", label: t("cv.projects") },
    { key: "certifications", label: t("cv.certifications") },
  ];

  const setAllSections = (value: boolean) => {
    setSelectedSections({
      experience: value,
      skills: value,
      education: value,
      projects: value,
      certifications: value,
    });
  };

  const renderSelectionCount = (
    selectedCount: number,
    totalCount: number,
    options?: { maxCount?: number; warnWhenAtMax?: boolean },
  ) => {
    const limit = options?.maxCount ?? totalCount;
    const colorClass =
      selectedCount === 0
        ? "text-terminal-error/80"
        : selectedCount >= limit
          ? "text-terminal-warning"
          : "text-terminal-accent/60";

    return (
      <span className={`font-mono transition-colors ${colorClass}`}>
        ({selectedCount}/{limit})
      </span>
    );
  };

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

          {/* Font selector */}
          <div>
            <span className="section-label text-terminal-info/70 flex items-center gap-1.5">
              <span style={{ fontSize: 10 }}>Aa</span>
              {t("cvExport.selectFont")}
            </span>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {(
                [
                  { key: "georgia", label: "Georgia", sample: "serif" },
                  { key: "inter", label: "Inter", sample: "sans" },
                  {
                    key: "merriweather",
                    label: "Merriweather",
                    sample: "serif",
                  },
                  { key: "roboto", label: "Roboto", sample: "sans" },
                  { key: "playfair", label: "Playfair", sample: "serif" },
                ] as { key: FontKey; label: string; sample: string }[]
              ).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSelectedFont(f.key)}
                  className={`p-2 border rounded-sm text-left transition-all ${
                    selectedFont === f.key
                      ? "border-terminal-accent/40 bg-terminal-accent/5"
                      : "border-terminal-border/40 hover:border-terminal-border"
                  }`}
                >
                  <span
                    className={`text-[11px] block font-semibold truncate ${
                      selectedFont === f.key
                        ? "text-terminal-accent"
                        : "text-terminal-text"
                    }`}
                    style={{ fontFamily: FONT_CSS[f.key] }}
                  >
                    {f.label}
                  </span>
                  <span className="text-[8px] text-terminal-muted/60 uppercase tracking-wider">
                    {f.sample}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Project picker */}
          <div>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="section-label text-terminal-info/70">
                  {t("cvExport.sections")}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAllSections(true)}
                    className="text-[9px] text-terminal-muted hover:text-terminal-accent transition-colors"
                  >
                    {t("cvExport.selectAllSections")}
                  </button>
                  <button
                    onClick={() => setAllSections(false)}
                    className="text-[9px] text-terminal-muted hover:text-terminal-error transition-colors"
                  >
                    {t("cvExport.clearSections")}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {sectionOptions.map((section) => {
                  const active = selectedSections[section.key];
                  return (
                    <button
                      key={section.key}
                      onClick={() =>
                        setSelectedSections((prev) => ({
                          ...prev,
                          [section.key]: !prev[section.key],
                        }))
                      }
                      className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border rounded-sm transition-all duration-200 ${
                        active
                          ? "border-terminal-accent/40 text-terminal-accent bg-terminal-accent/5"
                          : "border-terminal-border/40 text-terminal-muted hover:border-terminal-borderHover hover:text-terminal-text"
                      }`}
                    >
                      {section.label}
                    </button>
                  );
                })}
              </div>

              {selectedSections.experience && profile.experience.length > 0 && (
                <div className="mt-3 border border-terminal-border/30 rounded-sm p-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedSections((prev) => ({
                          ...prev,
                          experience: !prev.experience,
                        }))
                      }
                      className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-terminal-info/70 hover:text-terminal-accent transition-colors"
                    >
                      {collapsedSections.experience ? (
                        <ChevronDown size={10} />
                      ) : (
                        <ChevronUp size={10} />
                      )}
                      {t("cv.experience")}{" "}
                      {renderSelectionCount(
                        selectedExperienceIndexes.size,
                        profile.experience.length,
                      )}
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          experienceSelection.selectAll(
                            profile.experience.map((_, i) => i),
                          )
                        }
                        className="text-[9px] text-terminal-muted hover:text-terminal-accent transition-colors"
                      >
                        {t("cvExport.selectAll")}
                      </button>
                      <button
                        onClick={experienceSelection.clear}
                        className="text-[9px] text-terminal-muted hover:text-terminal-error transition-colors"
                      >
                        {t("cvExport.clear")}
                      </button>
                    </div>
                  </div>
                  {!collapsedSections.experience && (
                    <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                      {profile.experience.map((exp, index) => {
                        const checked = selectedExperienceIndexes.has(index);
                        return (
                          <div
                            key={`exp-${index}`}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-sm border border-terminal-border/20 hover:bg-terminal-surface/30"
                          >
                            <button
                              type="button"
                              onClick={() => experienceSelection.toggle(index)}
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
                                  <Check
                                    size={8}
                                    className="text-terminal-accent"
                                  />
                                )}
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => experienceSelection.toggle(index)}
                              className="flex-1 text-left text-[10px] text-terminal-muted hover:text-terminal-text truncate"
                            >
                              {exp.role} - {exp.organization}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedSections.skills && skillCategories.length > 0 && (
                <div className="mt-3 border border-terminal-border/30 rounded-sm p-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedSections((prev) => ({
                          ...prev,
                          skills: !prev.skills,
                        }))
                      }
                      className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-terminal-info/70 hover:text-terminal-accent transition-colors"
                    >
                      {collapsedSections.skills ? (
                        <ChevronDown size={10} />
                      ) : (
                        <ChevronUp size={10} />
                      )}
                      {t("cv.skills")}{" "}
                      {renderSelectionCount(
                        selectedSkillCategories.size,
                        skillCategories.length,
                      )}
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          skillSelection.selectAll(skillCategories)
                        }
                        className="text-[9px] text-terminal-muted hover:text-terminal-accent transition-colors"
                      >
                        {t("cvExport.selectAll")}
                      </button>
                      <button
                        onClick={skillSelection.clear}
                        className="text-[9px] text-terminal-muted hover:text-terminal-error transition-colors"
                      >
                        {t("cvExport.clear")}
                      </button>
                    </div>
                  </div>
                  {!collapsedSections.skills && (
                    <div className="flex flex-wrap gap-1.5">
                      {skillCategories.map((cat) => {
                        const active = selectedSkillCategories.has(cat);
                        return (
                          <button
                            key={`skill-${cat}`}
                            onClick={() => skillSelection.toggle(cat)}
                            className={`px-2 py-0.5 text-[9px] uppercase tracking-wider border rounded-sm transition-all ${
                              active
                                ? "border-terminal-accent/40 text-terminal-accent bg-terminal-accent/5"
                                : "border-terminal-border/40 text-terminal-muted hover:text-terminal-text"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedSections.education &&
                (profile.education ?? []).length > 0 && (
                  <div className="mt-3 border border-terminal-border/30 rounded-sm p-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setCollapsedSections((prev) => ({
                            ...prev,
                            education: !prev.education,
                          }))
                        }
                        className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-terminal-info/70 hover:text-terminal-accent transition-colors"
                      >
                        {collapsedSections.education ? (
                          <ChevronDown size={10} />
                        ) : (
                          <ChevronUp size={10} />
                        )}
                        {t("cv.education")}{" "}
                        {renderSelectionCount(
                          selectedEducationIndexes.size,
                          (profile.education ?? []).length,
                        )}
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            educationSelection.selectAll(
                              (profile.education ?? []).map((_, i) => i),
                            )
                          }
                          className="text-[9px] text-terminal-muted hover:text-terminal-accent transition-colors"
                        >
                          {t("cvExport.selectAll")}
                        </button>
                        <button
                          onClick={educationSelection.clear}
                          className="text-[9px] text-terminal-muted hover:text-terminal-error transition-colors"
                        >
                          {t("cvExport.clear")}
                        </button>
                      </div>
                    </div>
                    {!collapsedSections.education && (
                      <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                        {(profile.education ?? []).map((edu, index) => {
                          const checked = selectedEducationIndexes.has(index);
                          return (
                            <div
                              key={`edu-${index}`}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-sm border border-terminal-border/20 hover:bg-terminal-surface/30"
                            >
                              <button
                                type="button"
                                onClick={() => educationSelection.toggle(index)}
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
                                    <Check
                                      size={8}
                                      className="text-terminal-accent"
                                    />
                                  )}
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={() => educationSelection.toggle(index)}
                                className="flex-1 text-left text-[10px] text-terminal-muted hover:text-terminal-text truncate"
                              >
                                {edu.degree} - {edu.school}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              {selectedSections.certifications && certificates.length > 0 && (
                <div className="mt-3 border border-terminal-border/30 rounded-sm p-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedSections((prev) => ({
                          ...prev,
                          certifications: !prev.certifications,
                        }))
                      }
                      className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-terminal-info/70 hover:text-terminal-accent transition-colors"
                    >
                      {collapsedSections.certifications ? (
                        <ChevronDown size={10} />
                      ) : (
                        <ChevronUp size={10} />
                      )}
                      {t("cv.certifications")}{" "}
                      {renderSelectionCount(
                        selectedCertificateIndexes.size,
                        certificates.length,
                      )}
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          certificateSelection.selectAll(
                            certificates.map((_, i) => i),
                          )
                        }
                        className="text-[9px] text-terminal-muted hover:text-terminal-accent transition-colors"
                      >
                        {t("cvExport.selectAll")}
                      </button>
                      <button
                        onClick={certificateSelection.clear}
                        className="text-[9px] text-terminal-muted hover:text-terminal-error transition-colors"
                      >
                        {t("cvExport.clear")}
                      </button>
                    </div>
                  </div>
                  {!collapsedSections.certifications && (
                    <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                      {certificates.map((cert, index) => {
                        const checked = selectedCertificateIndexes.has(index);
                        return (
                          <div
                            key={`cert-${index}`}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-sm border border-terminal-border/20 hover:bg-terminal-surface/30"
                          >
                            <button
                              type="button"
                              onClick={() => certificateSelection.toggle(index)}
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
                                  <Check
                                    size={8}
                                    className="text-terminal-accent"
                                  />
                                )}
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => certificateSelection.toggle(index)}
                              className="flex-1 text-left text-[10px] text-terminal-muted hover:text-terminal-text truncate"
                            >
                              {cert.name}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedSections.projects && (
              <div className="mt-3 border border-terminal-border/30 rounded-sm p-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowProjectPicker((v) => !v)}
                    className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-terminal-info/70 hover:text-terminal-accent transition-colors"
                  >
                    {showProjectPicker ? (
                      <ChevronUp size={10} />
                    ) : (
                      <ChevronDown size={10} />
                    )}
                    {t("cvExport.projects")}{" "}
                    {renderSelectionCount(
                      selectedProjectIds.size,
                      projects.length,
                      {
                        maxCount: 10,
                        warnWhenAtMax: true,
                      },
                    )}
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        selectAllProjectIds(
                          projects.map((project) => project.id),
                        );
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
                        clearProjectIds();
                        setSelectedProjectActionIndexes({});
                        setFocusedProjectId(null);
                      }}
                      className="text-[9px] text-terminal-muted hover:text-terminal-error transition-colors"
                    >
                      {t("cvExport.clear")}
                    </button>
                  </div>
                </div>

                {showProjectPicker && (
                  <div className="border border-terminal-border/30 rounded-sm">
                    {/* ── WIDE layout: side-by-side ── */}
                    <div className="hidden sm:flex" style={{ height: "320px" }}>
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
                  profile={selectedProfile}
                  projects={selectedProjects}
                  certificates={selectedCertificates}
                  techStack={selectedTechStack}
                  includedSections={selectedSections}
                  fontFamily={FONT_CSS[selectedFont]}
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
                profile={selectedProfile}
                projects={selectedProjects}
                certificates={selectedCertificates}
                techStack={selectedTechStack}
                includedSections={selectedSections}
                fontFamily={FONT_CSS[selectedFont]}
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
