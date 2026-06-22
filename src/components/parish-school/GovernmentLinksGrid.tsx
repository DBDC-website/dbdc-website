'use client';

import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import Card from '@/components/ui/Card';

type GovernmentLink = {
  name: string;
  href: string;
};

export default function GovernmentLinksGrid({ links }: { links: GovernmentLink[] }) {
  return (
    <StaggerChildren as="ul" className="grid gap-4 sm:grid-cols-2 lg:gap-6">
      {links.map((link) => (
        <StaggerItem key={link.name} as="li">
          <Card as="div" interactive className="border-cream-200/90 bg-white/90 shadow-sm shadow-brand-900/[0.04]">
            <a
              href={link.href}
              className="flex items-center justify-between gap-3 p-5 font-medium text-brand-900 sm:p-6"
            >
              {link.name}
              <ExternalLinkIcon
                className="h-4 w-4 shrink-0 text-gold-600"
                aria-hidden="true"
              />
            </a>
          </Card>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
