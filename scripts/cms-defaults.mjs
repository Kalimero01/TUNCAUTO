export const VISION_MISSION_DEFAULTS = {
  title: "Vision & Mission",
  content: `Vision

Tunc Automobile soll die verlässliche Adresse für anspruchsvolle Gebrauchtwagen in Ahlen und der Region Hamm und Beckum sein. Wir verbinden Premium-Fahrzeuge mit ehrlicher Beratung und langfristigem Vertrauen — für jeden, der Wert auf Qualität und persönlichen Service legt.

Unser Ziel ist es, in unserer Region den Maßstab zu setzen: ein Autohaus, das für Integrität, kompetente Betreuung und Fahrzeuge steht, auf die man sich verlassen kann.

Mission

Jedes Fahrzeug wählen wir sorgfältig aus und prüfen es gewissenhaft, bevor es in unseren Bestand aufgenommen wird. Faire Preise und ein transparenter Kaufprozess sind für uns selbstverständlich — ohne versteckte Kosten und ohne leere Versprechen.

Von der ersten Beratung bis zur Schlüsselübergabe begleitet Sie unser Team persönlich. Ob beim Kauf, bei der Inzahlungnahme oder bei Fragen zur Finanzierung: Bei Tunc Automobile steht der Kunde im Mittelpunkt.`,
};

const VISION_MISSION_PLACEHOLDER_MARKERS = [
  "in kürze",
  "digitaler exzellenz",
  "unvergessliches kauferlebnis",
  "erste adresse für premium-fahrzeuge in deutschland",
];

export function isVisionMissionPlaceholder(content) {
  if (!content?.trim()) return true;
  const lower = content.toLowerCase();
  return VISION_MISSION_PLACEHOLDER_MARKERS.some((marker) => lower.includes(marker));
}
