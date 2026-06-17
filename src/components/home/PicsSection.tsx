import { ShieldCheck } from 'lucide-react';
import Section from '@/components/ui/Section';
import { PICS_SHORT } from '@/constants/legal';

export default function PicsSection() {
  return (
    <Section tone="muted" spacing="compact" aria-labelledby="pics-heading">
      <div className="flex gap-4 rounded-xl border border-gold-200 bg-gold-50 px-5 py-5">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
        <div>
          <h2 id="pics-heading" className="text-sm font-semibold text-gold-900">
            Personal Information Collection Statement
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gold-900/90">
            {PICS_SHORT}
          </p>
        </div>
      </div>
    </Section>
  );
}
