import { useLanguage } from "../../../contexts/LanguageContext";
import type { CVTemplateProps } from "../templateTypes";
import { DEFAULT_CV_SECTION_ORDER } from "../types";
import { Section, SidebarSection } from "./shared";

export default function ModernTemplate({
  profile,
  projects,
  certificates,
  techStack,
  includedSections,
  sectionOrder = DEFAULT_CV_SECTION_ORDER,
  fontFamily = "Georgia, 'Times New Roman', serif",
}: CVTemplateProps) {
  const { t } = useLanguage();
  const orderedSections = sectionOrder.filter((key) => includedSections[key]);
  const sidebarOrder = orderedSections.filter(
    (key) => key === "skills" || key === "education" || key === "certifications",
  );
  const mainOrder = orderedSections.filter(
    (key) => key === "experience" || key === "projects",
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        backgroundColor: "#fff",
        fontFamily,
        fontSize: "13px",
        lineHeight: "1.6",
      }}
    >
      <div
        style={{
          width: "170px",
          backgroundColor: "#122430",
          color: "#bcd6d2",
          padding: "20px 14px 24px",
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      >
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt=""
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              margin: "0 auto 10px",
            }}
          />
        )}
        <h2
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            textAlign: "center",
            color: "#fff",
            margin: "0 0 4px 0",
            lineHeight: "1.35",
          }}
        >
          {profile.name}
        </h2>
        <p
          style={{
            fontSize: "10.5px",
            fontStyle: "italic",
            textAlign: "center",
            margin: "0 0 14px 0",
            color: "#bcd6d2",
            lineHeight: "1.35",
          }}
        >
          {profile.title}
        </p>
        <SidebarSection title={t("cv.contact")}>
          <div style={{ fontSize: "9.5px", lineHeight: "1.65" }}>
            {profile.email && (
              <div style={{ wordBreak: "break-all" }}>{profile.email}</div>
            )}
            {profile.phone && <div>{profile.phone}</div>}
            {profile.location && <div>{profile.location}</div>}
            {profile.linkedin && (
              <div style={{ wordBreak: "break-all", marginTop: "2px" }}>
                {profile.linkedin}
              </div>
            )}
            {profile.github && (
              <div style={{ wordBreak: "break-all" }}>{profile.github}</div>
            )}
          </div>
        </SidebarSection>
        {sidebarOrder.map((sectionKey) => {
          if (sectionKey === "skills" && techStack && techStack.length > 0) {
            return (
              <SidebarSection key={sectionKey} title={t("cv.skills")}>
                {(() => {
                  const labels: Record<string, string> = {
                    lang: "Languages",
                    fe: "Frontend",
                    be: "Backend",
                    db: "Database",
                    infra: "Infrastructure",
                    cicd: "CI/CD",
                    data: "Data",
                    net: "Network",
                  };
                  const categories = Array.from(
                    new Set(techStack.map((item) => item.category)),
                  );

                  return categories.map((category) => {
                    const names = techStack
                      .filter((item) => item.category === category)
                      .map((item) => item.name);

                    if (names.length === 0) return null;

                    return (
                      <div
                        key={`sidebar-skill-${category}`}
                        style={{ marginBottom: "5px", fontSize: "9.5px" }}
                      >
                        <div style={{ fontWeight: "bold", color: "#fff" }}>
                          {labels[category] ?? category}:
                        </div>
                        <div style={{ opacity: 0.85, lineHeight: "1.35" }}>
                          {names.join(", ")}
                        </div>
                      </div>
                    );
                  });
                })()}
              </SidebarSection>
            );
          }

          if (
            sectionKey === "education" &&
            profile.education &&
            profile.education.length > 0
          ) {
            return (
              <SidebarSection key={sectionKey} title={t("cv.education")}>
                {profile.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: "5px", fontSize: "9.5px" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#fff",
                        lineHeight: "1.35",
                      }}
                    >
                      {edu.degree}
                    </div>
                    <div style={{ lineHeight: "1.35", opacity: 0.85 }}>
                      {edu.school}, {edu.year}
                    </div>
                  </div>
                ))}
              </SidebarSection>
            );
          }

          if (sectionKey === "certifications" && certificates.length > 0) {
            return (
              <SidebarSection key={sectionKey} title={t("cv.certifications")}>
                {certificates.map((cert, i) => (
                  <div key={i} style={{ marginBottom: "6px", fontSize: "9.5px" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#fff",
                        lineHeight: "1.35",
                      }}
                    >
                      {cert.name}
                    </div>
                    <div
                      style={{ lineHeight: "1.3", opacity: 0.75, fontSize: "9px" }}
                    >
                      {cert.date}
                    </div>
                  </div>
                ))}
              </SidebarSection>
            );
          }

          return null;
        })}
      </div>
      <div
        style={{
          flex: 1,
          padding: "20px 24px 24px",
          color: "#2c3e50",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Section title={t("cv.summary")}>
          <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.6" }}>
            {profile.summary}
          </p>
        </Section>
        {mainOrder.map((sectionKey) => {
          if (sectionKey === "experience") {
            return (
              <Section key={sectionKey} title={t("cv.experience")}>
                {profile.experience.map((exp, i) => (
                  <div key={i} data-cv-item="true" style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "2px",
                      }}
                    >
                      <div
                        style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}
                      >
                        {exp.role}
                        {exp.organization && (
                          <span style={{ fontWeight: "normal" }}>
                            {" "}
                            - {exp.organization}
                          </span>
                        )}
                        <span
                          style={{
                            fontWeight: "normal",
                            fontSize: "12px",
                            textTransform: "uppercase",
                            color: "#777",
                            marginLeft: "8px",
                          }}
                        >
                          [{exp.type}]
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          fontStyle: "italic",
                          marginLeft: "8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {exp.period}
                      </div>
                    </div>
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      }}
                    >
                      {exp.description}
                    </p>
                  </div>
                ))}
              </Section>
            );
          }

          if (sectionKey === "projects" && projects.length > 0) {
            return (
              <Section key={sectionKey} title={t("cv.projects")}>
                {projects.map((proj, i) => (
                  <div key={i} data-cv-item="true" style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "3px",
                      }}
                    >
                      <div
                        style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}
                      >
                        {proj.title}{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#0e6e64",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          - {proj.tag}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginLeft: "8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {proj.created_at}
                      </div>
                    </div>
                    <p
                      style={{
                        margin: "2px 0",
                        fontSize: "13px",
                        lineHeight: "1.5",
                      }}
                    >
                      <strong>{t("cv.problem")}</strong> {proj.problem}
                    </p>
                    {proj.actions.length > 0 && (
                      <div style={{ margin: "4px 0" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "bold",
                            marginBottom: "2px",
                          }}
                        >
                          {t("cv.actions")}
                        </div>
                        <ul
                          style={{
                            margin: "0 0 0 18px",
                            padding: 0,
                            fontSize: "13px",
                            lineHeight: "1.45",
                            listStyleType: "disc",
                            listStylePosition: "outside",
                          }}
                        >
                          {proj.actions.map((action, actionIndex) => (
                            <li key={`${proj.id}-modern-action-${actionIndex}`}>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {proj.results && proj.results.length > 0 && (
                      <p
                        style={{
                          margin: "2px 0",
                          fontSize: "13px",
                          lineHeight: "1.5",
                          color: "#0e6e64",
                          fontWeight: "bold",
                        }}
                      >
                        {t("cv.results")}{" "}
                        {proj.results
                          .map((r) => `${r.value} ${r.label}`)
                          .join(" • ")}
                      </p>
                    )}
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "12px",
                        color: "#888",
                      }}
                    >
                      {t("cv.tech")} {proj.tech.slice(0, 5).join(", ")}
                    </p>
                  </div>
                ))}
              </Section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
