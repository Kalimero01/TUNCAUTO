import { describe, expect, it } from "vitest";
import {
  VISION_MISSION_DEFAULTS,
  isVisionMissionPlaceholder,
  parseSectionedCmsContent,
} from "@/lib/cms-defaults";

describe("isVisionMissionPlaceholder", () => {
  it("detects empty and placeholder copy", () => {
    expect(isVisionMissionPlaceholder("")).toBe(true);
    expect(isVisionMissionPlaceholder("Unsere Vision und Mission werden in Kürze veröffentlicht.")).toBe(
      true,
    );
    expect(isVisionMissionPlaceholder("digitaler Exzellenz")).toBe(true);
  });

  it("keeps customized production content", () => {
    expect(isVisionMissionPlaceholder(VISION_MISSION_DEFAULTS.content)).toBe(false);
    expect(isVisionMissionPlaceholder("Individueller Text vom Inhaber.")).toBe(false);
  });
});

describe("parseSectionedCmsContent", () => {
  it("parses Vision and Mission sections with paragraphs", () => {
    const sections = parseSectionedCmsContent(VISION_MISSION_DEFAULTS.content);

    expect(sections).toHaveLength(2);
    expect(sections[0]?.heading).toBe("Vision");
    expect(sections[0]?.paragraphs).toHaveLength(2);
    expect(sections[1]?.heading).toBe("Mission");
    expect(sections[1]?.paragraphs).toHaveLength(2);
  });

  it("supports legacy markdown headings", () => {
    const sections = parseSectionedCmsContent(`**Unsere Vision**
Erster Absatz.

**Unsere Mission**
Zweiter Absatz.`);

    expect(sections[0]?.heading).toBe("Vision");
    expect(sections[1]?.heading).toBe("Mission");
  });
});
