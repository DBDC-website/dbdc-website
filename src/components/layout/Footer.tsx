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

const footerLinkClass =
  'text-brand-800/80 transition-colors hover:text-brand-950 hover:underline decoration-gold-400/80';

const footerHeadingClass =
  'text-sm font-semibold uppercase tracking-wide text-brand-900';

export default function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gold-400/45 bg-gradient-to-b from-[#e9dcc1] via-[#e2d2b4] to-[#d9c49e] text-stone-800">
      <Container size="wide" className="py-6 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-x-6">
          {/* Column 1: Explore */}
          <nav aria-label="Footer navigation" className="min-w-0 flex-1">
            <h2 className={footerHeadingClass}>Explore</h2>
            <ul className="mt-2 space-y-1.5 text-xs leading-snug sm:text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={`/${locale}${item.href}`} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 2: DBDC contact */}
          <div className="min-w-0 flex-1">
            <p className="font-serif text-sm font-semibold leading-tight text-brand-950 sm:text-base">
              {siteConfig.shortName}
            </p>
            <p className="mt-1 text-xs leading-snug text-stone-600 sm:text-sm">
              {siteConfig.name}
            </p>

            <address className="mt-3 space-y-2 text-xs not-italic leading-snug sm:text-sm">
              <div className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                  aria-hidden="true"
                />
                <span className="text-stone-700">
                  {contactInfo.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                <a href={`mailto:${contactInfo.email}`} className={footerLinkClass}>
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                  className={footerLinkClass}
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
                <span className="text-stone-700">{contactInfo.officeHours}</span>
              </div>
            </address>
          </div>

          {/* Column 3: Legal links */}
          <nav aria-label="Legal" className="min-w-0 flex-1">
            <h2 className={footerHeadingClass}>Legal</h2>
            <ul className="mt-2 space-y-1.5 text-xs leading-snug sm:text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={`/${locale}${link.href}`} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Find us */}
          <div className="min-w-0 flex-1">
            <h2 className={`text-left ${footerHeadingClass}`}>Find us</h2>
            <a
              href="https://www.google.com/maps/place/%E5%A4%A9%E4%B8%BB%E6%95%99%E9%A6%99%E6%B8%AF%E6%95%99%E5%8D%80%EF%BC%8C%E6%95%99%E5%8D%80%E4%B8%AD%E5%BF%83/@22.2785009,114.1495479,15.38z/data=!4m15!1m7!3m6!1s0x3404007aec05dbf7:0x201f5ea45a557578!2z5aSp5Li75pWZ6aaZ5riv5pWZ5Y2A77yM5pWZ5Y2A5Lit5b-D!8m2!3d22.2796715!4d114.153943!16s%2Fg%2F11f3448gfj!3m6!1s0x3404007aec05dbf7:0x201f5ea45a557578!8m2!3d22.2796715!4d114.153943!15sCh3kuK3nkrDloIXpgZMxNuiZn-aVmeWNgOS4reW_g5IBD2NhdGhvbGljX2NodXJjaA!16s%2Fg%2F11f3448gfj?entry=ttu&g_ep=EgoyMDI2MDYxMy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block h-40 w-full overflow-hidden rounded-lg border border-gold-300/70 bg-cream-50 shadow-sm shadow-brand-900/[0.06] ring-1 ring-gold-200/50 transition-shadow hover:shadow-md hover:shadow-brand-900/[0.08]"
            >
              <img
                src="/images/map.png"
                alt="Map location of DBDC Office"
                className="h-full w-full object-cover"
              />
            </a>
          </div>
        </div>

        <div
          className="mt-6 border-t border-gold-300/45 pt-4"
          aria-hidden="true"
        />

        <p className="text-center text-[11px] leading-tight text-stone-500 sm:text-xs">
          &copy; {year} {siteConfig.name}, {siteConfig.tagline}. All rights
          reserved.
        </p>
      </Container>
    </footer>
  );
}
