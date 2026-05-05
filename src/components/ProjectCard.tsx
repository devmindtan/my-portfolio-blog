import { useState } from 'react';
import type { Project, ViewMode } from '../data/portfolio';
import { ChevronRight, FolderGit2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index: number;
  viewMode: ViewMode;
  onClick: () => void;
}

export default function ProjectCard({ project, index, viewMode, onClick }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === 'list') {
    return (
      <button
        onClick={onClick}
        className="card-base card-glow col-span-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 text-left
                   opacity-0 animate-slide-up cursor-pointer"
        style={{ animationDelay: `${0.05 + index * 0.05}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2 text-terminal-muted text-xs flex-shrink-0">
          <FolderGit2 size={11} />
          <span className="text-[10px] uppercase tracking-wider">{project.tag}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-terminal-text truncate">{project.title}</h3>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {project.tech.slice(0, 4).map((t) => (
            <span key={t} className="px-1.5 py-0.5 text-[9px] bg-terminal-highlight border border-terminal-border/30 text-terminal-muted rounded-sm">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {project.results.slice(0, 2).map((r, i) => (
            <div key={i} className="text-center">
              <span className="mono-value text-xs text-terminal-accent">{r.value}</span>
              <span className="text-[9px] text-terminal-muted ml-1">{r.label}</span>
            </div>
          ))}
        </div>

        <ChevronRight
          size={14}
          className={`text-terminal-muted transition-all duration-300 flex-shrink-0 hidden sm:block ${
            isHovered ? 'text-terminal-accent translate-x-0.5' : ''
          }`}
        />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="card-base card-glow col-span-4 sm:col-span-2 opacity-0 animate-slide-up cursor-pointer text-left"
      style={{ animationDelay: `${0.05 + index * 0.08}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Terminal header */}
      <div className="terminal-header">
        <div className="terminal-dot bg-terminal-error/80" />
        <div className="terminal-dot bg-terminal-warning/80" />
        <div className="terminal-dot bg-terminal-accent/80" />
        <span className="ml-2 flex items-center gap-1.5">
          <FolderGit2 size={11} />
          {project.tag}
        </span>
        <span className="ml-auto text-terminal-muted/50 hidden sm:inline">
          {project.tech.slice(0, 3).join(' · ')}
          {project.tech.length > 3 && ' · ...'}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-terminal-text leading-tight">
            {project.title}
          </h3>
          <ChevronRight
            size={14}
            className={`text-terminal-muted transition-all duration-300 flex-shrink-0 mt-0.5 ${
              isHovered ? 'text-terminal-accent translate-x-0.5' : ''
            }`}
          />
        </div>

        {/* Problem */}
        <div>
          <span className="section-label text-terminal-error/70">problem</span>
          <p className="text-xs text-terminal-text/80 mt-1 leading-relaxed line-clamp-2">
            {project.problem}
          </p>
        </div>

        {/* Actions */}
        <div>
          <span className="section-label text-terminal-info/70">action</span>
          <ul className="mt-1.5 space-y-1">
            {project.actions.map((action, i) => (
              <li key={i} className="text-xs text-terminal-text/70 flex items-start gap-2">
                <span className="text-terminal-accent/60 mt-0.5 flex-shrink-0">{'>'}</span>
                <span className="line-clamp-1">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Results */}
        <div>
          <span className="section-label text-terminal-accent/70">result</span>
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-1.5">
            {project.results.map((result, i) => (
              <div key={i} className="flex flex-col">
                <span className="mono-value text-sm text-terminal-accent text-shadow-glow">
                  {result.value}
                </span>
                <span className="text-[10px] text-terminal-muted">{result.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="pt-3 border-t border-terminal-border/30">
          <p className="text-[10px] text-terminal-muted/70 italic leading-relaxed">
            <span className="text-terminal-warning/50 not-italic mr-1">//</span>
            {project.insight}
          </p>
        </div>
      </div>
    </button>
  );
}
