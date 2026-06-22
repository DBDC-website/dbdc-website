import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeading from '@/components/ui/SectionHeading';
import PlaceholderImage from '@/components/ui/PlaceholderImage';
import ScrollReveal from '@/components/motion/ScrollReveal';
import { aboutDbdc } from '@/constants/about';
import { homeImages } from '@/constants/homeImages';

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-6 space-y-5">
      {items.map((item, index) => (
        <li key={item} className="flex gap-4">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-sm font-semibold text-gold-800"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <span className="text-base leading-relaxed text-stone-700">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function SubsectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl font-semibold text-brand-900 sm:text-2xl">{children}</h3>
  );
}

function OrganizationChart() {
  return (
    <figure className="w-full">
      <figcaption className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
        Organization
      </figcaption>
      <div className="rounded-2xl border border-cream-200/90 bg-gradient-to-br from-white via-cream-50 to-brand-50/30 p-4 shadow-lg shadow-brand-900/5 ring-1 ring-brand-200/30 sm:p-5 lg:p-6">
        <PlaceholderImage
          src={homeImages.about.src}
          alt={homeImages.about.alt}
          fit="contain"
          width={homeImages.about.width}
          height={homeImages.about.height}
          overlay={false}
          className="w-full"
        />
      </div>
    </figure>
  );
}

export default function AboutSection() {
  return (
    <AnimatedSection id="about" tone="default" spacing="generous" aria-labelledby="about-dbdc-heading">
      <ScrollReveal>
        <SectionHeading
          id="about-dbdc-heading"
          eyebrow="About Us"
          title="About the DBDC"
          className="[&_h2]:text-4xl [&_h2]:sm:text-5xl"
        />
        <div
          className="mt-5 h-px w-20 bg-gradient-to-r from-gold-400 via-gold-300 to-transparent"
          aria-hidden="true"
        />
      </ScrollReveal>

      <div className="mt-10 grid gap-10 sm:mt-12 lg:mt-14 lg:grid-cols-12 lg:items-start lg:gap-14 xl:gap-16">
        <ScrollReveal delay={0.05} className="lg:col-span-5">
          <OrganizationChart />
        </ScrollReveal>

        <div className="flex flex-col gap-10 lg:col-span-7 lg:gap-12">
          <ScrollReveal delay={0.08}>
            <p className="text-lg leading-relaxed text-stone-700 sm:text-xl">
              {aboutDbdc.intro}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <SubsectionHeading>Objectives</SubsectionHeading>
            <NumberedList items={aboutDbdc.objectives} />
          </ScrollReveal>
        </div>
      </div>

      <ScrollReveal delay={0.15} className="mt-14 lg:mt-20">
        <SubsectionHeading>Scope of work</SubsectionHeading>
        <NumberedList items={aboutDbdc.scopeOfWork} />
      </ScrollReveal>
    </AnimatedSection>
  );
}
