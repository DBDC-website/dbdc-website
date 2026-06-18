import PageHeader from '@/components/ui/PageHeader';
import Section from '@/components/ui/Section';

type LegalPageContentProps = {
  title: string;
  body: string[];
};

export default function LegalPageContent({ title, body }: LegalPageContentProps) {
  return (
    <>
      <PageHeader title={title} />
      <Section containerSize="narrow">
        <div className="space-y-4 text-base leading-relaxed text-stone-700">
          {body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </Section>
    </>
  );
}
