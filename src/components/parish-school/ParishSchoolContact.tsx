import Link from 'next/link';
import { ArrowRight, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { Mail, Phone } from 'lucide-react';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';
import type { ParishSchoolContact as ContactData } from '@/types/parishSchool';
import type { Locale } from '@/constants/i18n';

type ParishSchoolContactProps = {
  contact: ContactData;
  locale: Locale;
};

export default function ParishSchoolContact({
  contact,
  locale,
}: ParishSchoolContactProps) {
  return (
    <div className="relative max-w-3xl overflow-hidden rounded-2xl border border-brand-200/50 p-6 shadow-sm shadow-brand-900/[0.05] sm:p-8">
      <MosaicHueBackdrop />
      <span className="absolute inset-0 bg-white/48" aria-hidden="true" />
      <p className="relative text-base leading-relaxed text-stone-700 sm:text-lg">
        {contact.intro}
      </p>

      <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={`/${locale}${contact.guidelinesPath}`}
          className="group inline-flex items-center justify-center gap-2 rounded-xl border border-gold-300/80 bg-gold-100/60 px-5 py-3 text-sm font-medium text-brand-900 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-md hover:shadow-brand-900/[0.06] sm:text-base"
        >
          {contact.guidelinesLabel}
          <ArrowRight
            className="h-4 w-4 text-gold-600 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>

        <a
          href={`tel:${contact.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200/70 bg-white/80 px-5 py-3 text-sm font-medium text-brand-900 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand-300 sm:text-base"
        >
          <Phone className="h-4 w-4 text-gold-600" aria-hidden="true" />
          {contact.phone}
        </a>

        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200/70 bg-white/80 px-5 py-3 text-sm font-medium text-brand-900 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand-300 sm:text-base"
        >
          <Mail className="h-4 w-4 text-gold-600" aria-hidden="true" />
          {contact.email}
        </a>
      </div>
    </div>
  );
}
