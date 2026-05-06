import {
  User,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  type LucideIcon,
} from "lucide-react";
import type { Profile } from "../data/portfolio";

interface AboutCardProps {
  profile: Profile;
}

interface ContactItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  external?: boolean;
}

interface ContactGroup {
  key: string;
  heading: string;
  items: ContactItem[];
}

type ProfileContactKey =
  | "location"
  | "email"
  | "phone"
  | "github"
  | "linkedin"
  | "website";

interface ContactFieldDefinition {
  key: ProfileContactKey;
  icon: LucideIcon;
  toHref?: (value: string) => string;
  external?: boolean;
}

interface ContactGroupDefinition {
  key: string;
  heading: string;
  fields: ContactFieldDefinition[];
}

const CONTACT_GROUP_DEFINITIONS: ContactGroupDefinition[] = [
  {
    key: "contact",
    heading: "contact",
    fields: [
      { key: "location", icon: MapPin },
      { key: "email", icon: Mail, toHref: (value) => `mailto:${value}` },
      {
        key: "phone",
        icon: Phone,
        toHref: (value) => `tel:${value.replace(/\s+/g, "")}`,
      },
    ],
  },
  {
    key: "links",
    heading: "links",
    fields: [
      {
        key: "github",
        icon: Github,
        toHref: (value) =>
          value.startsWith("http") ? value : `https://${value}`,
        external: true,
      },
      {
        key: "linkedin",
        icon: Linkedin,
        toHref: (value) =>
          value.startsWith("http") ? value : `https://${value}`,
        external: true,
      },
      {
        key: "website",
        icon: Globe,
        toHref: (value) => value,
        external: true,
      },
    ],
  },
];

// ── Primitives ───────────────────────────────────────────────────────────────

function IconBadge({ icon: Icon }: { icon: ContactItem["icon"] }) {
  return (
    <span className="p-1.5 rounded-sm border border-terminal-border/40 bg-terminal-highlight/20 group-hover:border-terminal-accent/40 transition-colors flex-shrink-0">
      <Icon size={11} />
    </span>
  );
}

function ContactRow({ item }: { item: ContactItem }) {
  const inner = (
    <>
      <IconBadge icon={item.icon} />
      <span className="truncate text-[11px]">{item.label}</span>
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className="flex items-center gap-2 text-terminal-text/75 hover:text-terminal-accent transition-colors group"
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-2 text-terminal-text/75 group">
      {inner}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function AboutCard({ profile }: AboutCardProps) {
  const hasEducation = profile.education?.length > 0;

  const contactGroups: ContactGroup[] = CONTACT_GROUP_DEFINITIONS.map(
    (group) => ({
      key: group.key,
      heading: group.heading,
      items: group.fields.reduce<ContactItem[]>((acc, field) => {
        const value = profile[field.key];
        if (!value) return acc;
        acc.push({
          icon: field.icon,
          label: value,
          href: field.toHref ? field.toHref(value) : undefined,
          external: field.external,
        });
        return acc;
      }, []),
    }),
  ).filter((group) => group.items.length > 0);

  return (
    <div className="col-span-4 card-base card-glow">
      <div className="terminal-header">
        <User size={11} />
        <span>about.md</span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="border border-terminal-border/30 rounded-sm bg-terminal-highlight/10 p-3 sm:p-4">
          <span className="text-[9px] text-terminal-muted/60 uppercase tracking-wider">
            profile summary detail
          </span>
          <p className="text-[11px] text-terminal-text/75 mt-1.5 leading-relaxed">
            {profile.detail}
          </p>
        </div>

        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {/* Contact groups — data-driven from CONTACT_GROUP_DEFINITIONS */}
          {contactGroups.map((group) => (
            <div
              key={group.key}
              className="border border-terminal-border/30 rounded-sm bg-terminal-highlight/10 p-3 sm:p-4 min-w-0"
            >
              <span className="text-[9px] text-terminal-muted/60 uppercase tracking-wider whitespace-nowrap">
                {group.heading}
              </span>
              <div className="mt-2 space-y-2">
                {group.items.map((item, i) => (
                  <ContactRow key={i} item={item} />
                ))}
              </div>
            </div>
          ))}

          {/* Education stays separate due distinct structure */}
          {hasEducation && (
            <div className="border border-terminal-border/30 rounded-sm bg-terminal-highlight/10 p-3 sm:p-4 min-w-0">
              <span className="flex items-center gap-1.5 text-[9px] text-terminal-muted/60 uppercase tracking-wider">
                <GraduationCap size={10} />
                education
              </span>
              <div className="mt-2 space-y-2">
                {profile.education.map((edu, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-terminal-accent/30 pl-3 min-w-0"
                  >
                    <div className="text-[11px] text-terminal-text/85 font-medium leading-snug">
                      {edu.degree}
                    </div>
                    <div className="text-[10px] text-terminal-muted/65 mt-0.5">
                      {edu.school}
                    </div>
                    <div className="text-[10px] text-terminal-accent/60 font-mono mt-0.5">
                      {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
