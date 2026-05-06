import { useState, useCallback, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
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
} from "../data/portfolio";

interface CVExportModalProps {
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  techStack?: TechItem[];
  onClose: () => void;
}

type TemplateKey = "minimal" | "modern" | "executive";

const templates: { key: TemplateKey; label: string; desc: string }[] = [
  { key: "minimal", label: "Minimal", desc: "Clean, single-column" },
  { key: "modern", label: "Modern", desc: "Sidebar + content" },
  { key: "executive", label: "Executive", desc: "Navy header band" },
];

export default function CVExportModal({
  profile,
  projects,
  certificates,
  techStack,
  onClose,
}: CVExportModalProps) {
  const [selected, setSelected] = useState<TemplateKey>("minimal");
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(
    () => new Set(projects.slice(0, 10).map((p) => p.id)),
  );
  const [projectSearch, setProjectSearch] = useState("");
  const [projectTagFilter, setProjectTagFilter] = useState<string>("all");
  const contentRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const docTitle = () => `CV_${profile.name.replace(/\s+/g, "_")}_${selected}`;

  const basePageStyle = `
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    [data-cv-item] { break-inside: avoid; page-break-inside: avoid; }
    html { margin: 0; background: #fff !important; }
  `;

  // A4 pages, break-inside rules on [data-cv-item] keep items intact
  const printA4 = useReactToPrint({
    contentRef: printRef,
    documentTitle: docTitle,
    pageStyle: `@page { size: A4 portrait; margin: 20mm 15mm; } ${basePageStyle}`,
  });

  // Preview: open styled HTML in a new tab — no print dialog, purely visual
  const handlePreview = () => {
    // Preview must use preview DOM only (contentRef), fully independent from print DOM
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

  // Download: trigger browser native print dialog → user selects "Save as PDF"
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

  const toggleProject = useCallback((id: string) => {
    setSelectedProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 10) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectedProjects = projects.filter((p) => selectedProjectIds.has(p.id));

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-terminal-bg/80 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto card-base rounded-t-sm sm:rounded-sm animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
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
          <div>
            <span className="section-label text-terminal-info/70 flex items-center gap-1.5">
              <Palette size={10} />
              select template
            </span>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {templates.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelected(t.key)}
                  className={`p-3 border rounded-sm text-left transition-all ${
                    selected === t.key
                      ? "border-terminal-accent/40 bg-terminal-accent/5"
                      : "border-terminal-border/40"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold block ${selected === t.key ? "text-terminal-accent" : "text-terminal-text"}`}
                  >
                    {t.label}
                  </span>
                  <span className="text-[9px] text-terminal-muted mt-0.5">
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Project picker */}
          <div>
            <div className="flex items-center justify-between">
              <span className="section-label text-terminal-info/70">
                projects&nbsp;
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
                  onClick={() =>
                    setSelectedProjectIds(
                      new Set(projects.slice(0, 10).map((p) => p.id)),
                    )
                  }
                  className="text-[9px] text-terminal-muted hover:text-terminal-accent transition-colors"
                >
                  all
                </button>
                <button
                  onClick={() => setSelectedProjectIds(new Set())}
                  className="text-[9px] text-terminal-muted hover:text-terminal-error transition-colors"
                >
                  clear
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
                {/* Search + tag filter */}
                <div className="p-2 border-b border-terminal-border/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 bg-terminal-bg/60 border border-terminal-border/30 rounded-sm px-2 py-1">
                    <Search
                      size={9}
                      className="text-terminal-muted flex-shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="search title or tag…"
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
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                {/* List */}
                <div className="overflow-y-auto max-h-44">
                  {filteredProjects.length === 0 && (
                    <div className="px-3 py-3 text-[10px] text-terminal-muted text-center">
                      no results
                    </div>
                  )}
                  {filteredProjects.map((proj) => {
                    const checked = selectedProjectIds.has(proj.id);
                    const atMax = selectedProjectIds.size >= 10 && !checked;
                    return (
                      <label
                        key={proj.id}
                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors border-b border-terminal-border/20 last:border-0 ${
                          checked
                            ? "bg-terminal-accent/5"
                            : atMax
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:bg-terminal-surface/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          disabled={atMax}
                          onChange={() => toggleProject(proj.id)}
                        />
                        <div
                          className={`w-3.5 h-3.5 border rounded-[2px] flex items-center justify-center flex-shrink-0 transition-colors ${
                            checked
                              ? "border-terminal-accent bg-terminal-accent/20"
                              : "border-terminal-border/50"
                          }`}
                        >
                          {checked && (
                            <Check size={8} className="text-terminal-accent" />
                          )}
                        </div>
                        <span
                          className={`text-[10px] flex-1 truncate ${
                            checked
                              ? "text-terminal-text"
                              : "text-terminal-muted"
                          }`}
                        >
                          {proj.title}
                        </span>
                        <span className="text-[9px] text-terminal-muted/50 flex-shrink-0 ml-1">
                          {proj.tag}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="card-base p-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-terminal-muted">
              <span>LIVE PREVIEW</span>
              <span className="text-terminal-accent/50">{selected}.pdf</span>
            </div>
            <div
              className="border border-terminal-border/30 rounded-sm overflow-auto bg-white"
              style={{ maxHeight: "400px" }}
            >
              {/* Preview-only render — scrollable but NOT used for capture */}
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

          {/* Off-screen full-height render used for printing — must have explicit white bg */}
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

          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-wider
                         border border-terminal-border/50 text-terminal-muted rounded-sm hover:text-terminal-accent transition-colors"
            >
              <Eye size={12} />
              preview
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-wider
                         bg-terminal-accent/10 border border-terminal-accent/30 text-terminal-accent rounded-sm hover:bg-terminal-accent/20 transition-colors"
            >
              <Download size={12} />
              download pdf
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  if (template === "minimal") {
    const minimalPadding =
      renderMode === "preview" ? "14px 14px 14px 14px" : "0px";

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
        {/* Header */}
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

        {/* Summary */}
        <Section title="SUMMARY">
          <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.7" }}>
            {profile.summary}
          </p>
        </Section>

        {/* Experience */}
        <Section title="EXPERIENCE">
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
                  {exp.company && (
                    <span style={{ fontWeight: "normal" }}>
                      {" "}
                      — {exp.company}
                    </span>
                  )}
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

        {/* Skills */}
        {techStack && techStack.length > 0 && (
          <Section title="SKILLS">
            <SkillsGrid techStack={techStack} />
          </Section>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <Section title="EDUCATION">
            {profile.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "8px", fontSize: "12px" }}>
                <strong>{edu.degree}</strong> — {edu.school} ({edu.year})
              </div>
            ))}
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="PROJECTS">
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
                  <strong>Problem:</strong> {proj.problem}
                </p>
                {proj.results && proj.results.length > 0 && (
                  <p
                    style={{
                      margin: "3px 0",
                      fontSize: "13px",
                      lineHeight: "1.6",
                    }}
                  >
                    <strong>Results:</strong>{" "}
                    {proj.results
                      .map((r) => `${r.value} ${r.label}`)
                      .join(" • ")}
                  </p>
                )}
                <p style={{ margin: "3px 0", fontSize: "12px", color: "#666" }}>
                  <strong>Tech:</strong> {proj.tech.join(", ")}
                </p>
              </div>
            ))}
          </Section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <Section title="CERTIFICATIONS">
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

        {/* Footer */}
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
        {/* Sidebar */}
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

          <SidebarSection title="CONTACT">
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
            <SidebarSection title="EDUCATION">
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
            <SidebarSection title="CERTIFICATIONS">
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

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            padding: "20px 24px 24px",
            color: "#2c3e50",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Section title="SUMMARY">
            <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.6" }}>
              {profile.summary}
            </p>
          </Section>

          <Section title="EXPERIENCE">
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
                    {exp.company && (
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        — {exp.company}
                      </span>
                    )}
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
            <Section title="PROJECTS">
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
                      {proj.title}
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
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#0e6e64",
                      fontWeight: "bold",
                      marginBottom: "2px",
                      textTransform: "uppercase",
                    }}
                  >
                    {proj.tag}
                  </div>
                  <p
                    style={{
                      margin: "2px 0",
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    <strong>Problem:</strong> {proj.problem}
                  </p>
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
                      Results:{" "}
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
                    Tech: {proj.tech.slice(0, 5).join(", ")}
                  </p>
                </div>
              ))}
            </Section>
          )}

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: "12px",
              borderTop: "1px solid rgba(182,220,214,0.25)",
              fontSize: "9.5px",
              color: "rgba(190,216,210,0.6)",
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "transparent",
            }}
          ></div>
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
      {/* Header Band */}
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

      {/* Body */}
      <div style={{ padding: "0 24px" }}>
        <Section title="SUMMARY">
          <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.6" }}>
            {profile.summary}
          </p>
        </Section>

        <Section title="EXPERIENCE">
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
                  {exp.company && (
                    <span style={{ fontWeight: "normal" }}>
                      {" "}
                      — {exp.company}
                    </span>
                  )}
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
          <Section title="SKILLS">
            <SkillsGrid techStack={techStack} />
          </Section>
        )}

        {profile.education && profile.education.length > 0 && (
          <Section title="EDUCATION">
            {profile.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "6px", fontSize: "12px" }}>
                <strong>{edu.degree}</strong> — {edu.school} ({edu.year})
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="PROJECTS">
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
                  <strong>Problem:</strong> {proj.problem}
                </p>
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
                    Results:{" "}
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
                  Tech: {proj.tech.join(", ")}
                </p>
              </div>
            ))}
          </Section>
        )}

        {certificates.length > 0 && (
          <Section title="CERTIFICATIONS">
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

        {/* Footer */}
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
