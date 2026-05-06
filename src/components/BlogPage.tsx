import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Tag,
  Search,
  ChevronRight,
  BookOpen,
  Hash,
  List,
  ChevronDown,
  ChevronLeft,
  Settings2,
  X,
} from "lucide-react";
import type { BlogPost } from "../data/blog.types";

interface BlogPageProps {
  posts: BlogPost[];
  onNavigateHome: () => void;
  onOpenSettings: () => void;
}

const PAGE_SIZE = 10;

function BlogPage({ posts, onNavigateHome, onOpenSettings }: BlogPageProps) {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      ),
    [posts],
  );

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    sortedPosts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [sortedPosts]);

  const filteredPosts = useMemo(() => {
    let result = sortedPosts;
    if (activeTag) {
      result = result.filter((p) => p.tags.includes(activeTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [sortedPosts, activeTag, searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTag, searchQuery]);

  const featuredPost = sortedPosts[0];
  const recentPosts = sortedPosts.slice(1, 4);

  const listablePosts = useMemo(() => {
    if (activeTag || searchQuery.trim()) return filteredPosts;
    return filteredPosts.filter(
      (p) =>
        p.id !== featuredPost?.id && !recentPosts.some((r) => r.id === p.id),
    );
  }, [filteredPosts, activeTag, searchQuery, featuredPost, recentPosts]);

  const totalPages = Math.max(1, Math.ceil(listablePosts.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPosts = listablePosts.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  const activeSlug = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] !== "blog") return null;
    return parts[1] ?? null;
  }, [pathname]);

  const activePost = useMemo(() => {
    if (!activeSlug) return null;
    return sortedPosts.find((post) => post.slug === activeSlug) ?? null;
  }, [sortedPosts, activeSlug]);

  const openPost = useCallback((slug: string) => {
    const nextPath = `/blog/${slug}`;
    window.history.pushState({}, "", nextPath);
    setPathname(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const backToList = useCallback(() => {
    window.history.pushState({}, "", "/blog");
    setPathname("/blog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (activePost) {
    return <ArticleView post={activePost} onBack={backToList} />;
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Navigation */}
      <nav className="border-b border-terminal-border/40 bg-terminal-bg/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs text-terminal-muted hover:text-terminal-accent transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            Home
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1 text-[10px] text-terminal-muted hover:text-terminal-accent transition-colors uppercase tracking-wider"
            >
              <Settings2 size={11} />
              Settings
            </button>
            <span className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest">
              devmindtan.blog
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero / Header */}
        <header className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-terminal-accent" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-terminal-muted font-mono">
              blog
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-terminal-text leading-tight">
            Thoughts on
            <br />
            <span className="text-terminal-accent">Engineering</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-terminal-muted max-w-2xl leading-relaxed">
            Writing about distributed systems, platform engineering, and the
            craft of building software that runs in production.
          </p>
        </header>

        {/* Featured Post */}
        {featuredPost && !activeTag && !searchQuery.trim() && (
          <section className="mb-10 sm:mb-14">
            <span className="section-label text-terminal-accent/70 mb-4 block">
              Featured
            </span>
            <button
              onClick={() => openPost(featuredPost.slug)}
              className="w-full text-left group"
            >
              <div className="card-base overflow-hidden hover:border-terminal-accent/30 transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  {featuredPost.coverImage && (
                    <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                      <img
                        src={featuredPost.coverImage}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-5 sm:p-7 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-[10px] text-terminal-muted uppercase tracking-wider mb-3">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={11} />
                        {featuredPost.publishedAt}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={11} />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-terminal-text group-hover:text-terminal-accent transition-colors leading-snug">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-3 text-sm text-terminal-muted leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {featuredPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-terminal-accent/10 border border-terminal-accent/20 text-terminal-accent/80 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-terminal-accent uppercase tracking-wider font-medium">
                      Read article
                      <ChevronRight
                        size={12}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </section>
        )}

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-terminal-card border border-terminal-border/50 rounded-sm
                         text-terminal-text placeholder:text-terminal-muted/60
                         focus:outline-none focus:border-terminal-accent/40 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-sm whitespace-nowrap transition-all ${
                !activeTag
                  ? "bg-terminal-accent/15 border border-terminal-accent/30 text-terminal-accent"
                  : "bg-terminal-card border border-terminal-border/40 text-terminal-muted hover:text-terminal-text"
              }`}
            >
              All
            </button>
            {allTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-sm whitespace-nowrap transition-all ${
                  activeTag === tag
                    ? "bg-terminal-accent/15 border border-terminal-accent/30 text-terminal-accent"
                    : "bg-terminal-card border border-terminal-border/40 text-terminal-muted hover:text-terminal-text"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Posts (horizontal cards) */}
        {recentPosts.length > 0 && !activeTag && !searchQuery.trim() && (
          <section className="mb-10 sm:mb-14">
            <span className="section-label text-terminal-muted mb-4 block">
              Top Posts
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentPosts.map((post, index) => (
                <button
                  key={post.id}
                  onClick={() => openPost(post.slug)}
                  className="text-left group opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="card-base h-full p-4 sm:p-5 hover:border-terminal-accent/30 transition-all duration-300 flex flex-col">
                    {post.coverImage && (
                      <div className="h-32 -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 mb-4 overflow-hidden rounded-t-sm">
                        <img
                          src={post.coverImage}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[9px] text-terminal-muted uppercase tracking-wider mb-2">
                      <CalendarDays size={10} />
                      {post.publishedAt}
                      <span className="text-terminal-border">|</span>
                      <Clock3 size={10} />
                      {post.readTime}
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-terminal-text group-hover:text-terminal-accent transition-colors leading-snug flex-1">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-xs text-terminal-muted leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 text-[8px] uppercase tracking-wider bg-terminal-border/20 text-terminal-muted rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* All Posts List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <span className="section-label text-terminal-muted">
              {activeTag || searchQuery.trim() ? "Results" : "All Articles"}
            </span>
            {listablePosts.length > PAGE_SIZE && (
              <span className="text-[9px] text-terminal-muted/50 font-mono">
                {safeCurrentPage}/{totalPages}
              </span>
            )}
          </div>

          {listablePosts.length === 0 ? (
            <div className="card-base p-8 text-center">
              <Hash size={24} className="mx-auto text-terminal-muted/40 mb-3" />
              <p className="text-sm text-terminal-muted">
                No articles found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-terminal-border/30">
                {paginatedPosts.map((post, index) => (
                  <button
                    key={post.id}
                    onClick={() => openPost(post.slug)}
                    className="w-full text-left group py-5 first:pt-0 last:pb-0 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
                      {post.coverImage && (
                        <div className="sm:w-28 sm:h-20 h-40 flex-shrink-0 overflow-hidden rounded-sm">
                          <img
                            src={post.coverImage}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[9px] text-terminal-muted uppercase tracking-wider mb-1.5">
                          <CalendarDays size={10} />
                          {post.publishedAt}
                          <span className="text-terminal-border">|</span>
                          <Clock3 size={10} />
                          {post.readTime}
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-terminal-text group-hover:text-terminal-accent transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <p className="mt-1.5 text-xs sm:text-sm text-terminal-muted leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 text-[8px] uppercase tracking-wider bg-terminal-border/20 text-terminal-muted rounded-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="hidden sm:block text-terminal-muted/40 group-hover:text-terminal-accent transition-colors mt-1 flex-shrink-0"
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6 pt-4 border-t border-terminal-border/20">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage === 1}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] uppercase tracking-wider rounded-sm
                               border border-terminal-border/40 text-terminal-muted
                               hover:text-terminal-text hover:border-terminal-border disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={12} />
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 text-[10px] font-mono rounded-sm transition-all ${
                          page === safeCurrentPage
                            ? "bg-terminal-accent/15 border border-terminal-accent/30 text-terminal-accent"
                            : "border border-terminal-border/30 text-terminal-muted hover:text-terminal-text hover:border-terminal-border"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={safeCurrentPage === totalPages}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] uppercase tracking-wider rounded-sm
                               border border-terminal-border/40 text-terminal-muted
                               hover:text-terminal-text hover:border-terminal-border disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                    <ChevronRight size={12} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-terminal-border/30 text-center">
          <p className="text-[10px] text-terminal-muted uppercase tracking-wider">
            devmindtan.blog &mdash; {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}

function ArticleView({ post, onBack }: { post: BlogPost; onBack: () => void }) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>(
    post.sections[0]?.heading ?? "",
  );
  const [highlightedHeading, setHighlightedHeading] = useState<string | null>(
    null,
  );
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setReadingProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track which section is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [post.sections]);

  const scrollToSection = useCallback((heading: string) => {
    const el = sectionRefs.current.get(heading);
    setActiveSection(heading);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setHighlightedHeading(heading);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(
      () => setHighlightedHeading(null),
      2000,
    );
    setMobileTocOpen(false);
  }, []);

  const tocItems = [...post.sections, ...(post.extraSections ?? [])].map(
    (s) => ({ id: s.heading, label: s.heading }),
  );

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 h-0.5 bg-terminal-border/20">
        <div
          className="h-full bg-terminal-accent transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className="border-b border-terminal-border/40 bg-terminal-bg/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs text-terminal-muted hover:text-terminal-accent transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            All Articles
          </button>
          <div className="flex items-center gap-3">
            {/* Mobile TOC toggle */}
            <button
              onClick={() => setMobileTocOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 text-[10px] text-terminal-muted hover:text-terminal-accent transition-colors uppercase tracking-wider border border-terminal-border/40 px-2 py-1 rounded-sm"
            >
              <List size={12} />
              TOC
            </button>
            <span className="text-[9px] font-mono text-terminal-muted/50">
              {Math.round(readingProgress)}% read
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile TOC Drawer */}
      {mobileTocOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileTocOpen(false)}
        >
          <div className="absolute inset-0 bg-terminal-bg/70 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-terminal-card border-l border-terminal-border/40 p-5 overflow-y-auto animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-terminal-accent font-semibold flex items-center gap-1.5">
                <List size={11} />
                Contents
              </span>
              <button
                onClick={() => setMobileTocOpen(false)}
                className="text-terminal-muted hover:text-terminal-text transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <nav className="space-y-1">
              {tocItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group w-full text-left px-3 py-2 text-xs rounded-sm transition-all flex items-center gap-2 ${
                    activeSection === item.id
                      ? "bg-terminal-accent/10 text-terminal-accent border-l-2 border-terminal-accent"
                      : "text-terminal-muted hover:text-terminal-text hover:bg-terminal-border/10 border-l-2 border-transparent"
                  }`}
                >
                  <span
                    className={`text-[9px] font-mono w-4 transition-colors ${
                      activeSection === item.id
                        ? "text-terminal-accent"
                        : "text-terminal-muted/50 group-hover:text-terminal-text"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Article + Sidebar Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex gap-8 lg:gap-12">
          {/* Main Article */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Article Header */}
            <header className="mb-8 sm:mb-10">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-terminal-accent/10 border border-terminal-accent/20 text-terminal-accent/80 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-terminal-text leading-tight">
                {post.title}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-terminal-muted leading-relaxed">
                {post.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-4 text-[11px] text-terminal-muted uppercase tracking-wider border-b border-terminal-border/30 pb-6">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  {post.publishedAt}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={13} />
                  Read time &middot; {post.readTime}
                </span>
              </div>
            </header>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="mb-8 sm:mb-10 -mx-4 sm:mx-0 overflow-hidden rounded-sm">
                <img
                  src={post.coverImage}
                  alt=""
                  className="w-full h-56 sm:h-72 object-cover"
                />
              </div>
            )}

            {/* Article Body */}
            <div className="space-y-8">
              {[...post.sections, ...(post.extraSections ?? [])].map(
                (section) => (
                  <section
                    key={section.heading}
                    id={section.heading}
                    ref={(el) => {
                      if (el) sectionRefs.current.set(section.heading, el);
                    }}
                    className="space-y-4 scroll-mt-20"
                  >
                    <h2
                      onClick={() => setActiveSection(section.heading)}
                      className={`text-lg sm:text-xl font-semibold text-terminal-text border-l-2 pl-4 py-1 -ml-1 rounded-r-sm transition-all duration-500 ${
                        highlightedHeading === section.heading
                          ? "border-terminal-accent bg-terminal-accent/10 text-terminal-accent"
                          : activeSection === section.heading
                            ? "border-terminal-accent"
                            : "border-terminal-border/40"
                      }`}
                    >
                      {section.heading}
                    </h2>
                    <div className="space-y-4">
                      {section.paragraphs.map((paragraph, index) => (
                        <p
                          key={`${section.heading}-${index}`}
                          className="text-sm sm:text-base text-terminal-text/85 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                ),
              )}
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-6 border-t border-terminal-border/30">
              <div className="flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 text-xs text-terminal-muted hover:text-terminal-accent transition-colors uppercase tracking-wider"
                >
                  <ArrowLeft size={14} />
                  Back to all articles
                </button>
                <div className="flex items-center gap-2">
                  <Tag size={12} className="text-terminal-muted/50" />
                  <span className="text-[10px] text-terminal-muted/50">
                    {post.tags.join(", ")}
                  </span>
                </div>
              </div>
            </footer>
          </article>

          {/* Desktop TOC Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-16">
              {/* Collapse Toggle */}
              <button
                onClick={() => setTocCollapsed(!tocCollapsed)}
                className="w-full flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-terminal-accent font-semibold mb-3 hover:text-terminal-text transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <List size={11} />
                  Contents
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${tocCollapsed ? "-rotate-90" : ""}`}
                />
              </button>

              {/* TOC Items */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  tocCollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
                }`}
              >
                <nav className="space-y-0.5 border-l border-terminal-border/30">
                  {tocItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`group w-full text-left pl-3 pr-2 py-1.5 text-[11px] leading-snug transition-all relative ${
                        activeSection === item.id
                          ? "text-terminal-accent font-medium"
                          : "text-terminal-muted hover:text-terminal-text"
                      }`}
                    >
                      {/* Active indicator line */}
                      {activeSection === item.id && (
                        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-terminal-accent -translate-x-[1px]" />
                      )}
                      <span
                        className={`text-[9px] font-mono mr-1.5 transition-colors ${
                          activeSection === item.id
                            ? "text-terminal-accent"
                            : "text-terminal-muted/40 group-hover:text-terminal-text"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Reading info */}
              <div className="mt-4 pt-3 border-t border-terminal-border/20">
                <div className="flex items-center justify-between text-[9px] text-terminal-muted/50">
                  <span>Progress</span>
                  <span className="font-mono">
                    {Math.round(readingProgress)}%
                  </span>
                </div>
                <div className="mt-1.5 h-1 bg-terminal-border/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terminal-accent/60 rounded-full transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
