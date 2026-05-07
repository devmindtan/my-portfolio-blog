import type { CVTemplateProps } from "./templateTypes";
import type { TemplateKey } from "./types";
import { FONT_CSS } from "./types";
import MinimalTemplate from "./templates/MinimalTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";

interface CVContentProps extends CVTemplateProps {
  template: TemplateKey;
}

export default function CVContent({
  template,
  fontFamily,
  ...templateProps
}: CVContentProps) {
  const resolvedFont = fontFamily ?? FONT_CSS.georgia;

  const fontOverride = (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-cv-root], [data-cv-root] * { font-family: ${resolvedFont} !important; }`,
      }}
    />
  );

  if (template === "minimal") {
    return (
      <div data-cv-root>
        {fontOverride}
        <MinimalTemplate {...templateProps} fontFamily={resolvedFont} />
      </div>
    );
  }

  if (template === "modern") {
    return (
      <div data-cv-root>
        {fontOverride}
        <ModernTemplate {...templateProps} fontFamily={resolvedFont} />
      </div>
    );
  }

  return (
    <div data-cv-root>
      {fontOverride}
      <ExecutiveTemplate {...templateProps} fontFamily={resolvedFont} />
    </div>
  );
}
