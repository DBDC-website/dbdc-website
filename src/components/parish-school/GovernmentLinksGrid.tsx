'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import Card from '@/components/ui/Card';
import type { Locale } from '@/constants/i18n';
import type { ResourceLink } from '@/types/parishSchool';

type GovernmentLinksGridProps = {
  links: ResourceLink[];
  locale: Locale;
};

export default function GovernmentLinksGrid({ links, locale }: GovernmentLinksGridProps) {
  return (
    <StaggerChildren as="ul" className="grid gap-4 sm:grid-cols-2 lg:gap-6">
      {links.map((link) => (
        <StaggerItem key={link.href} as="li">
          <Card
            as="div"
            interactive
            className="h-full border-cream-200/90 bg-white/90 shadow-sm shadow-brand-900/[0.04]"
          >
            {link.external === false ? (
              <Link
                href={`/${locale}${link.href}`}
                className="flex h-full flex-col justify-between gap-3 p-5 sm:p-6"
              >
                <div className="min-w-0">
                  <span className="font-medium text-brand-900">{link.name}</span>
                  {link.description ? (
                    <p className="mt-1 text-sm text-stone-600">{link.description}</p>
                  ) : null}
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 self-end text-gold-600"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col justify-between gap-3 p-5 sm:p-6"
              >
                <div className="min-w-0">
                  <span className="font-medium text-brand-900">{link.name}</span>
                  {link.description ? (
                    <p className="mt-1 text-sm text-stone-600">{link.description}</p>
                  ) : null}
                </div>
                <ExternalLinkIcon
                  className="h-4 w-4 shrink-0 self-end text-gold-600"
                  aria-hidden="true"
                />
              </a>
            )}
          </Card>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
