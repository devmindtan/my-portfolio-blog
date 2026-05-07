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
import BlogPage from "./components/BlogPage";
import SettingsModal from "./components/SettingsModal";
import AdminPage from "./components/AdminPage";
import DataViewerPage from "./components/DataViewerPage";
import useCompactView from "./hooks/useCompactView";
import { useLanguage } from "./contexts/LanguageContext";
import { portfolioDataEn } from "./data/portfolio.en";
import { portfolioDataVi } from "./data/portfolio.vi";
import type {
  Project,
  SortKey,
  SortDir,
  ViewMode,
} from "./data/portfolio.types";
import { ITEMS_PER_PAGE } from "./data/portfolio.en";
import { Menu, Settings2, X } from "lucide-react";

const INTRO_SEEN_KEY = "portfolio.welcomeSeen";

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [showIntro, setShowIntro] = useState(() => {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) !== "1";
  });
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("sort_order");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCVExport, setShowCVExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { compactView, toggleCompactView } = useCompactView();
  const { lang, setLang, t } = useLanguage();

  const portfolioData = useMemo(
    () => (lang === "vi" ? portfolioDataVi : portfolioDataEn),
    [lang],
  );

  const {
    projects,
    blogPosts,
    techStack,
    stats,
    profile,
    heroLines,
    welcomeLines,
    principles,
    certificates,
    siteConfig,
  } = portfolioData;

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tags = useMemo(
    () => [...new Set(projects.map((p) => p.tag))].sort(),
    [projects],
  );

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      counts[p.tag] = (counts[p.tag] || 0) + 1;
    });
    return counts;
  }, [projects]);

  const filteredAndSorted = useMemo(() => {
    const result = projects.filter((p) => {
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
  }, [projects, selectedTag, searchQuery, sortKey, sortDir]);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  useEffect(() => {
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

  const navLabelByKey: Record<string, string> = {
    projects: t("nav.projects"),
    blog: t("nav.blog"),
    stack: t("nav.stack"),
    contact: t("nav.contact"),
  };

  const sectionProjectsTitle = t("section.projects");
  const sectionConnectTitle = t("section.connect");

  const navigate = useCallback(
    (nextPath: string) => {
      if (nextPath === pathname) return;
      window.history.pushState({}, "", nextPath);
      setPathname(nextPath);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pathname],
  );

  const handleWelcomeComplete = useCallback(() => {
    setShowIntro(false);
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  }, []);

  const handleNavigateHome = useCallback(() => {
    setShowIntro(false);
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    navigate("/");
  }, [navigate]);

  const handleOpenCVFromSettings = useCallback(() => {
    setShowSettings(false);
    setShowCVExport(true);
  }, []);

  const handleOpenAdminFromSettings = useCallback(() => {
    setShowSettings(false);
    navigate("/admin");
  }, [navigate]);

  const handleOpenDataViewerFromSettings = useCallback(() => {
    setShowSettings(false);
    navigate("/data");
  }, [navigate]);

  const renderGlobalActions = (
    <>
      {showSettings && (
        <SettingsModal
          lang={lang}
          onToggleLanguage={() => setLang(lang === "en" ? "vi" : "en")}
          compactView={compactView}
          onToggleCompact={toggleCompactView}
          onExportCV={handleOpenCVFromSettings}
          onOpenAdmin={handleOpenAdminFromSettings}
          onOpenDataViewer={handleOpenDataViewerFromSettings}
          onClose={() => setShowSettings(false)}
          t={t}
        />
      )}

      {showCVExport && (
        <CVExportModal
          profile={profile}
          projects={projects}
          certificates={certificates}
          techStack={techStack}
          onClose={() => setShowCVExport(false)}
        />
      )}
    </>
  );

  const isBlogRoute = pathname.startsWith("/blog");
  if (pathname === "/admin") {
    return (
      <AdminPage
        onBack={() => {
          navigate("/");
        }}
      />
    );
  }

  if (pathname === "/data") {
    return (
      <DataViewerPage
        onBack={() => {
          navigate("/");
        }}
      />
    );
  }

  if (isBlogRoute) {
    return (
      <div
        className={`min-h-screen bg-terminal-bg relative app-scale-root ${compactView ? "compact-view" : ""}`}
      >
        <div className="app-scale-shell">
          <BlogPage
            posts={blogPosts}
            onNavigateHome={handleNavigateHome}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>
        {renderGlobalActions}
      </div>
    );
  }

  return (
    <>
      {showIntro && (
        <WelcomeHero lines={welcomeLines} onComplete={handleWelcomeComplete} />
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
                  {siteConfig.navLinks.map((link) =>
                    link.href.startsWith("/") ? (
                      <button
                        key={link.href}
                        onClick={() => navigate(link.href)}
                        className="hover:text-terminal-accent transition-colors"
                      >
                        {navLabelByKey[link.label] ?? link.label}
                      </button>
                    ) : (
                      <a
                        key={link.href}
                        href={link.href}
                        className="hover:text-terminal-accent transition-colors"
                      >
                        {navLabelByKey[link.label] ?? link.label}
                      </a>
                    ),
                  )}
                  <button
                    onClick={() => setShowSettings(true)}
                    className="inline-flex items-center gap-1 hover:text-terminal-accent transition-colors"
                  >
                    <Settings2 size={12} />
                    {t("settings.open")}
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
                  {siteConfig.navLinks.map((link) =>
                    link.href.startsWith("/") ? (
                      <button
                        key={link.href}
                        onClick={() => {
                          navigate(link.href);
                          setMobileMenuOpen(false);
                        }}
                        className="block text-[10px] text-terminal-muted uppercase tracking-wider hover:text-terminal-accent transition-colors py-1"
                      >
                        {navLabelByKey[link.label] ?? link.label}
                      </button>
                    ) : (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-[10px] text-terminal-muted uppercase tracking-wider hover:text-terminal-accent transition-colors py-1"
                      >
                        {navLabelByKey[link.label] ?? link.label}
                      </a>
                    ),
                  )}
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-[10px] text-terminal-muted uppercase tracking-wider hover:text-terminal-accent transition-colors py-1"
                  >
                    <Settings2 size={10} />
                    {t("settings.open")}
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
                  {sectionProjectsTitle || siteConfig.sectionTitles.projects}
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
                    {t("empty.projects")}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedTag(null);
                      setSearchQuery("");
                    }}
                    className="block mx-auto text-[10px] text-terminal-accent hover:underline"
                  >
                    {t("action.clearFilters")}
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
                  {sectionConnectTitle || siteConfig.sectionTitles.connect}
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
                      {t("status.available") || siteConfig.status.text}
                    </span>
                    <div className="text-[10px] text-terminal-muted mt-0.5">
                      {t("status.response") || siteConfig.status.detail}
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

          {/* Scroll to top */}
          <ScrollToTop />
        </div>
      </div>

      {renderGlobalActions}
    </>
  );
}

export default App;
