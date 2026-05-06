import type { CVTemplateProps } from "./templateTypes";
import type { TemplateKey } from "./types";
import MinimalTemplate from "./templates/MinimalTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";

interface CVContentProps extends CVTemplateProps {
  template: TemplateKey;
}

export default function CVContent({
  template,
  ...templateProps
}: CVContentProps) {
  if (template === "minimal") {
    return <MinimalTemplate {...templateProps} />;
  }

  if (template === "modern") {
    return <ModernTemplate {...templateProps} />;
  }

  return <ExecutiveTemplate {...templateProps} />;
}
