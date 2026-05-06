import { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  ArrowUpDown,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import type { SortKey, SortDir, ViewMode } from "../data/portfolio.types";
import { ITEMS_PER_PAGE } from "../data/portfolio.en";

interface ProjectFilterProps {
  tags: string[];
  tagCounts: Record<string, number>;
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (key: SortKey, dir: SortDir) => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  resultCount: number;
  totalCount: number;
}

const sortOptions: { key: SortKey; labelKey: string }[] = [
  { key: "sort_order", labelKey: "filter.sortOrder" },
  { key: "title", labelKey: "filter.sortName" },
  { key: "tag", labelKey: "filter.sortTag" },
  { key: "created_at", labelKey: "filter.sortDate" },
];

function getPageWindow(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function ProjectFilter({
  tags,
  tagCounts,
  selectedTag,
  onTagSelect,
  searchQuery,
  onSearchChange,
  sortKey,
  sortDir,
  onSortChange,
  viewMode,
  onViewChange,
  currentPage,
  onPageChange,
  resultCount,
  totalCount,
}: ProjectFilterProps) {
  const totalPages = Math.max(1, Math.ceil(resultCount / ITEMS_PER_PAGE));
  const isFiltered = selectedTag !== null || searchQuery.length > 0;
  const searchRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Keyboard shortcut: / to focus search, Escape to clear
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement)?.tagName,
        )
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        onSearchChange("");
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSearchChange]);

  return (
    <div className="col-span-4 space-y-3">
      {/* Main toolbar */}
      <div className="card-base flex items-center gap-2 px-3 py-2 flex-wrap sm:flex-nowrap">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-0 group/search">
          <Search
            size={13}
            className="text-terminal-muted group-focus-within/search:text-terminal-accent transition-colors flex-shrink-0"
          />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onPageChange(1);
            }}
            placeholder={t("filter.placeholder")}
            className="flex-1 bg-transparent text-xs text-terminal-text placeholder:text-terminal-muted/40
                       outline-none border-none caret-terminal-accent min-w-0"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                onSearchChange("");
                onPageChange(1);
                searchRef.current?.focus();
              }}
              className="text-terminal-muted hover:text-terminal-accent transition-colors flex-shrink-0"
            >
              <X size={13} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] text-terminal-muted/40 border border-terminal-border/30 rounded-sm">
              /
            </kbd>
          )}
        </div>

        <div className="h-4 w-px bg-terminal-border/40 flex-shrink-0 hidden sm:block" />

        {/* Sort dropdown */}
        <SortDropdown
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={onSortChange}
        />

        <div className="h-4 w-px bg-terminal-border/40 flex-shrink-0 hidden sm:block" />

        {/* View toggle */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <Tooltip content={t("filter.gridView")}>
            <button
              onClick={() => onViewChange("grid")}
              className={`p-1.5 rounded-sm transition-all duration-200 ${viewMode === "grid" ? "text-terminal-accent bg-terminal-accent/10" : "text-terminal-muted hover:text-terminal-text hover:bg-terminal-highlight"}`}
            >
              <LayoutGrid size={13} />
            </button>
          </Tooltip>
          <Tooltip content={t("filter.listView")}>
            <button
              onClick={() => onViewChange("list")}
              className={`p-1.5 rounded-sm transition-all duration-200 ${viewMode === "list" ? "text-terminal-accent bg-terminal-accent/10" : "text-terminal-muted hover:text-terminal-text hover:bg-terminal-highlight"}`}
            >
              <List size={13} />
            </button>
          </Tooltip>
        </div>

        <div className="h-4 w-px bg-terminal-border/40 flex-shrink-0 hidden sm:block" />

        {/* Count */}
        <span className="text-[10px] text-terminal-muted/50 tabular-nums flex-shrink-0">
          {resultCount}/{totalCount}
        </span>
      </div>

      {/* Tag chips row */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => {
            onTagSelect(null);
            onPageChange(1);
          }}
          className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border rounded-sm transition-all duration-200
            ${
              selectedTag === null
                ? "border-terminal-accent/40 text-terminal-accent bg-terminal-accent/5"
                : "border-terminal-border/40 text-terminal-muted hover:border-terminal-borderHover hover:text-terminal-text"
            }`}
        >
          {t("filter.all")}
          <span className="ml-1 text-terminal-muted/40 tabular-nums">
            {totalCount}
          </span>
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              onTagSelect(selectedTag === tag ? null : tag);
              onPageChange(1);
            }}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border rounded-sm transition-all duration-200
              ${
                selectedTag === tag
                  ? "border-terminal-accent/40 text-terminal-accent bg-terminal-accent/5"
                  : "border-terminal-border/40 text-terminal-muted hover:border-terminal-borderHover hover:text-terminal-text"
              }`}
          >
            {tag}
            <span className="ml-1 text-terminal-muted/40 tabular-nums">
              {tagCounts[tag] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Active filters */}
      {isFiltered && (
        <div className="flex items-center gap-2 text-[10px] text-terminal-muted/60 flex-wrap">
          <span className="text-terminal-accent/50">
            {t("filter.activeLabel")}
          </span>
          {selectedTag && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-terminal-accent/5 border border-terminal-accent/20 rounded-sm">
              tag={selectedTag}
              <button
                onClick={() => {
                  onTagSelect(null);
                  onPageChange(1);
                }}
                className="hover:text-terminal-accent transition-colors"
              >
                <X size={9} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-terminal-info/5 border border-terminal-info/20 rounded-sm text-terminal-info/70">
              q="{searchQuery}"
              <button
                onClick={() => {
                  onSearchChange("");
                  onPageChange(1);
                }}
                className="hover:text-terminal-info transition-colors"
              >
                <X size={9} />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              onTagSelect(null);
              onSearchChange("");
              onPageChange(1);
            }}
            className="ml-auto text-terminal-error/50 hover:text-terminal-error transition-colors"
          >
            {t("filter.clearAll")}
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[10px] text-terminal-muted/60">
          <span className="tabular-nums">
            {t("filter.pageLabel")} {currentPage}/{totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Tooltip content={t("filter.prevPage")}>
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-1 border border-terminal-border/40 rounded-sm hover:border-terminal-accent/30 hover:text-terminal-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft size={12} />
              </button>
            </Tooltip>
            {getPageWindow(currentPage, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-6 text-center text-terminal-muted/30"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-6 h-6 border rounded-sm transition-all duration-200 tabular-nums
                    ${
                      p === currentPage
                        ? "border-terminal-accent/40 text-terminal-accent bg-terminal-accent/5"
                        : "border-terminal-border/40 text-terminal-muted hover:border-terminal-borderHover hover:text-terminal-text"
                    }`}
                >
                  {p}
                </button>
              ),
            )}
            <Tooltip content={t("filter.nextPage")}>
              <button
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages}
                className="p-1 border border-terminal-border/40 rounded-sm hover:border-terminal-accent/30 hover:text-terminal-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight size={12} />
              </button>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Custom Sort Dropdown ── */

function SortDropdown({
  sortKey,
  sortDir,
  onSortChange,
}: {
  sortKey: SortKey;
  sortDir: SortDir;
  onSortChange: (k: SortKey, d: SortDir) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = sortOptions.find((o) => o.key === sortKey);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-1.5 py-1 rounded-sm text-[10px] uppercase tracking-wider
                   text-terminal-muted hover:text-terminal-text hover:bg-terminal-highlight
                   transition-all duration-200"
      >
        <ArrowUpDown size={11} />
        <span>{current ? t(current.labelKey) : t("filter.sortFallback")}</span>
        <span className="text-terminal-accent/60">
          {sortDir === "asc" ? "ASC" : "DESC"}
        </span>
        <ChevronDown
          size={10}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-terminal-card border border-terminal-border rounded-sm shadow-xl shadow-terminal-bg/50 z-30 overflow-hidden opacity-0 animate-fade-in">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onSortChange(opt.key, sortDir);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-[10px] uppercase tracking-wider
                         text-terminal-muted hover:text-terminal-text hover:bg-terminal-highlight
                         transition-colors duration-150"
            >
              <span>{t(opt.labelKey)}</span>
              {sortKey === opt.key && (
                <Check size={11} className="text-terminal-accent" />
              )}
            </button>
          ))}
          <div className="border-t border-terminal-border/30" />
          <button
            onClick={() => {
              onSortChange(sortKey, sortDir === "asc" ? "desc" : "asc");
              setOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-[10px] uppercase tracking-wider
                       text-terminal-muted hover:text-terminal-text hover:bg-terminal-highlight
                       transition-colors duration-150"
          >
            <span>{t("filter.direction")}</span>
            <span className="text-terminal-accent/60">
              {sortDir === "asc" ? "ASC" : "DESC"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Tooltip ── */

function Tooltip({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const childRef = useRef<HTMLDivElement>(null);

  function handleEnter() {
    if (!childRef.current) return;
    const rect = childRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 });
    setShow(true);
  }

  return (
    <div
      ref={childRef}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
      className="contents"
    >
      {children}
      {show && pos && (
        <div
          className="fixed z-50 px-2 py-1 text-[9px] text-terminal-text/80 bg-terminal-surface border border-terminal-border/50
                     rounded-sm shadow-lg shadow-terminal-bg/50 whitespace-nowrap pointer-events-none
                     opacity-0 animate-tooltip-in"
          style={{
            top: pos.top,
            left: pos.left,
            transform: "translateX(-50%)",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
