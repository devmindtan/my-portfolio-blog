import { useLanguage } from "../contexts/LanguageContext";
import type { SiteConfig } from "../data/portfolio.types";

interface FooterProps {
  config: SiteConfig;
}

export default function Footer({ config }: FooterProps) {
  const { t } = useLanguage();
  return (
    <footer className="col-span-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-terminal-muted/40 uppercase tracking-wider">
      <span>
        {config.brand} {config.footer.version}
      </span>
      <span className="flex items-center gap-1.5">
        {t("footer.builtWith")}
        {config.footer.tech.map((t, i) => (
          <span key={t}>
            {i > 0 && <span>+ </span>}
            <span className="text-terminal-accent/40">{t}</span>
          </span>
        ))}
      </span>
      <span>{config.footer.year}</span>
    </footer>
  );
}
