export const VISION_MISSION_DEFAULTS = {
  title: "Vision & Mission",
  content: `Vision

Tunc Automobile soll die verlässliche Adresse für anspruchsvolle Gebrauchtwagen in Ahlen und der Region Hamm und Beckum sein. Wir verbinden Premium-Fahrzeuge mit ehrlicher Beratung und langfristigem Vertrauen — für jeden, der Wert auf Qualität und persönlichen Service legt.

Unser Ziel ist es, in unserer Region den Maßstab zu setzen: ein Autohaus, das für Integrität, kompetente Betreuung und Fahrzeuge steht, auf die man sich verlassen kann.

Mission

Jedes Fahrzeug wählen wir sorgfältig aus und prüfen es gewissenhaft, bevor es in unseren Bestand aufgenommen wird. Faire Preise und ein transparenter Kaufprozess sind für uns selbstverständlich — ohne versteckte Kosten und ohne leere Versprechen.

Von der ersten Beratung bis zur Schlüsselübergabe begleitet Sie unser Team persönlich. Ob beim Kauf, bei der Inzahlungnahme oder bei Fragen zur Finanzierung: Bei Tunc Automobile steht der Kunde im Mittelpunkt.`,
} as const;

const VISION_MISSION_PLACEHOLDER_MARKERS = [
  "in kürze",
  "digitaler exzellenz",
  "unvergessliches kauferlebnis",
  "erste adresse für premium-fahrzeuge in deutschland",
] as const;

export function isVisionMissionPlaceholder(content: string | null | undefined): boolean {
  if (!content?.trim()) return true;
  const lower = content.toLowerCase();
  return VISION_MISSION_PLACEHOLDER_MARKERS.some((marker) => lower.includes(marker));
}

export type CmsSection = {
  heading: string;
  paragraphs: string[];
};

function normalizeHeading(line: string): string | null {
  const trimmed = line.trim().replace(/^\*\*|\*\*$/g, "").trim();
  if (/^vision$/i.test(trimmed) || /^unsere vision$/i.test(trimmed)) return "Vision";
  if (/^mission$/i.test(trimmed) || /^unsere mission$/i.test(trimmed)) return "Mission";
  return null;
}

export function parseSectionedCmsContent(content: string): CmsSection[] {
  const blocks = content.trim().split(/\n\n+/).filter(Boolean);
  const sections: CmsSection[] = [];
  let current: CmsSection | null = null;

  for (const block of blocks) {
    const lines = block.split("\n");
    const heading = normalizeHeading(lines[0] ?? "");

    if (heading) {
      if (current) sections.push(current);
      current = { heading, paragraphs: [] };
      const body = lines.slice(1).join("\n").trim();
      if (body) current.paragraphs.push(body);
      continue;
    }

    if (current) {
      current.paragraphs.push(block.trim());
      continue;
    }

    sections.push({ heading: "", paragraphs: [block.trim()] });
  }

  if (current) sections.push(current);
  return sections;
}
