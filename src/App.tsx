import { useState, useMemo, useCallback, useEffect } from "react";
import WelcomeHero from "./components/WelcomeHero";
import TerminalHero from "./components/TerminalHero";
import AvatarCard from "./components/AvatarCard";
import AboutCard from "./components/AboutCard";
import ExperienceCard from "./components/ExperienceCard";
import StatsCard from "./components/StatsCard";
import TechStackCard from "./components/TechStackCard";
import PhilosophyCard from "./components/PhilosophyCard";
import CertificatesCard from "./components/CertificatesCard";
import ProjectCard from "./components/ProjectCard";
import ProjectFilter from "./components/ProjectFilter";
import ProjectDetailModal from "./components/ProjectDetailModal";
import CVExportModal from "./components/CVExportModal";
import ContactCard from "./components/ContactCard";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CompactViewToggle from "./components/CompactViewToggle";
import useCompactView from "./hooks/useCompactView";
import {
  projects,
  techStack,
  stats,
  profile,
  heroLines,
  welcomeLines,
  principles,
  certificates,
  siteConfig,
} from "./data/portfolio";
import type { Project, SortKey, SortDir, ViewMode } from "./data/portfolio";
import { ITEMS_PER_PAGE } from "./data/portfolio";
import { FileText, Menu, X } from "lucide-react";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("sort_order");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCVExport, setShowCVExport] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { compactView, toggleCompactView } = useCompactView();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tags = useMemo(
    () => [...new Set(projects.map((p) => p.tag))].sort(),
    [],
  );

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      counts[p.tag] = (counts[p.tag] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = projects.filter((p) => {
      const matchesTag = selectedTag === null || p.tag === selectedTag;
      if (!searchQuery) return matchesTag;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.problem.toLowerCase().includes(q) ||
        p.insight.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q)) ||
        p.actions.some((a) => a.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "sort_order":
          cmp = a.sort_order - b.sort_order;
          break;
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "tag":
          cmp = a.tag.localeCompare(b.tag);
          break;
        case "created_at":
          cmp =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [selectedTag, searchQuery, sortKey, sortDir]);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  useMemo(() => {
    setCurrentPage(1);
  }, [selectedTag, searchQuery]);

  const handleSortChange = useCallback((key: SortKey, dir: SortDir) => {
    setSortKey(key);
    setSortDir(dir);
  }, []);

  const handleExperienceProjectQuery = useCallback((projectName: string) => {
    setSelectedTag(null);
    setSearchQuery(projectName);
    setCurrentPage(1);
  }, []);

  return (
    <>
      {showIntro && (
        <WelcomeHero
          lines={welcomeLines}
          onComplete={() => setShowIntro(false)}
        />
      )}

      <div
        className={`min-h-screen bg-terminal-bg relative app-scale-root ${compactView ? "compact-view" : ""}`}
      >
        <div className="scanline-overlay" />

        <div className="app-scale-shell">
          {/* Sticky Header */}
          <header
            className={`sticky top-0 z-40 transition-all duration-300 ${
              scrolled
                ? "bg-terminal-bg/90 backdrop-blur-md border-b border-terminal-border/30 shadow-lg shadow-terminal-bg/30"
                : "bg-transparent"
            }`}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <nav className="flex items-center justify-between h-12">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-terminal-accent rounded-full animate-glow" />
                  <span className="text-xs text-terminal-text font-semibold tracking-wider uppercase">
                    {siteConfig.brand}
                  </span>
                </div>

                {/* Desktop nav */}
                <div className="hidden sm:flex items-center gap-4 text-[10px] text-terminal-muted uppercase tracking-wider">
                  {siteConfig.navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="hover:text-terminal-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <CompactViewToggle
                    compact={compactView}
                    onToggle={toggleCompactView}
                  />
                  <button
                    onClick={() => setShowCVExport(true)}
                    className="flex items-center gap-1.5 px-2 py-1 border border-terminal-border/40 rounded-sm
                             hover:border-terminal-accent/30 hover:text-terminal-accent transition-all duration-200"
                  >
                    <FileText size={10} />
                    export cv
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="sm:hidden p-1.5 text-terminal-muted hover:text-terminal-accent transition-colors"
                >
                  {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
              </nav>

              {/* Mobile dropdown */}
              {mobileMenuOpen && (
                <div className="sm:hidden pb-3 space-y-2 opacity-0 animate-fade-in">
                  {siteConfig.navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[10px] text-terminal-muted uppercase tracking-wider hover:text-terminal-accent transition-colors py-1"
                    >
                      {link.label}
                    </a>
                  ))}
                  <CompactViewToggle
                    compact={compactView}
                    onToggle={toggleCompactView}
                    mobile
                  />
                  <button
                    onClick={() => {
                      setShowCVExport(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-[10px] text-terminal-muted uppercase tracking-wider hover:text-terminal-accent transition-colors py-1"
                  >
                    <FileText size={10} />
                    export cv
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10 web-justify">
            <div className="bento-grid">
              {/* Terminal info hero */}
              <TerminalHero lines={heroLines} />

              {/* Avatar + About */}
              <AvatarCard profile={profile} />
              <AboutCard profile={profile} />

              {/* Experience */}
              <ExperienceCard
                experience={profile.experience}
                onProjectQuery={handleExperienceProjectQuery}
              />

              {/* Stats + Philosophy (left col) + Tech stack (right col) */}
              <div className="col-span-4 flex flex-col sm:flex-row gap-3 items-stretch">
                <div className="flex flex-col gap-3 sm:flex-1 h-full">
                  <StatsCard stats={stats} />
                  <div className="flex-1 min-h-0">
                    <PhilosophyCard principles={principles} />
                  </div>
                </div>
                <div className="sm:flex-1">
                  <TechStackCard techData={techStack} />
                </div>
              </div>

              {/* Certificates */}
              <CertificatesCard certificates={certificates} />

              {/* Section divider */}
              <div
                id="projects"
                className="col-span-4 flex items-center gap-2 sm:gap-3 py-4 opacity-0 animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="h-px flex-1 bg-terminal-border/30" />
                <span className="text-[10px] text-terminal-muted/50 uppercase tracking-[0.15em] sm:tracking-[0.3em]">
                  {siteConfig.sectionTitles.projects}
                </span>
                <div className="h-px flex-1 bg-terminal-border/30" />
              </div>

              {/* Filter bar */}
              <ProjectFilter
                tags={tags}
                tagCounts={tagCounts}
                selectedTag={selectedTag}
                onTagSelect={setSelectedTag}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortKey={sortKey}
                sortDir={sortDir}
                onSortChange={handleSortChange}
                viewMode={viewMode}
                onViewChange={setViewMode}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                resultCount={filteredAndSorted.length}
                totalCount={projects.length}
              />

              {/* Projects */}
              {paginatedProjects.length === 0 ? (
                <div className="col-span-4 py-12 text-center space-y-2">
                  <span className="text-xs text-terminal-muted">
                    No matching projects found.
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTag(null);
                      setSearchQuery("");
                    }}
                    className="block mx-auto text-[10px] text-terminal-accent hover:underline"
                  >
                    clear filters
                  </button>
                </div>
              ) : (
                paginatedProjects.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    viewMode={viewMode}
                    onClick={() => setSelectedProject(project)}
                  />
                ))
              )}

              {/* Section divider */}
              <div
                id="contact"
                className="col-span-4 flex items-center gap-2 sm:gap-3 py-4 opacity-0 animate-fade-in"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="h-px flex-1 bg-terminal-border/30" />
                <span className="text-[10px] text-terminal-muted/50 uppercase tracking-[0.15em] sm:tracking-[0.3em]">
                  {siteConfig.sectionTitles.connect}
                </span>
                <div className="h-px flex-1 bg-terminal-border/30" />
              </div>

              {/* Contact + Status */}
              <ContactCard config={siteConfig} />
              <div className="col-span-4 sm:col-span-2 card-base">
                <div className="p-4 sm:p-5 flex items-center gap-3">
                  <div className="w-2 h-2 bg-terminal-accent rounded-full animate-glow" />
                  <div>
                    <span className="text-xs text-terminal-text/80">
                      {siteConfig.status.text}
                    </span>
                    <div className="text-[10px] text-terminal-muted mt-0.5">
                      {siteConfig.status.detail}
                    </div>
                  </div>
                </div>
              </div>

              <Footer config={siteConfig} />
            </div>
          </div>

          {/* Detail modal */}
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />

          {/* CV Export modal */}
          {showCVExport && (
            <CVExportModal
              profile={profile}
              projects={projects}
              certificates={certificates}
              techStack={techStack}
              onClose={() => setShowCVExport(false)}
            />
          )}

          {/* Scroll to top */}
          <ScrollToTop />
        </div>
      </div>
    </>
  );
}

export default App;
