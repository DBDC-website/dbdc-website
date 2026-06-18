import Link from 'next/link';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import Container from '@/components/ui/Container';
import type { Locale } from '@/constants/i18n';
import { contactInfo, mainNav, siteConfig } from '@/constants/site';

type FooterProps = {
  locale: Locale;
};

const legalLinks = [
  { href: '/copyright-disclaimer', label: 'Copyright & Disclaimer' },
  { href: '/privacy-policy', label: 'Privacy Policy Statement' },
  { href: '/pics', label: 'Personal Information Collection Statement' },
] as const;

export default function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone-200 bg-brand-950 text-stone-300">
      <Container size="wide" className="py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-x-3">
          {/* Column 1: Explore */}
          <nav aria-label="Footer navigation" className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-200">
              Explore
            </h2>
            <ul className="mt-1 space-y-1 text-xs leading-snug">
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

          {/* Column 2: DBDC contact */}
          <div className="min-w-0 flex-1">
            <p className="font-serif text-sm font-semibold leading-tight text-white">
              {siteConfig.shortName}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-stone-400">
              {siteConfig.name}
            </p>

            <address className="mt-1.5 space-y-1 text-xs not-italic leading-snug">
              <div className="flex items-start gap-1.5">
                <MapPin
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400"
                  aria-hidden="true"
                />
                <span>
                  {contactInfo.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden="true" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white hover:underline"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden="true" />
                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white hover:underline"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0 text-gold-400" aria-hidden="true" />
                <span>{contactInfo.officeHours}</span>
              </div>
            </address>
          </div>

          {/* Column 3: Legal links */}
          <nav aria-label="Legal" className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-200">
              Legal
            </h2>
            <ul className="mt-1 space-y-1 text-xs leading-snug">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-stone-400 hover:text-white hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Find us */}
          <div className="min-w-0 flex-1">
            <h2 className="text-left text-sm font-semibold uppercase tracking-wide text-stone-200">
              Find us
            </h2>
            <a
              href="https://www.google.com/maps/place/%E5%A4%A9%E4%B8%BB%E6%95%99%E9%A6%99%E6%B8%AF%E6%95%99%E5%8D%80%EF%BC%8C%E6%95%99%E5%8D%80%E4%B8%AD%E5%BF%83/@22.2785009,114.1495479,15.38z/data=!4m15!1m7!3m6!1s0x3404007aec05dbf7:0x201f5ea45a557578!2z5aSp5Li75pWZ6aaZ5riv5pWZ5Y2A77yM5pWZ5Y2A5Lit5b-D!8m2!3d22.2796715!4d114.153943!16s%2Fg%2F11f3448gfj!3m6!1s0x3404007aec05dbf7:0x201f5ea45a557578!8m2!3d22.2796715!4d114.153943!15sCh3kuK3nkrDloIXpgZMxNuiZn-aVmeWNgOS4reW_g5IBD2NhdGhvbGljX2NodXJjaA!16s%2Fg%2F11f3448gfj?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block h-40 w-full overflow-hidden rounded border border-stone-600"
            >
              <img
                src="/images/map.png"
                alt="Map location of DBDC Office"
                className="h-full w-full object-cover"
              />
            </a>
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] leading-tight text-stone-500">
          &copy; {year} {siteConfig.name}, {siteConfig.tagline}. All rights
          reserved.
        </p>
      </Container>
    </footer>
  );
}
