import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  withAutoWebsiteImages,
  websiteCards,
  WEBSITE_ITEMS_PER_PAGE,
  type WebsiteCardItem,
} from "../data/websites";

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

function WebsiteCard({
  item,
  index,
  lang,
}: {
  item: WebsiteCardItem;
  index: number;
  lang: "en" | "vi";
}) {
  const website = withAutoWebsiteImages(item);

  return (
    <article
      className="card-base card-glow col-span-4 sm:col-span-1 overflow-hidden opacity-0 animate-slide-up"
      style={{ animationDelay: `${0.05 + index * 0.06}s` }}
    >
      <div className="relative aspect-[16/9] border-b border-terminal-border/40 bg-terminal-highlight/30">
        <img
          src={website.thumbnailUrl}
          alt={`${item.name} preview`}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/1200x675/0f1320/9aa4b2?text=Preview+Unavailable";
          }}
        />
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-terminal-bg/85 border border-terminal-border/40 text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/40 transition-colors rounded-sm"
        >
          <ExternalLink size={10} />
          Open
        </a>
      </div>

      <div className="p-4 sm:p-5 space-y-3 text-left">
        <div className="flex items-start gap-2">
          <img
            src={website.iconUrl}
            alt={`${item.name} icon`}
            className="w-5 h-5 rounded-sm border border-terminal-border/40 mt-0.5"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-terminal-text truncate">
              {item.name}
            </h3>
            <p className="text-[10px] text-terminal-muted/70 truncate">{item.url}</p>
          </div>
        </div>

        <p className="text-xs text-terminal-text/80 leading-relaxed line-clamp-2">
          {item.description[lang]}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[9px] uppercase tracking-wider border border-terminal-border/40 text-terminal-muted rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function WebsiteShowcase() {
  const [currentPage, setCurrentPage] = useState(1);
  const { lang, t } = useLanguage();

  const totalPages = Math.max(
    1,
    Math.ceil(websiteCards.length / WEBSITE_ITEMS_PER_PAGE),
  );

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * WEBSITE_ITEMS_PER_PAGE;
    return websiteCards.slice(start, start + WEBSITE_ITEMS_PER_PAGE);
  }, [currentPage]);

  return (
    <section className="col-span-4 space-y-3">
      <div className="card-base px-3 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-terminal-muted">
          <Globe size={13} className="text-terminal-accent" />
          <span className="text-[10px] uppercase tracking-[0.2em]">
            {t("website.sectionTitle")}
          </span>
        </div>
        <span className="text-[10px] text-terminal-muted/60 tabular-nums">
          {websiteCards.length} {t("website.items")}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {pageItems.map((item, index) => (
          <WebsiteCard key={item.id} item={item} index={index} lang={lang} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[10px] text-terminal-muted/60">
          <span className="tabular-nums">
            {t("website.pageLabel")} {currentPage}/{totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 border border-terminal-border/40 rounded-sm hover:border-terminal-accent/30 hover:text-terminal-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft size={12} />
            </button>
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
                  onClick={() => setCurrentPage(p)}
                  className={`w-6 h-6 border rounded-sm transition-all duration-200 tabular-nums ${
                    p === currentPage
                      ? "border-terminal-accent/40 text-terminal-accent bg-terminal-accent/5"
                      : "border-terminal-border/40 text-terminal-muted hover:border-terminal-borderHover hover:text-terminal-text"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 border border-terminal-border/40 rounded-sm hover:border-terminal-accent/30 hover:text-terminal-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
