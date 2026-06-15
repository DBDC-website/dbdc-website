import { PICS_SHORT } from '@/constants/legal';

export default function PicsSection() {
  return (
    <section
      className="border-t border-gray-200 py-16"
      aria-labelledby="pics-heading"
    >
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-5">
        <h2 id="pics-heading" className="text-sm font-semibold text-amber-900">
          Personal Information Collection Statement
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
          {PICS_SHORT}
        </p>
      </div>
    </section>
  );
}
