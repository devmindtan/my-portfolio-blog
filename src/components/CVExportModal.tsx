import { useState, useCallback, useEffect } from "react";
import { X, FileText, Download, Eye, Palette } from "lucide-react";
import type { Profile, Project, Certificate } from "../data/portfolio";

interface CVExportModalProps {
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  onClose: () => void;
}

type TemplateKey = "minimal" | "modern" | "terminal";

const templates: { key: TemplateKey; label: string; desc: string }[] = [
  {
    key: "minimal",
    label: "Minimal",
    desc: "Clean, single-column, traditional",
  },
  { key: "modern", label: "Modern", desc: "Two-column with sidebar" },
  { key: "terminal", label: "Terminal", desc: "Developer-themed, monospace" },
];

export default function CVExportModal({
  profile,
  projects,
  certificates,
  onClose,
}: CVExportModalProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateKey>("minimal");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  function generateHTML(): string {
    switch (selectedTemplate) {
      case "minimal":
        return generateMinimal();
      case "modern":
        return generateModern();
      case "terminal":
        return generateTerminal();
    }
  }

  function generateMinimal(): string {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV - ${profile.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,serif;color:#1a1a1a;padding:48px 64px;line-height:1.5;font-size:11pt}
h1{font-size:20pt;margin-bottom:2px;letter-spacing:-0.5pt}
.subtitle{font-size:10pt;color:#666;margin-bottom:16px}
.contact{font-size:9pt;color:#555;margin-bottom:24px;display:flex;flex-wrap:wrap;gap:8px 16px}
.section{margin-bottom:20px}
.section-title{font-size:11pt;font-weight:700;text-transform:uppercase;letter-spacing:1.5pt;border-bottom:1.5pt solid #1a1a1a;padding-bottom:4px;margin-bottom:10px}
.section p,.section li{font-size:10pt;line-height:1.6}
ul{padding-left:18px}
.job{margin-bottom:14px}
.job-header{display:flex;justify-content:space-between;align-items:baseline}
.job-title{font-weight:700;font-size:10.5pt}
.job-company{font-size:10pt;color:#333}
.job-period{font-size:9pt;color:#888;white-space:nowrap}
.project{margin-bottom:10px}
.project-title{font-weight:700;font-size:10pt}
.project-tag{font-size:8pt;color:#888;text-transform:uppercase;letter-spacing:0.5pt;margin-left:6px}
.project p{font-size:9.5pt;color:#333}
.results{display:flex;gap:16px;margin-top:4px}
.result-value{font-weight:700;font-size:10pt}
.result-label{font-size:8pt;color:#888;text-transform:uppercase}
.tech{font-size:8.5pt;color:#555;margin-top:3px}
</style></head><body>
<h1>${profile.name}</h1>
<div class="subtitle">${profile.title}</div>
<div class="contact">
<span>${profile.email}</span><span>${profile.phone}</span><span>${profile.website}</span><span>${profile.location}</span>
</div>
<div class="section"><div class="section-title">Summary</div><p>${profile.summary}</p></div>
<div class="section"><div class="section-title">Experience</div>
${profile.experience
  .map(
    (exp) => `<div class="job">
<div class="job-header"><div><span class="job-title">${exp.role}</span> <span class="job-company">at ${exp.company}</span></div><span class="job-period">${exp.period}</span></div>
<p>${exp.description}</p></div>`,
  )
  .join("")}
</div>
<div class="section"><div class="section-title">Selected Projects</div>
${projects
  .slice(0, 6)
  .map(
    (p) => `<div class="project">
<div><span class="project-title">${p.title}</span><span class="project-tag">${p.tag}</span></div>
<p>${p.problem}</p>
<div class="results">${p.results.map((r) => `<div><span class="result-value">${r.value}</span> <span class="result-label">${r.label}</span></div>`).join("")}</div>
<div class="tech">${p.tech.join(" · ")}</div></div>`,
  )
  .join("")}
</div>
<div class="section"><div class="section-title">Education</div>
${profile.education.map((e) => `<p><strong>${e.degree}</strong> — ${e.school} (${e.year})</p>`).join("")}
</div>
${
  certificates.length
    ? `<div class="section"><div class="section-title">Certifications</div>
${certificates.map((c) => `<p><strong>${c.name}</strong> — ${c.issuer} (${c.date})${c.credentialId ? ` · ${c.credentialId}` : ""}</p>`).join("")}
</div>`
    : ""
}
</body></html>`;
  }

  function generateModern(): string {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV - ${profile.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,sans-serif;color:#2d2d2d;display:flex;min-height:100vh;font-size:10pt;line-height:1.5}
.sidebar{width:240px;background:#1a1a2e;color:#e0e0e0;padding:36px 24px;flex-shrink:0}
.sidebar h1{font-size:16pt;color:#fff;margin-bottom:2px}
.sidebar .subtitle{font-size:9pt;color:#00e5a0;margin-bottom:20px}
.sidebar .avatar{width:100px;height:100px;border-radius:50%;object-fit:cover;margin-bottom:16px;border:3px solid #00e5a0}
.sidebar-section{margin-bottom:20px}
.sidebar-label{font-size:8pt;text-transform:uppercase;letter-spacing:1.5pt;color:#00e5a0;margin-bottom:6px;font-weight:600}
.sidebar-item{font-size:9pt;margin-bottom:4px;color:#ccc}
.main{flex:1;padding:36px 40px}
.section{margin-bottom:22px}
.section-title{font-size:11pt;font-weight:700;text-transform:uppercase;letter-spacing:1.5pt;color:#1a1a2e;border-bottom:2pt solid #00e5a0;padding-bottom:4px;margin-bottom:12px}
.job{margin-bottom:14px}
.job-header{display:flex;justify-content:space-between;align-items:baseline}
.job-title{font-weight:700;font-size:10.5pt}
.job-company{font-size:10pt;color:#555}
.job-period{font-size:9pt;color:#888}
.project{margin-bottom:10px;padding:8px;background:#f8f8fa;border-radius:4px}
.project-title{font-weight:700;font-size:10pt}
.project-tag{font-size:8pt;color:#00b37d;text-transform:uppercase;margin-left:6px}
.project p{font-size:9.5pt;color:#444;margin-top:2px}
.results{display:flex;gap:16px;margin-top:4px}
.result-value{font-weight:700;color:#1a1a2e}
.result-label{font-size:8pt;color:#888;text-transform:uppercase}
.tech{font-size:8.5pt;color:#666;margin-top:3px}
</style></head><body>
<div class="sidebar">
<img class="avatar" src="${profile.avatar}" alt="${profile.name}" />
<h1>${profile.name}</h1>
<div class="subtitle">${profile.title}</div>
<div class="sidebar-section"><div class="sidebar-label">Contact</div>
<div class="sidebar-item">${profile.email}</div>
<div class="sidebar-item">${profile.phone}</div>
<div class="sidebar-item">${profile.website}</div>
<div class="sidebar-item">${profile.location}</div>
</div>
<div class="sidebar-section"><div class="sidebar-label">Links</div>
<div class="sidebar-item">${profile.linkedin}</div>
<div class="sidebar-item">${profile.github}</div>
</div>
<div class="sidebar-section"><div class="sidebar-label">Education</div>
${profile.education.map((e) => `<div class="sidebar-item"><strong>${e.degree}</strong><br/>${e.school} (${e.year})</div>`).join("")}
</div>
${
  certificates.length
    ? `<div class="sidebar-section"><div class="sidebar-label">Certifications</div>
${certificates.map((c) => `<div class="sidebar-item"><strong>${c.name}</strong><br/>${c.issuer} (${c.date})</div>`).join("")}
</div>`
    : ""
}
</div>
<div class="main">
<div class="section"><div class="section-title">Summary</div><p>${profile.summary}</p></div>
<div class="section"><div class="section-title">Experience</div>
${profile.experience
  .map(
    (exp) => `<div class="job">
<div class="job-header"><div><span class="job-title">${exp.role}</span> <span class="job-company">at ${exp.company}</span></div><span class="job-period">${exp.period}</span></div>
<p>${exp.description}</p></div>`,
  )
  .join("")}
</div>
<div class="section"><div class="section-title">Selected Projects</div>
${projects
  .slice(0, 6)
  .map(
    (p) => `<div class="project">
<div><span class="project-title">${p.title}</span><span class="project-tag">${p.tag}</span></div>
<p>${p.problem}</p>
<div class="results">${p.results.map((r) => `<div><span class="result-value">${r.value}</span> <span class="result-label">${r.label}</span></div>`).join("")}</div>
<div class="tech">${p.tech.join(" · ")}</div></div>`,
  )
  .join("")}
</div>
</div>
</body></html>`;
  }

  function generateTerminal(): string {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV - ${profile.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Courier New',Consolas,monospace;background:#0a0a0f;color:#c8c8d4;padding:40px 48px;font-size:10pt;line-height:1.6}
.header{border:1px solid #2a2a3a;padding:20px;margin-bottom:20px;position:relative}
.header::before{content:'profile.json';position:absolute;top:-8px;left:12px;background:#0a0a0f;padding:0 6px;font-size:8pt;color:#00e5a0}
h1{font-size:16pt;color:#00e5a0;margin-bottom:4px}
.subtitle{font-size:10pt;color:#6b6b80}
.contact-line{font-size:9pt;color:#6b6b80;margin-top:8px}
.contact-line span{color:#00e5a0}
.section{margin-bottom:20px;border:1px solid #2a2a3a;padding:16px;position:relative}
.section::before{content:attr(data-label);position:absolute;top:-8px;left:12px;background:#0a0a0f;padding:0 6px;font-size:8pt;color:#40aaff;text-transform:uppercase;letter-spacing:1pt}
.section p,.section li{font-size:9.5pt}
ul{padding-left:16px;list-style:none}
ul li::before{content:'> ';color:#00e5a0}
.job{margin-bottom:12px;padding-bottom:12px;border-bottom:1px dashed #2a2a3a}
.job:last-child{border-bottom:none;padding-bottom:0}
.job-title{color:#00e5a0;font-weight:700}
.job-company{color:#c8c8d4}
.job-period{color:#6b6b80;float:right}
.project{margin-bottom:10px}
.project-title{color:#00e5a0;font-weight:700}
.project-tag{color:#f0c040;font-size:8pt;text-transform:uppercase;margin-left:6px}
.results{display:flex;gap:16px;margin-top:4px}
.result-value{color:#00e5a0;font-weight:700}
.result-label{color:#6b6b80;font-size:8pt;text-transform:uppercase}
.tech{color:#6b6b80;font-size:8.5pt;margin-top:3px}
.tech::before{content:'stack: ';color:#40aaff}
.comment{color:#6b6b80;font-style:italic;font-size:9pt}
.comment::before{content:'// ';color:#f0c040}
</style></head><body>
<div class="header">
<h1>${profile.name}</h1>
<div class="subtitle">${profile.title}</div>
<div class="contact-line">
<span>email:</span> ${profile.email} | <span>phone:</span> ${profile.phone} | <span>web:</span> ${profile.website} | <span>loc:</span> ${profile.location}
</div>
</div>
<div class="section" data-label="summary">
<p>${profile.summary}</p>
</div>
<div class="section" data-label="experience">
${profile.experience
  .map(
    (exp) => `<div class="job">
<span class="job-period">${exp.period}</span>
<div><span class="job-title">${exp.role}</span> <span class="job-company">@ ${exp.company}</span></div>
<p>${exp.description}</p>
</div>`,
  )
  .join("")}
</div>
<div class="section" data-label="projects">
${projects
  .slice(0, 6)
  .map(
    (p) => `<div class="project">
<span class="project-title">${p.title}</span><span class="project-tag">${p.tag}</span>
<p>${p.problem}</p>
<div class="results">${p.results.map((r) => `<div><span class="result-value">${r.value}</span> <span class="result-label">${r.label}</span></div>`).join("")}</div>
<div class="tech">${p.tech.join(" · ")}</div>
<div class="comment">${p.insight}</div>
</div>`,
  )
  .join("")}
</div>
<div class="section" data-label="education">
${profile.education.map((e) => `<p><span class="job-title">${e.degree}</span> — ${e.school} (${e.year})</p>`).join("")}
</div>
${
  certificates.length
    ? `<div class="section" data-label="certifications">
${certificates.map((c) => `<p><span class="job-title">${c.name}</span> — ${c.issuer} (${c.date})${c.credentialId ? ` <span class="tech">${c.credentialId}</span>` : ""}</p>`).join("")}
</div>`
    : ""
}
</body></html>`;
  }

  function handlePreview() {
    const html = generateHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  function handleDownload() {
    const html = generateHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CV_${profile.name.replace(/\s+/g, "_")}_${selectedTemplate}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-terminal-bg/80 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-y-auto card-base rounded-t-sm sm:rounded-sm animate-slide-up"
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
          {/* Template selection */}
          <div>
            <span className="section-label text-terminal-info/70 flex items-center gap-1.5">
              <Palette size={10} />
              select template
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              {templates.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelectedTemplate(t.key)}
                  className={`p-3 border rounded-sm text-left transition-all duration-200
                    ${
                      selectedTemplate === t.key
                        ? "border-terminal-accent/40 bg-terminal-accent/5"
                        : "border-terminal-border/40 hover:border-terminal-borderHover"
                    }`}
                >
                  <span
                    className={`text-xs font-semibold block ${selectedTemplate === t.key ? "text-terminal-accent" : "text-terminal-text"}`}
                  >
                    {t.label}
                  </span>
                  <span className="text-[9px] text-terminal-muted mt-0.5 block">
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Template preview card */}
          <div className="card-base p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-terminal-muted uppercase tracking-wider">
                preview
              </span>
              <span className="text-[9px] text-terminal-accent/50 tabular-nums">
                {selectedTemplate}.html
              </span>
            </div>
            <TemplatePreview template={selectedTemplate} profile={profile} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handlePreview}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-wider
                         border border-terminal-border/50 text-terminal-muted rounded-sm
                         hover:border-terminal-accent/30 hover:text-terminal-accent transition-all duration-200"
            >
              <Eye size={12} />
              preview in browser
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-wider
                         bg-terminal-accent/10 border border-terminal-accent/30 text-terminal-accent rounded-sm
                         hover:bg-terminal-accent/20 transition-all duration-200"
            >
              <Download size={12} />
              download html
            </button>
          </div>

          {/* Note */}
          <p className="text-[9px] text-terminal-muted/40 text-center">
            Open downloaded HTML in browser, then Ctrl+P to save as PDF
          </p>
        </div>
      </div>
    </div>
  );
}

function TemplatePreview({
  template,
  profile,
}: {
  template: TemplateKey;
  profile: Profile;
}) {
  if (template === "minimal") {
    return (
      <div
        className="space-y-1.5 text-[9px]"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <div className="font-bold text-xs text-terminal-text">
          {profile.name}
        </div>
        <div className="text-terminal-muted">{profile.title}</div>
        <div className="text-terminal-muted/50">
          {profile.email} · {profile.phone}
        </div>
        <div className="border-t border-terminal-border/20 pt-1.5 text-terminal-text/60 leading-relaxed line-clamp-3">
          {profile.summary}
        </div>
      </div>
    );
  }
  if (template === "modern") {
    return (
      <div className="flex gap-3 text-[9px]">
        <div className="w-16 flex-shrink-0 bg-terminal-surface rounded-sm p-2 space-y-1">
          <div className="w-8 h-8 rounded-full bg-terminal-border/30 mx-auto" />
          <div className="text-center text-terminal-accent text-[8px] font-bold">
            {profile.name.split(" ")[0]}
          </div>
        </div>
        <div className="space-y-1">
          <div className="font-bold text-xs text-terminal-text">
            {profile.name}
          </div>
          <div className="text-terminal-muted">{profile.title}</div>
          <div className="text-terminal-text/60 leading-relaxed line-clamp-2">
            {profile.summary}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="space-y-1.5 text-[9px]"
      style={{ fontFamily: "Consolas, monospace" }}
    >
      <div className="text-terminal-accent font-bold text-xs">{`> whoami`}</div>
      <div className="text-terminal-text">
        {profile.name} — {profile.title}
      </div>
      <div className="text-terminal-muted/50">{`> cat contact.txt`}</div>
      <div className="text-terminal-text/60">
        {profile.email} · {profile.location}
      </div>
      <div className="text-terminal-muted/30 italic">{`// ${profile.summary.slice(0, 80)}...`}</div>
    </div>
  );
}
