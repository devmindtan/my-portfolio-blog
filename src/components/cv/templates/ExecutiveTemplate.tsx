import { useLanguage } from "../../../contexts/LanguageContext";
import type { CVTemplateProps } from "../templateTypes";
import { DEFAULT_CV_SECTION_ORDER } from "../types";
import { Section, SkillsGrid } from "./shared";

export default function ExecutiveTemplate({
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

  return (
    <div
      style={{
        backgroundColor: "#fff",
        fontFamily,
        fontSize: "13px",
        lineHeight: "1.6",
        color: "#2c3e50",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "#142e5c",
          color: "#fff",
          padding: "20px 24px",
          marginBottom: "16px",
        }}
      >
        <h1
          style={{ fontSize: "29px", fontWeight: "bold", margin: "0 0 6px 0" }}
        >
          {profile.name}
        </h1>
        <p
          style={{
            fontSize: "15px",
            fontStyle: "italic",
            margin: "0 0 8px 0",
            color: "#d6dce8",
          }}
        >
          {profile.title}
        </p>
        <div
          style={{ fontSize: "11px", color: "#d6dce8", marginBottom: "3px" }}
        >
          {[profile.email, profile.phone, profile.location]
            .filter(Boolean)
            .join(" | ")}
        </div>
        <div style={{ fontSize: "11px", color: "#d6dce8" }}>
          {[profile.website, profile.linkedin, profile.github]
            .filter(Boolean)
            .join(" | ")}
        </div>
      </div>
      <div style={{ padding: "0 24px" }}>
        <Section title={t("cv.summary")}>
          <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.6" }}>
            {profile.summary}
          </p>
        </Section>
        {orderedSections.map((sectionKey) => {
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
                          color: "#999",
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

          if (sectionKey === "skills" && techStack && techStack.length > 0) {
            return (
              <Section key={sectionKey} title={t("cv.skills")}>
                <SkillsGrid techStack={techStack} />
              </Section>
            );
          }

          if (
            sectionKey === "education" &&
            profile.education &&
            profile.education.length > 0
          ) {
            return (
              <Section key={sectionKey} title={t("cv.education")}>
                {profile.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: "6px", fontSize: "12px" }}>
                    <strong>{edu.degree}</strong> - {edu.school} ({edu.year})
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
                        marginBottom: "2px",
                      }}
                    >
                      <div
                        style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}
                      >
                        {proj.title} ({proj.tag})
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#999",
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
                          }}
                        >
                          {proj.actions.map((action, actionIndex) => (
                            <li key={`${proj.id}-executive-action-${actionIndex}`}>
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
                          color: "#2d569c",
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
                      {t("cv.tech")} {proj.tech.join(", ")}
                    </p>
                  </div>
                ))}
              </Section>
            );
          }

          if (sectionKey === "certifications" && certificates.length > 0) {
            return (
              <Section key={sectionKey} title={t("cv.certifications")}>
                {certificates.map((cert, i) => (
                  <div
                    key={i}
                    data-cv-item="true"
                    style={{ marginBottom: "6px", fontSize: "12px" }}
                  >
                    <strong>{cert.name}</strong> - {cert.issuer} ({cert.date})
                  </div>
                ))}
              </Section>
            );
          }

          return null;
        })}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "8px",
            borderTop: "1px solid #c8d2e0",
            fontSize: "10px",
            color: "#aaa",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{profile.name}</span>
          <span>{profile.email}</span>
        </div>
      </div>
    </div>
  );
}
