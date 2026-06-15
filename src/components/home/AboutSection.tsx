import { aboutDbdc } from '@/constants/about';

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-4 list-decimal space-y-3 pl-5 text-gray-700">
      {items.map((item) => (
        <li key={item} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ol>
  );
}

export default function AboutSection() {
  return (
    <section className="py-16" aria-labelledby="about-dbdc-heading">
      <h2
        id="about-dbdc-heading"
        className="text-2xl font-bold text-gray-900 md:text-3xl"
      >
        About DBDC
      </h2>
      <p className="mt-6 max-w-3xl leading-relaxed text-gray-700">
        {aboutDbdc.intro}
      </p>

      <h3 className="mt-12 text-xl font-bold text-gray-900">Objectives</h3>
      <NumberedList items={aboutDbdc.objectives} />

      <h3 className="mt-12 text-xl font-bold text-gray-900">Scope of work</h3>
      <NumberedList items={aboutDbdc.scopeOfWork} />
    </section>
  );
}
