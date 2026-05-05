import { Mail, Github, Linkedin, ArrowUpRight, Facebook } from "lucide-react";
import type { SiteConfig } from "../data/portfolio";

interface ContactCardProps {
  config: SiteConfig;
}

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number | string }>
> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  facebook: Facebook,
};

export default function ContactCard({ config }: ContactCardProps) {
  return (
    <div className="col-span-4 sm:col-span-2 card-base card-glow">
      <div className="terminal-header">
        <Mail size={11} />
        <span>contact.sh</span>
      </div>
      <div className="p-4 sm:p-5 space-y-3">
        <p className="text-xs text-terminal-text/70 leading-relaxed">
          {config.contact.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {config.contact.links.map((link) => {
            const Icon = iconMap[link.icon] || Mail;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider
                           border border-terminal-border/50 text-terminal-muted
                           hover:border-terminal-accent/40 hover:text-terminal-accent
                           transition-all duration-200 rounded-sm group"
              >
                <Icon size={11} />
                {link.label}
                <ArrowUpRight
                  size={9}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
