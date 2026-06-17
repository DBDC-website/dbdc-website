import Container from './Container';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

/** Consistent page banner for interior routes. Renders the page's <h1>. */
export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="relative isolate overflow-hidden bg-brand-900">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_15%,rgba(210,167,60,0.16),transparent_55%)]"
        aria-hidden="true"
      />
      <Container size="wide" className="py-14 sm:py-16">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-200">
            {description}
          </p>
        ) : null}
      </Container>
    </div>
  );
}
