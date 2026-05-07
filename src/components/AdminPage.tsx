import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Download,
  X,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";
import type {
  Project,
  Certificate,
  TechItem,
  Stat,
  Profile,
  ExperienceEntry,
} from "../data/portfolio.types";
import { portfolioDataEn } from "../data/portfolio.en";
import { portfolioDataVi } from "../data/portfolio.vi";
import { categoryLabels } from "../data/portfolio.en";
import {
  downloadProjectsTs,
  downloadCertificatesTs,
  downloadTechStackTs,
  downloadStatsTs,
  downloadProfileTs,
} from "../lib/tsGenerator";

// ── LocalStorage helpers ───────────────────────────────────────────────────────
function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function saveLS(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Types ──────────────────────────────────────────────────────────────────────
type TabKey = "projects" | "certificates" | "techstack" | "stats" | "profile";
type Lang = "en" | "vi";

// ── Shared UI Atoms ────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] uppercase tracking-wider text-terminal-muted mb-1">
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  readOnly,
  type = "text",
  className = "",
}: {
  value: string | number;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full bg-terminal-surface border border-terminal-border/50 text-terminal-text text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-terminal-accent/50 focus:ring-1 focus:ring-terminal-accent/20 disabled:opacity-50 ${readOnly ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-terminal-surface border border-terminal-border/50 text-terminal-text text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-terminal-accent/50 focus:ring-1 focus:ring-terminal-accent/20 resize-y"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-terminal-surface border border-terminal-border/50 text-terminal-text text-xs px-3 py-2 rounded-sm focus:outline-none focus:border-terminal-accent/50 appearance-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function FieldRow({
  label,
  children,
  half,
}: {
  label: string;
  children: React.ReactNode;
  half?: boolean;
}) {
  return (
    <div className={half ? "" : "mb-4"}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ── Dynamic String List ─────────────────────────────────────────────────────────
function DynStringList({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const add = () => onChange([...items, ""]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <Label>{label}</Label>
        <button
          type="button"
          onClick={add}
          className="text-[10px] text-terminal-accent hover:text-terminal-accent/70 flex items-center gap-1 transition-colors"
        >
          <Plus size={11} /> Add
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-1.5">
            <Input
              value={item}
              onChange={(v) => update(i, v)}
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="px-2 text-terminal-muted hover:text-red-400 transition-colors border border-terminal-border/40 rounded-sm"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-[10px] text-terminal-muted italic">
            No items. Click Add.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Dynamic Result Pairs ────────────────────────────────────────────────────────
function DynResultList({
  items,
  onChange,
}: {
  items: { value: string; label: string }[];
  onChange: (items: { value: string; label: string }[]) => void;
}) {
  const add = () => onChange([...items, { value: "", label: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: "value" | "label", val: string) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <Label>Results</Label>
        <button
          type="button"
          onClick={add}
          className="text-[10px] text-terminal-accent hover:text-terminal-accent/70 flex items-center gap-1 transition-colors"
        >
          <Plus size={11} /> Add
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-1.5">
            <div className="w-1/3">
              <Input
                value={item.value}
                onChange={(v) => update(i, "value", v)}
                placeholder="99.9%"
              />
            </div>
            <div className="flex-1">
              <Input
                value={item.label}
                onChange={(v) => update(i, "label", v)}
                placeholder="uptime"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="px-2 text-terminal-muted hover:text-red-400 transition-colors border border-terminal-border/40 rounded-sm"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-[10px] text-terminal-muted italic">
            No results. Click Add.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Modal shell ─────────────────────────────────────────────────────────────────
function Modal({
  title,
  onClose,
  onSave,
  children,
  error,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
  error?: string;
}) {
  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-terminal-card border border-terminal-border/50 rounded-sm w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-terminal-border/40 flex-shrink-0">
          <span className="text-xs font-mono uppercase tracking-widest text-terminal-accent">
            {title}
          </span>
          <button
            onClick={onClose}
            className="text-terminal-muted hover:text-terminal-text transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        {/* Modal body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {/* Error + footer */}
        <div className="px-5 py-3 border-t border-terminal-border/40 flex-shrink-0">
          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle size={12} /> {error}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[10px] uppercase tracking-wider border border-terminal-border/40 text-terminal-muted hover:text-terminal-text hover:border-terminal-border rounded-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 text-[10px] uppercase tracking-wider bg-terminal-accent/20 border border-terminal-accent/40 text-terminal-accent hover:bg-terminal-accent/30 rounded-sm transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm ──────────────────────────────────────────────────────────────
function DeleteConfirm({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-terminal-card border border-red-500/40 rounded-sm w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-red-400" />
          <span className="text-sm font-mono text-red-400">Confirm Delete</span>
        </div>
        <p className="text-xs text-terminal-muted mb-5 leading-relaxed">
          Delete <span className="text-terminal-text font-mono">"{name}"</span>?
          This cannot be undone in the editor (source files are unchanged until
          you download).
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[10px] uppercase tracking-wider border border-terminal-border/40 text-terminal-muted hover:text-terminal-text rounded-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-[10px] uppercase tracking-wider bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 rounded-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tab header bar ──────────────────────────────────────────────────────────────
function TabHeader({
  title,
  count,
  onAdd,
  onDownload,
  onReset,
  lang,
  showLangBadge,
}: {
  title: string;
  count: number;
  onAdd: () => void;
  onDownload: () => void;
  onReset: () => void;
  lang?: Lang;
  showLangBadge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-mono uppercase tracking-widest text-terminal-text">
          {title}
        </h2>
        <span className="text-[10px] text-terminal-muted bg-terminal-surface px-2 py-0.5 rounded-sm border border-terminal-border/30">
          {count}
        </span>
        {showLangBadge && lang && (
          <span className="text-[10px] uppercase tracking-wider text-terminal-accent bg-terminal-accent/10 border border-terminal-accent/20 px-2 py-0.5 rounded-sm">
            {lang}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          title="Reset to source data"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider border border-terminal-border/40 text-terminal-muted hover:text-terminal-text hover:border-terminal-border rounded-sm transition-colors"
        >
          <RotateCcw size={11} /> Reset
        </button>
        <button
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider border border-terminal-border/40 text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/30 rounded-sm transition-colors"
        >
          <Download size={11} /> Download .ts
        </button>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider bg-terminal-accent/20 border border-terminal-accent/40 text-terminal-accent hover:bg-terminal-accent/30 rounded-sm transition-colors"
        >
          <Plus size={11} /> Add
        </button>
      </div>
    </div>
  );
}

// ── PROJECTS TAB ───────────────────────────────────────────────────────────────
const EMPTY_PROJECT: Project = {
  id: "",
  title: "",
  tag: "",
  problem: "",
  actions: [""],
  results: [{ value: "", label: "" }],
  insight: "",
  tech: [""],
  sort_order: 0,
  created_at: new Date().toISOString().split("T")[0],
};

function ProjectForm({
  data,
  onChange,
  isNew,
}: {
  data: Project;
  onChange: (d: Project) => void;
  isNew: boolean;
}) {
  const set = (field: keyof Project, val: unknown) =>
    onChange({ ...data, [field]: val });

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <FieldRow label="ID" half>
          <Input
            value={data.id}
            onChange={(v) => set("id", v)}
            placeholder="p13"
            readOnly={!isNew}
          />
        </FieldRow>
        <FieldRow label="Sort Order" half>
          <Input
            type="number"
            value={data.sort_order}
            onChange={(v) => set("sort_order", Number(v))}
          />
        </FieldRow>
        <FieldRow label="Created At" half>
          <Input
            type="date"
            value={data.created_at}
            onChange={(v) => set("created_at", v)}
          />
        </FieldRow>
      </div>
      <FieldRow label="Title">
        <Input
          value={data.title}
          onChange={(v) => set("title", v)}
          placeholder="Payment Gateway Migration"
        />
      </FieldRow>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <FieldRow label="Tag" half>
          <Input
            value={data.tag}
            onChange={(v) => set("tag", v)}
            placeholder="fintech"
          />
        </FieldRow>
        <FieldRow label="Blog URL (optional)" half>
          <Input
            value={data.blogUrl ?? ""}
            onChange={(v) => set("blogUrl", v || undefined)}
            placeholder="/blog/..."
          />
        </FieldRow>
      </div>
      <FieldRow label="Problem">
        <Textarea
          value={data.problem}
          onChange={(v) => set("problem", v)}
          placeholder="Describe the problem..."
          rows={3}
        />
      </FieldRow>
      <DynStringList
        label="Actions"
        items={data.actions}
        onChange={(v) => set("actions", v)}
        placeholder="What you did..."
      />
      <DynResultList items={data.results} onChange={(v) => set("results", v)} />
      <FieldRow label="Insight">
        <Textarea
          value={data.insight}
          onChange={(v) => set("insight", v)}
          placeholder="Key takeaway..."
          rows={2}
        />
      </FieldRow>
      <DynStringList
        label="Tech Stack"
        items={data.tech}
        onChange={(v) => set("tech", v)}
        placeholder="Go, Kafka, ..."
      />
    </>
  );
}

function ProjectsTab({
  projects,
  setProjects,
  lang,
  onReset,
}: {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  lang: Lang;
  onReset: () => void;
}) {
  const [editing, setEditing] = useState<{
    item: Project;
    isNew: boolean;
  } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>(EMPTY_PROJECT);
  const [error, setError] = useState("");

  const openAdd = () => {
    const nextOrder =
      projects.length > 0
        ? Math.max(...projects.map((p) => p.sort_order)) + 1
        : 1;
    const nextId = `p${String(nextOrder).padStart(2, "0")}`;
    setFormData({ ...EMPTY_PROJECT, id: nextId, sort_order: nextOrder });
    setEditing({ item: EMPTY_PROJECT, isNew: true });
    setError("");
  };

  const openEdit = (p: Project) => {
    setFormData({ ...p });
    setEditing({ item: p, isNew: false });
    setError("");
  };

  const save = () => {
    if (!formData.id.trim()) {
      setError("ID is required.");
      return;
    }
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (editing?.isNew && projects.some((p) => p.id === formData.id.trim())) {
      setError("ID already exists.");
      return;
    }
    setProjects((prev) => {
      if (editing?.isNew) {
        return [...prev, formData].sort((a, b) => a.sort_order - b.sort_order);
      }
      return prev.map((p) => (p.id === formData.id ? formData : p));
    });
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setProjects((prev) => prev.filter((p) => p.id !== deleting));
    setDeleting(null);
  };

  const moveUp = (id: string) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next.map((p, i) => ({ ...p, sort_order: i + 1 }));
    });
  };

  const moveDown = (id: string) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next.map((p, i) => ({ ...p, sort_order: i + 1 }));
    });
  };

  return (
    <div>
      <TabHeader
        title="Projects"
        count={projects.length}
        onAdd={openAdd}
        onDownload={() => downloadProjectsTs(projects, lang)}
        onReset={onReset}
        lang={lang}
        showLangBadge
      />

      <div className="space-y-2">
        {projects.map((p, idx) => (
          <div
            key={p.id}
            className="border border-terminal-border/30 rounded-sm bg-terminal-surface/30 px-4 py-3 flex items-center gap-3 hover:border-terminal-border/50 transition-colors"
          >
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveUp(p.id)}
                disabled={idx === 0}
                className="text-terminal-muted hover:text-terminal-accent disabled:opacity-20 transition-colors"
              >
                <ChevronUp size={12} />
              </button>
              <button
                onClick={() => moveDown(p.id)}
                disabled={idx === projects.length - 1}
                className="text-terminal-muted hover:text-terminal-accent disabled:opacity-20 transition-colors"
              >
                <ChevronDown size={12} />
              </button>
            </div>

            <span className="text-[10px] font-mono text-terminal-muted w-8 flex-shrink-0">
              {String(p.sort_order).padStart(2, "0")}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-terminal-text font-medium truncate">
                  {p.title}
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-terminal-accent/10 text-terminal-accent/80 border border-terminal-accent/20 rounded-sm flex-shrink-0">
                  {p.tag}
                </span>
              </div>
              <p className="text-[10px] text-terminal-muted mt-0.5 truncate">
                {p.id} · {p.created_at} · {p.tech.slice(0, 3).join(", ")}
                {p.tech.length > 3 ? "…" : ""}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => openEdit(p)}
                className="p-1.5 text-terminal-muted hover:text-terminal-accent border border-terminal-border/30 rounded-sm transition-colors hover:border-terminal-accent/30"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={() => setDeleting(p.id)}
                className="p-1.5 text-terminal-muted hover:text-red-400 border border-terminal-border/30 rounded-sm transition-colors hover:border-red-500/30"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          title={editing.isNew ? "Add Project" : `Edit — ${formData.id}`}
          onClose={() => setEditing(null)}
          onSave={save}
          error={error}
        >
          <ProjectForm
            data={formData}
            onChange={setFormData}
            isNew={editing.isNew}
          />
        </Modal>
      )}

      {deleting && (
        <DeleteConfirm
          name={projects.find((p) => p.id === deleting)?.title ?? deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ── CERTIFICATES TAB ───────────────────────────────────────────────────────────
const EMPTY_CERT: Certificate = {
  name: "",
  issuer: "",
  date: "",
  credentialId: "",
  url: "",
  imageUrl: "",
};

function CertForm({
  data,
  onChange,
}: {
  data: Certificate;
  onChange: (d: Certificate) => void;
}) {
  const set = (field: keyof Certificate, val: string) =>
    onChange({ ...data, [field]: val });
  return (
    <>
      <FieldRow label="Name">
        <Input
          value={data.name}
          onChange={(v) => set("name", v)}
          placeholder="AWS Solutions Architect"
        />
      </FieldRow>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <FieldRow label="Issuer" half>
          <Input
            value={data.issuer}
            onChange={(v) => set("issuer", v)}
            placeholder="Amazon Web Services"
          />
        </FieldRow>
        <FieldRow label="Date" half>
          <Input
            value={data.date}
            onChange={(v) => set("date", v)}
            placeholder="01/2025"
          />
        </FieldRow>
      </div>
      <FieldRow label="Credential ID (optional)">
        <Input
          value={data.credentialId ?? ""}
          onChange={(v) => set("credentialId", v)}
        />
      </FieldRow>
      <FieldRow label="URL (optional)">
        <Input
          value={data.url ?? ""}
          onChange={(v) => set("url", v)}
          placeholder="https://..."
        />
      </FieldRow>
      <FieldRow label="Image URL (optional)">
        <Input
          value={data.imageUrl ?? ""}
          onChange={(v) => set("imageUrl", v)}
          placeholder="https://..."
        />
      </FieldRow>
    </>
  );
}

function CertificatesTab({
  certs,
  setCerts,
  onReset,
}: {
  certs: Certificate[];
  setCerts: React.Dispatch<React.SetStateAction<Certificate[]>>;
  onReset: () => void;
}) {
  const [editing, setEditing] = useState<{
    idx: number;
    isNew: boolean;
  } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [formData, setFormData] = useState<Certificate>(EMPTY_CERT);
  const [error, setError] = useState("");

  const openAdd = () => {
    setFormData(EMPTY_CERT);
    setEditing({ idx: -1, isNew: true });
    setError("");
  };
  const openEdit = (i: number) => {
    setFormData({ ...certs[i] });
    setEditing({ idx: i, isNew: false });
    setError("");
  };
  const save = () => {
    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }
    setCerts((prev) => {
      if (editing?.isNew) return [...prev, formData];
      const next = [...prev];
      next[editing!.idx] = formData;
      return next;
    });
    setEditing(null);
  };

  return (
    <div>
      <TabHeader
        title="Certificates"
        count={certs.length}
        onAdd={openAdd}
        onDownload={() => downloadCertificatesTs(certs)}
        onReset={onReset}
      />
      <div className="space-y-2">
        {certs.map((c, i) => (
          <div
            key={i}
            className="border border-terminal-border/30 rounded-sm bg-terminal-surface/30 px-4 py-3 flex items-center gap-3 hover:border-terminal-border/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs text-terminal-text font-medium truncate">
                {c.name}
              </div>
              <p className="text-[10px] text-terminal-muted mt-0.5">
                {c.issuer} · {c.date}
              </p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => openEdit(i)}
                className="p-1.5 text-terminal-muted hover:text-terminal-accent border border-terminal-border/30 rounded-sm transition-colors hover:border-terminal-accent/30"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={() => setDeleting(i)}
                className="p-1.5 text-terminal-muted hover:text-red-400 border border-terminal-border/30 rounded-sm transition-colors hover:border-red-500/30"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          title={editing.isNew ? "Add Certificate" : "Edit Certificate"}
          onClose={() => setEditing(null)}
          onSave={save}
          error={error}
        >
          <CertForm data={formData} onChange={setFormData} />
        </Modal>
      )}
      {deleting !== null && (
        <DeleteConfirm
          name={certs[deleting]?.name ?? ""}
          onConfirm={() => {
            setCerts((prev) => prev.filter((_, idx) => idx !== deleting));
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ── TECH STACK TAB ─────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = Object.entries(categoryLabels).map(([k, v]) => ({
  value: k,
  label: v,
}));

const EMPTY_TECH: TechItem = { name: "", category: "lang" };

function TechStackTab({
  stack,
  setStack,
  onReset,
}: {
  stack: TechItem[];
  setStack: React.Dispatch<React.SetStateAction<TechItem[]>>;
  onReset: () => void;
}) {
  const [editing, setEditing] = useState<{
    idx: number;
    isNew: boolean;
  } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [formData, setFormData] = useState<TechItem>(EMPTY_TECH);
  const [error, setError] = useState("");

  const grouped = CATEGORY_OPTIONS.map((cat) => ({
    cat,
    items: stack
      .map((t, idx) => ({ ...t, idx }))
      .filter((t) => t.category === cat.value),
  })).filter((g) => g.items.length > 0);

  const openAdd = () => {
    setFormData(EMPTY_TECH);
    setEditing({ idx: -1, isNew: true });
    setError("");
  };
  const openEdit = (i: number) => {
    setFormData({ ...stack[i] });
    setEditing({ idx: i, isNew: false });
    setError("");
  };
  const save = () => {
    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }
    setStack((prev) => {
      if (editing?.isNew) return [...prev, formData];
      const next = [...prev];
      next[editing!.idx] = formData;
      return next;
    });
    setEditing(null);
  };

  return (
    <div>
      <TabHeader
        title="Tech Stack"
        count={stack.length}
        onAdd={openAdd}
        onDownload={() => downloadTechStackTs(stack)}
        onReset={onReset}
      />
      <div className="space-y-4">
        {grouped.map(({ cat, items }) => (
          <div key={cat.value}>
            <p className="text-[10px] uppercase tracking-wider text-terminal-muted mb-2">
              {cat.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map(({ name, idx }) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-terminal-surface border border-terminal-border/40 rounded-sm px-3 py-1.5 text-xs"
                >
                  <span className="text-terminal-text">{name}</span>
                  <button
                    onClick={() => openEdit(idx)}
                    className="text-terminal-muted hover:text-terminal-accent ml-1 transition-colors"
                  >
                    <Pencil size={10} />
                  </button>
                  <button
                    onClick={() => setDeleting(idx)}
                    className="text-terminal-muted hover:text-red-400 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          title={editing.isNew ? "Add Tech" : "Edit Tech"}
          onClose={() => setEditing(null)}
          onSave={save}
          error={error}
        >
          <FieldRow label="Name">
            <Input
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              placeholder="TypeScript"
            />
          </FieldRow>
          <FieldRow label="Category">
            <Select
              value={formData.category}
              onChange={(v) => setFormData({ ...formData, category: v })}
              options={CATEGORY_OPTIONS}
            />
          </FieldRow>
        </Modal>
      )}
      {deleting !== null && (
        <DeleteConfirm
          name={stack[deleting]?.name ?? ""}
          onConfirm={() => {
            setStack((prev) => prev.filter((_, idx) => idx !== deleting));
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ── STATS TAB ──────────────────────────────────────────────────────────────────
function StatsTab({
  stats,
  setStats,
  onReset,
}: {
  stats: Stat[];
  setStats: React.Dispatch<React.SetStateAction<Stat[]>>;
  onReset: () => void;
}) {
  const [editing, setEditing] = useState<{
    idx: number;
    isNew: boolean;
  } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [formData, setFormData] = useState<Stat>({ value: "", label: "" });
  const [error, setError] = useState("");

  const openAdd = () => {
    setFormData({ value: "", label: "" });
    setEditing({ idx: -1, isNew: true });
    setError("");
  };
  const openEdit = (i: number) => {
    setFormData({ ...stats[i] });
    setEditing({ idx: i, isNew: false });
    setError("");
  };
  const save = () => {
    if (!formData.value.trim() || !formData.label.trim()) {
      setError("Value and label are required.");
      return;
    }
    setStats((prev) => {
      if (editing?.isNew) return [...prev, formData];
      const next = [...prev];
      next[editing!.idx] = formData;
      return next;
    });
    setEditing(null);
  };

  return (
    <div>
      <TabHeader
        title="Stats"
        count={stats.length}
        onAdd={openAdd}
        onDownload={() => downloadStatsTs(stats)}
        onReset={onReset}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <div
            key={i}
            className="border border-terminal-border/30 rounded-sm bg-terminal-surface/30 p-4 flex items-start justify-between"
          >
            <div>
              <div className="text-lg font-mono text-terminal-accent">
                {s.value}
              </div>
              <div className="text-[10px] text-terminal-muted uppercase tracking-wider mt-0.5">
                {s.label}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => openEdit(i)}
                className="p-1 text-terminal-muted hover:text-terminal-accent transition-colors"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={() => setDeleting(i)}
                className="p-1 text-terminal-muted hover:text-red-400 transition-colors"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          title={editing.isNew ? "Add Stat" : "Edit Stat"}
          onClose={() => setEditing(null)}
          onSave={save}
          error={error}
        >
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Value" half>
              <Input
                value={formData.value}
                onChange={(v) => setFormData({ ...formData, value: v })}
                placeholder="2+"
              />
            </FieldRow>
            <FieldRow label="Label" half>
              <Input
                value={formData.label}
                onChange={(v) => setFormData({ ...formData, label: v })}
                placeholder="years shipping"
              />
            </FieldRow>
          </div>
        </Modal>
      )}
      {deleting !== null && (
        <DeleteConfirm
          name={`${stats[deleting]?.value} ${stats[deleting]?.label}`}
          onConfirm={() => {
            setStats((prev) => prev.filter((_, idx) => idx !== deleting));
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

// ── PROFILE TAB ────────────────────────────────────────────────────────────────
const EMPTY_EXP: ExperienceEntry = {
  role: "",
  organization: "",
  type: "project",
  period: "",
  description: "",
  links: [],
};

function ExperienceEntryEditor({
  entry,
  onChange,
  onDelete,
  idx,
}: {
  entry: ExperienceEntry;
  onChange: (e: ExperienceEntry) => void;
  onDelete: () => void;
  idx: number;
}) {
  const [open, setOpen] = useState(idx === 0);
  const set = (field: keyof ExperienceEntry, val: unknown) =>
    onChange({ ...entry, [field]: val });

  return (
    <div className="border border-terminal-border/30 rounded-sm mb-2 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-terminal-surface/40 hover:bg-terminal-surface/60 text-left transition-colors"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <ChevronDown size={12} className="text-terminal-muted" />
          ) : (
            <ChevronUp size={12} className="text-terminal-muted" />
          )}
          <span className="text-xs text-terminal-text">
            {entry.role || "(untitled)"}{" "}
            <span className="text-terminal-muted">
              @ {entry.organization || "—"}
            </span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 bg-terminal-surface border border-terminal-border/30 rounded-sm text-terminal-muted">
            {entry.type}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-terminal-muted hover:text-red-400 transition-colors p-1"
        >
          <Trash2 size={12} />
        </button>
      </button>

      {open && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Role" half>
              <Input
                value={entry.role}
                onChange={(v) => set("role", v)}
                placeholder="Senior Engineer"
              />
            </FieldRow>
            <FieldRow label="Organization" half>
              <Input
                value={entry.organization}
                onChange={(v) => set("organization", v)}
              />
            </FieldRow>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Type" half>
              <Select
                value={entry.type}
                onChange={(v) => set("type", v as ExperienceEntry["type"])}
                options={[
                  { value: "company", label: "Company" },
                  { value: "project", label: "Project" },
                ]}
              />
            </FieldRow>
            <FieldRow label="Period" half>
              <Input
                value={entry.period}
                onChange={(v) => set("period", v)}
                placeholder="01/2024 - present"
              />
            </FieldRow>
          </div>
          <FieldRow label="Description">
            <Textarea
              value={entry.description}
              onChange={(v) => set("description", v)}
              rows={3}
            />
          </FieldRow>
          {/* Links */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Links</Label>
              <button
                type="button"
                onClick={() =>
                  set("links", [
                    ...(entry.links ?? []),
                    { label: "", href: "" },
                  ])
                }
                className="text-[10px] text-terminal-accent flex items-center gap-1"
              >
                <Plus size={11} /> Add Link
              </button>
            </div>
            <div className="space-y-1.5">
              {(entry.links ?? []).map((link, li) => (
                <div key={li} className="flex gap-1.5">
                  <div className="w-1/4">
                    <Input
                      value={link.label}
                      onChange={(v) => {
                        const next = [...(entry.links ?? [])];
                        next[li] = { ...next[li], label: v };
                        set("links", next);
                      }}
                      placeholder="github"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={link.href}
                      onChange={(v) => {
                        const next = [...(entry.links ?? [])];
                        next[li] = { ...next[li], href: v };
                        set("links", next);
                      }}
                      placeholder="https://..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      set(
                        "links",
                        (entry.links ?? []).filter((_, j) => j !== li),
                      );
                    }}
                    className="px-2 text-terminal-muted hover:text-red-400 border border-terminal-border/40 rounded-sm transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileTab({
  profile,
  setProfile,
  lang,
  onReset,
}: {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  lang: Lang;
  onReset: () => void;
}) {
  const set = (field: keyof Profile, val: unknown) =>
    setProfile((prev) => ({ ...prev, [field]: val }));

  const addExp = () =>
    set("experience", [...profile.experience, { ...EMPTY_EXP }]);
  const updateExp = (i: number, e: ExperienceEntry) =>
    set(
      "experience",
      profile.experience.map((x, idx) => (idx === i ? e : x)),
    );
  const deleteExp = (i: number) =>
    set(
      "experience",
      profile.experience.filter((_, idx) => idx !== i),
    );

  const addEdu = () =>
    set("education", [
      ...profile.education,
      { degree: "", school: "", year: "" },
    ]);
  const updateEdu = (
    i: number,
    field: "degree" | "school" | "year",
    val: string,
  ) =>
    set(
      "education",
      profile.education.map((e, idx) =>
        idx === i ? { ...e, [field]: val } : e,
      ),
    );
  const deleteEdu = (i: number) =>
    set(
      "education",
      profile.education.filter((_, idx) => idx !== i),
    );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-mono uppercase tracking-widest text-terminal-text">
            Profile
          </h2>
          <span className="text-[10px] uppercase tracking-wider text-terminal-accent bg-terminal-accent/10 border border-terminal-accent/20 px-2 py-0.5 rounded-sm">
            {lang}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider border border-terminal-border/40 text-terminal-muted hover:text-terminal-text rounded-sm transition-colors"
          >
            <RotateCcw size={11} /> Reset
          </button>
          <button
            onClick={() => downloadProfileTs(profile, lang)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider border border-terminal-border/40 text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/30 rounded-sm transition-colors"
          >
            <Download size={11} /> Download .ts
          </button>
        </div>
      </div>

      {/* Basic info */}
      <section className="mb-6">
        <p className="text-[10px] uppercase tracking-wider text-terminal-muted mb-3 pb-1 border-b border-terminal-border/30">
          Basic Info
        </p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FieldRow label="Name" half>
            <Input value={profile.name} onChange={(v) => set("name", v)} />
          </FieldRow>
          <FieldRow label="Title" half>
            <Input value={profile.title} onChange={(v) => set("title", v)} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FieldRow label="Location" half>
            <Input
              value={profile.location}
              onChange={(v) => set("location", v)}
            />
          </FieldRow>
          <FieldRow label="Email" half>
            <Input value={profile.email} onChange={(v) => set("email", v)} />
          </FieldRow>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FieldRow label="Phone" half>
            <Input value={profile.phone} onChange={(v) => set("phone", v)} />
          </FieldRow>
          <FieldRow label="Website" half>
            <Input
              value={profile.website}
              onChange={(v) => set("website", v)}
            />
          </FieldRow>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <FieldRow label="LinkedIn" half>
            <Input
              value={profile.linkedin}
              onChange={(v) => set("linkedin", v)}
            />
          </FieldRow>
          <FieldRow label="GitHub" half>
            <Input value={profile.github} onChange={(v) => set("github", v)} />
          </FieldRow>
        </div>
        <FieldRow label="Avatar URL">
          <Input value={profile.avatar} onChange={(v) => set("avatar", v)} />
        </FieldRow>
      </section>

      {/* Summary & Detail */}
      <section className="mb-6">
        <p className="text-[10px] uppercase tracking-wider text-terminal-muted mb-3 pb-1 border-b border-terminal-border/30">
          Bio
        </p>
        <FieldRow label="Summary">
          <Textarea
            value={profile.summary}
            onChange={(v) => set("summary", v)}
            rows={4}
          />
        </FieldRow>
        <FieldRow label="Detail">
          <Textarea
            value={profile.detail}
            onChange={(v) => set("detail", v)}
            rows={5}
          />
        </FieldRow>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 pb-1 border-b border-terminal-border/30">
          <p className="text-[10px] uppercase tracking-wider text-terminal-muted">
            Experience ({profile.experience.length})
          </p>
          <button
            onClick={addExp}
            className="text-[10px] text-terminal-accent flex items-center gap-1 hover:text-terminal-accent/70 transition-colors"
          >
            <Plus size={11} /> Add
          </button>
        </div>
        {profile.experience.map((exp, i) => (
          <ExperienceEntryEditor
            key={i}
            idx={i}
            entry={exp}
            onChange={(e) => updateExp(i, e)}
            onDelete={() => deleteExp(i)}
          />
        ))}
      </section>

      {/* Education */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 pb-1 border-b border-terminal-border/30">
          <p className="text-[10px] uppercase tracking-wider text-terminal-muted">
            Education ({profile.education.length})
          </p>
          <button
            onClick={addEdu}
            className="text-[10px] text-terminal-accent flex items-center gap-1 hover:text-terminal-accent/70 transition-colors"
          >
            <Plus size={11} /> Add
          </button>
        </div>
        {profile.education.map((edu, i) => (
          <div
            key={i}
            className="border border-terminal-border/30 rounded-sm p-4 mb-2 bg-terminal-surface/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 grid grid-cols-3 gap-3">
                <FieldRow label="Degree" half>
                  <Input
                    value={edu.degree}
                    onChange={(v) => updateEdu(i, "degree", v)}
                  />
                </FieldRow>
                <FieldRow label="School" half>
                  <Input
                    value={edu.school}
                    onChange={(v) => updateEdu(i, "school", v)}
                  />
                </FieldRow>
                <FieldRow label="Year" half>
                  <Input
                    value={edu.year}
                    onChange={(v) => updateEdu(i, "year", v)}
                  />
                </FieldRow>
              </div>
              <button
                onClick={() => deleteEdu(i)}
                className="mt-5 text-terminal-muted hover:text-red-400 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

// ── MAIN ADMIN PAGE ────────────────────────────────────────────────────────────
export default function AdminPage({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [lang, setLang] = useState<Lang>("en");

  // ── Data states with localStorage persistence ──
  const [projectsEn, setProjectsEn] = useState<Project[]>(() =>
    loadLS("admin_projects_en", portfolioDataEn.projects),
  );
  const [projectsVi, setProjectsVi] = useState<Project[]>(() =>
    loadLS("admin_projects_vi", portfolioDataVi.projects),
  );
  const [certificates, setCertificates] = useState<Certificate[]>(() =>
    loadLS("admin_certificates", portfolioDataEn.certificates),
  );
  const [techStack, setTechStack] = useState<TechItem[]>(() =>
    loadLS("admin_techstack", portfolioDataEn.techStack),
  );
  const [stats, setStats] = useState<Stat[]>(() =>
    loadLS("admin_stats", portfolioDataEn.stats),
  );
  const [profileEn, setProfileEn] = useState<Profile>(() =>
    loadLS("admin_profile_en", portfolioDataEn.profile),
  );
  const [profileVi, setProfileVi] = useState<Profile>(() =>
    loadLS("admin_profile_vi", portfolioDataVi.profile),
  );

  // ── Persist on change ──
  useEffect(() => saveLS("admin_projects_en", projectsEn), [projectsEn]);
  useEffect(() => saveLS("admin_projects_vi", projectsVi), [projectsVi]);
  useEffect(() => saveLS("admin_certificates", certificates), [certificates]);
  useEffect(() => saveLS("admin_techstack", techStack), [techStack]);
  useEffect(() => saveLS("admin_stats", stats), [stats]);
  useEffect(() => saveLS("admin_profile_en", profileEn), [profileEn]);
  useEffect(() => saveLS("admin_profile_vi", profileVi), [profileVi]);

  // ── Derived: lang-aware selectors ──
  const projects = lang === "en" ? projectsEn : projectsVi;
  const setProjects = lang === "en" ? setProjectsEn : setProjectsVi;
  const profile = lang === "en" ? profileEn : profileVi;
  const setProfile = lang === "en" ? setProfileEn : setProfileVi;

  // ── Reset handlers ──
  const resetProjects = () => {
    if (
      !confirm("Reset projects to source data? Unsaved changes will be lost.")
    )
      return;
    if (lang === "en") {
      setProjectsEn(portfolioDataEn.projects);
      localStorage.removeItem("admin_projects_en");
    } else {
      setProjectsVi(portfolioDataVi.projects);
      localStorage.removeItem("admin_projects_vi");
    }
  };
  const resetCertificates = () => {
    if (!confirm("Reset certificates to source data?")) return;
    setCertificates(portfolioDataEn.certificates);
    localStorage.removeItem("admin_certificates");
  };
  const resetTechStack = () => {
    if (!confirm("Reset tech stack to source data?")) return;
    setTechStack(portfolioDataEn.techStack);
    localStorage.removeItem("admin_techstack");
  };
  const resetStats = () => {
    if (!confirm("Reset stats to source data?")) return;
    setStats(portfolioDataEn.stats);
    localStorage.removeItem("admin_stats");
  };
  const resetProfile = () => {
    if (!confirm("Reset profile to source data?")) return;
    if (lang === "en") {
      setProfileEn(portfolioDataEn.profile);
      localStorage.removeItem("admin_profile_en");
    } else {
      setProfileVi(portfolioDataVi.profile);
      localStorage.removeItem("admin_profile_vi");
    }
  };

  const TABS: { key: TabKey; label: string }[] = [
    { key: "projects", label: "Projects" },
    { key: "certificates", label: "Certificates" },
    { key: "techstack", label: "Tech Stack" },
    { key: "stats", label: "Stats" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      {/* ── Header ── */}
      <header className="border-b border-terminal-border/40 bg-terminal-surface/50 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs text-terminal-muted hover:text-terminal-accent transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          Portfolio
        </button>

        <div className="flex items-center gap-2">
          <Settings size={14} className="text-terminal-accent" />
          <span className="text-xs font-mono uppercase tracking-widest text-terminal-accent">
            Admin Panel
          </span>
        </div>

        {/* Lang toggle */}
        <div className="flex items-center gap-1 bg-terminal-card rounded-sm border border-terminal-border/40 p-0.5">
          {(["en", "vi"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-sm transition-colors ${
                lang === l
                  ? "bg-terminal-accent/20 text-terminal-accent border border-terminal-accent/30"
                  : "text-terminal-muted hover:text-terminal-text"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-53px)]">
        {/* ── Sidebar ── */}
        <nav className="w-44 border-r border-terminal-border/40 bg-terminal-surface/20 p-3 flex-shrink-0 sticky top-[53px] h-[calc(100vh-53px)]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-3 py-2.5 mb-1 text-xs uppercase tracking-wider rounded-sm transition-all ${
                activeTab === tab.key
                  ? "bg-terminal-accent/15 text-terminal-accent border-l-2 border-terminal-accent pl-2.5"
                  : "text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface/50"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="mt-6 pt-4 border-t border-terminal-border/30">
            <p className="text-[9px] uppercase tracking-wider text-terminal-muted/60 px-3 mb-2">
              Lang affects
            </p>
            <p className="text-[9px] text-terminal-muted px-3 leading-relaxed">
              Projects & Profile vary by language. Certificates, Tech Stack &
              Stats are shared.
            </p>
          </div>
        </nav>

        {/* ── Main content ── */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "projects" && (
            <ProjectsTab
              key={lang}
              projects={projects}
              setProjects={
                setProjects as React.Dispatch<React.SetStateAction<Project[]>>
              }
              lang={lang}
              onReset={resetProjects}
            />
          )}
          {activeTab === "certificates" && (
            <CertificatesTab
              certs={certificates}
              setCerts={setCertificates}
              onReset={resetCertificates}
            />
          )}
          {activeTab === "techstack" && (
            <TechStackTab
              stack={techStack}
              setStack={setTechStack}
              onReset={resetTechStack}
            />
          )}
          {activeTab === "stats" && (
            <StatsTab stats={stats} setStats={setStats} onReset={resetStats} />
          )}
          {activeTab === "profile" && (
            <ProfileTab
              key={lang}
              profile={profile}
              setProfile={
                setProfile as React.Dispatch<React.SetStateAction<Profile>>
              }
              lang={lang}
              onReset={resetProfile}
            />
          )}
        </main>
      </div>
    </div>
  );
}
