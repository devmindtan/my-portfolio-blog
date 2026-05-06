import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 w-9 h-9 flex items-center justify-center
                 bg-terminal-card border border-terminal-border rounded-sm
                 text-terminal-muted hover:text-terminal-accent hover:border-terminal-accent/40
                 transition-all duration-300 shadow-lg shadow-terminal-bg/50
                 opacity-0 animate-fade-in"
      title={t("scroll.toTop")}
    >
      <ArrowUp size={14} />
    </button>
  );
}
