import { useLanguage } from "../../../contexts/LanguageContext";
import type { CVTemplateProps } from "../templateTypes";
import { Section, SkillsGrid } from "./shared";

export default function MinimalTemplate({
  profile,
  projects,
  certificates,
  techStack,
  includedSections,
  renderMode = "print",
  fontFamily = "Georgia, 'Times New Roman', serif",
}: CVTemplateProps) {
  const { t } = useLanguage();
  const minimalPadding = renderMode === "preview" ? "24px " : "0px";

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: minimalPadding,
        fontFamily,
        fontSize: "13px",
        lineHeight: "1.7",
        color: "#2c3e50",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "33px",
            fontWeight: "bold",
            margin: "0 0 6px 0",
            color: "#1a1a1a",
          }}
        >
          {profile.name}
        </h1>
        <p
          style={{
            fontSize: "15px",
            fontStyle: "italic",
            margin: "0 0 12px 0",
            color: "#555",
          }}
        >
          {profile.title}
        </p>
        <div style={{ fontSize: "11px", color: "#777", marginBottom: "4px" }}>
          {[profile.email, profile.phone, profile.location]
            .filter(Boolean)
            .join(" • ")}
        </div>
        <div style={{ fontSize: "11px", color: "#777" }}>
          {[profile.website, profile.linkedin, profile.github]
            .filter(Boolean)
            .join(" • ")}
        </div>
      </div>
      <hr
        style={{
          margin: "16px 0",
          border: "none",
          borderTop: "2px solid #ddd",
        }}
      />
      <Section title={t("cv.summary")}>
        <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.7" }}>
          {profile.summary}
        </p>
      </Section>
      {includedSections.experience && (
        <Section title={t("cv.experience")}>
          {profile.experience.map((exp, i) => (
            <div key={i} data-cv-item="true" style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "4px",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}>
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
                  margin: "0",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: "#444",
                }}
              >
                {exp.description}
              </p>
            </div>
          ))}
        </Section>
      )}
      {includedSections.skills && techStack && techStack.length > 0 && (
        <Section title={t("cv.skills")}>
          <SkillsGrid techStack={techStack} />
        </Section>
      )}
      {includedSections.education &&
        profile.education &&
        profile.education.length > 0 && (
          <Section title={t("cv.education")}>
            {profile.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "8px", fontSize: "12px" }}>
                <strong>{edu.degree}</strong> - {edu.school} ({edu.year})
              </div>
            ))}
          </Section>
        )}
      {includedSections.projects && projects.length > 0 && (
        <Section title={t("cv.projects")}>
          {projects.map((proj, i) => (
            <div key={i} data-cv-item="true" style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "4px",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "14px", flex: 1 }}>
                  {proj.title} ({proj.tag})
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
                style={{ margin: "3px 0", fontSize: "13px", lineHeight: "1.6" }}
              >
                <strong>{t("cv.problem")}</strong> {proj.problem}
              </p>
              {proj.actions.length > 0 && (
                <div style={{ margin: "5px 0" }}>
                  <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                    {t("cv.actions")}
                  </div>
                  <ul
                    style={{
                      margin: "4px 0 0 18px",
                      padding: 0,
                      fontSize: "13px",
                      lineHeight: "1.5",
                      listStyleType: "disc",
                      listStylePosition: "outside",
                    }}
                  >
                    {proj.actions.map((action, actionIndex) => (
                      <li key={`${proj.id}-minimal-action-${actionIndex}`}>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {proj.results && proj.results.length > 0 && (
                <p
                  style={{
                    margin: "3px 0",
                    fontSize: "13px",
                    lineHeight: "1.6",
                  }}
                >
                  <strong>{t("cv.results")}</strong>{" "}
                  {proj.results.map((r) => `${r.value} ${r.label}`).join(" • ")}
                </p>
              )}
              <p style={{ margin: "3px 0", fontSize: "12px", color: "#666" }}>
                <strong>{t("cv.tech")}</strong> {proj.tech.join(", ")}
              </p>
            </div>
          ))}
        </Section>
      )}
      {includedSections.certifications && certificates.length > 0 && (
        <Section title={t("cv.certifications")}>
          {certificates.map((cert, i) => (
            <div key={i} data-cv-item="true" style={{ marginBottom: "8px" }}>
              <div style={{ fontWeight: "bold", fontSize: "12px" }}>
                {cert.name} - {cert.issuer} ({cert.date})
              </div>
              {cert.credentialId && (
                <div
                  style={{ fontSize: "10px", color: "#777", marginTop: "2px" }}
                >
                  ID: {cert.credentialId}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}
      <div
        style={{
          marginTop: "24px",
          paddingTop: "8px",
          borderTop: "1px solid #ddd",
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
  );
}
