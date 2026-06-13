import { parseSectionedCmsContent } from "@/lib/cms-defaults";

type Props = {
  content: string;
};

export function SectionedCmsContent({ content }: Props) {
  const sections = parseSectionedCmsContent(content);

  if (sections.length === 0) return null;

  return (
    <div className="space-y-10">
      {sections.map((section, index) => (
        <div key={`${section.heading}-${index}`}>
          {section.heading ? (
            <h2 className="text-2xl font-semibold tracking-tight text-white">{section.heading}</h2>
          ) : null}
          <div className={section.heading ? "mt-4 space-y-4" : "space-y-4"}>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className="text-lg leading-relaxed text-zinc-400">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
