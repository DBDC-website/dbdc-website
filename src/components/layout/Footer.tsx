import Link from 'next/link';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import Container from '@/components/ui/Container';
import PlaceholderBox from '@/components/ui/PlaceholderBox';
import type { Locale } from '@/constants/i18n';
import { contactInfo, mainNav, siteConfig } from '@/constants/site';
import { PICS_SHORT } from '@/constants/legal';

type FooterProps = {
  locale: Locale;
};

export default function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone-200 bg-brand-950 text-stone-300">
      <Container size="wide" className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-serif text-lg font-semibold text-white">
              {siteConfig.shortName}
            </p>
            <p className="mt-1 text-sm text-stone-400">{siteConfig.name}</p>

            <address className="mt-6 space-y-3 text-sm not-italic">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>
                  {contactInfo.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white hover:underline"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white hover:underline"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>{contactInfo.officeHours}</span>
              </div>
            </address>
          </div>

          <nav aria-label="Footer navigation" className="lg:col-span-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Explore
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className="text-stone-400 hover:text-white hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-200">
              Find us
            </h2>
            <div className="mt-4">
              <PlaceholderBox
                label="Office location map"
                description="An interactive map will be embedded here."
                aspect="aspect-[16/9]"
                className="border-stone-600 bg-brand-900/60 text-stone-300"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs leading-relaxed text-stone-400">{PICS_SHORT}</p>
          <p className="mt-4 text-xs text-stone-500">
            &copy; {year} {siteConfig.name}, {siteConfig.tagline}. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
