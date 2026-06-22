import PageHeader from '@/components/ui/PageHeader';
import PageSection from '@/components/ui/PageSection';

type LegalPageContentProps = {
  title: string;
  body: string[];
};

export default function LegalPageContent({ title, body }: LegalPageContentProps) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} />
      <PageSection containerSize="narrow">
        <div className="space-y-5 text-base leading-relaxed text-stone-700 sm:text-lg sm:leading-relaxed">
          {body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </PageSection>
    </>
  );
}
