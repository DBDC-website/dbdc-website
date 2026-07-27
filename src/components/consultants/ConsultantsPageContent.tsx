'use client';

import { UserCheck, HardHat } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const registration = [
  {
    icon: UserCheck,
    title: 'Consultant Registration',
    body: 'Architects, engineers, surveyors, and other professionals can apply to join the DBDC list of registered consultants.',
    slug: 'consultant',
    cta: 'Register as a consultant',
  },
  {
    icon: HardHat,
    title: 'Contractor Registration',
    body: 'Building and specialist contractors can apply to join the DBDC list of approved contractors.',
    slug: 'contractor',
    cta: 'Register as a contractor',
  },
] as const;

export function RegistrationCards({ locale }: { locale: string }) {
  return (
    <StaggerChildren as="div" className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      {registration.map(({ icon: Icon, title, body, slug, cta }) => (
        <StaggerItem key={title}>
          <Card className="h-full border-cream-200/90 bg-white/90 p-6 shadow-sm shadow-brand-900/[0.04] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-brand-900 sm:text-xl">{title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">{body}</p>
            <div className="mt-5">
              <Button
                href={`/${locale}/consultants-contractors/${slug}`}
                variant="primary"
                size="sm"
              >
                {cta}
              </Button>
            </div>
          </Card>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}

