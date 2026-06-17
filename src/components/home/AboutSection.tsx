import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { aboutDbdc } from '@/constants/about';

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-5 space-y-4">
      {items.map((item, index) => (
        <li key={item} className="flex gap-4">
          <span
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <span className="leading-relaxed text-stone-700">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default function AboutSection() {
  return (
    <Section id="about" tone="default" aria-labelledby="about-dbdc-heading">
      <SectionHeading
        id="about-dbdc-heading"
        eyebrow="About Us"
        title="About the DBDC"
      />
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone-700">
        {aboutDbdc.intro}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold text-brand-900">Objectives</h3>
          <NumberedList items={aboutDbdc.objectives} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-brand-900">Scope of work</h3>
          <NumberedList items={aboutDbdc.scopeOfWork} />
        </div>
      </div>
    </Section>
  );
}
