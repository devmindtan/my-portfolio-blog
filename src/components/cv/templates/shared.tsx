import type { ReactNode } from "react";
import type { TechItem } from "../../../data/portfolio.types";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <h2
        style={{
          fontSize: "17px",
          fontWeight: "bold",
          color: "#1a1a1a",
          margin: "0 0 8px 0",
          paddingBottom: "5px",
          borderBottom: "2px solid #ddd",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
        }}
      >
        {title}
      </h2>
      <div style={{ textAlign: "justify", textJustify: "inter-word" }}>
        {children}
      </div>
    </div>
  );
}

export function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          fontSize: "9px",
          fontWeight: "bold",
          color: "#b6dcd6",
          marginBottom: "4px",
          paddingBottom: "2px",
          borderBottom: "1px solid rgba(182,220,214,0.3)",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

export function SkillsGrid({ techStack }: { techStack: TechItem[] }) {
  const categories = [
    "lang",
    "fe",
    "be",
    "db",
    "infra",
    "cicd",
    "data",
  ] as const;
  const labels: Record<string, string> = {
    lang: "Languages",
    fe: "Frontend",
    be: "Backend",
    db: "Database",
    infra: "Infrastructure",
    cicd: "CI/CD",
    data: "Data",
  };

  return (
    <div>
      {categories.map((cat) => {
        const items = techStack
          .filter((t) => t.category === cat)
          .map((t) => t.name);

        if (!items.length) return null;

        return (
          <div
            key={cat}
            style={{
              marginBottom: "6px",
              display: "flex",
              fontSize: "12px",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                width: "120px",
                paddingRight: "10px",
                flexShrink: 0,
                lineHeight: "1.6",
              }}
            >
              {labels[cat]}:
            </div>
            <div style={{ flex: 1, lineHeight: "1.6" }}>{items.join(", ")}</div>
          </div>
        );
      })}
    </div>
  );
}
