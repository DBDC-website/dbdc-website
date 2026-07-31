'use client';

import { UserCheck, HardHat } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Locale } from '@/constants/i18n';
import { t } from '@/lib/i18n';

const registration = [
  {
    icon: UserCheck,
    titleKey: 'consultants.consultantTitle',
    bodyKey: 'consultants.consultantBody',
    ctaKey: 'consultants.consultantCta',
    slug: 'consultant',
  },
  {
    icon: HardHat,
    titleKey: 'consultants.contractorTitle',
    bodyKey: 'consultants.contractorBody',
    ctaKey: 'consultants.contractorCta',
    slug: 'contractor',
  },
] as const;

export function RegistrationCards({ locale }: { locale: Locale }) {
  return (
    <StaggerChildren as="div" className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      {registration.map(({ icon: Icon, titleKey, bodyKey, ctaKey, slug }) => (
        <StaggerItem key={slug}>
          <Card className="h-full border-cream-200/90 bg-white/90 p-6 shadow-sm shadow-brand-900/[0.04] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-brand-900 sm:text-xl">
                {t(locale, titleKey)}
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
              {t(locale, bodyKey)}
            </p>
            <div className="mt-5">
              <Button
                href={`/${locale}/consultants-contractors/${slug}`}
                variant="primary"
                size="sm"
              >
                {t(locale, ctaKey)}
              </Button>
            </div>
          </Card>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
