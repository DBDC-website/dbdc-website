'use client';

import { Download, FileText, UserCheck, HardHat } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const registration = [
  {
    icon: UserCheck,
    title: 'Consultant Registration',
    body: 'Architects, engineers, surveyors, and other professionals can register their interest to work with the Diocese. Eligibility criteria and the application process will be published here.',
  },
  {
    icon: HardHat,
    title: 'Contractor Registration',
    body: 'Building and specialist contractors can apply to join the DBDC list of approved contractors. Requirements and assessment details will be published here.',
  },
] as const;

export function RegistrationCards() {
  return (
    <StaggerChildren as="div" className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      {registration.map(({ icon: Icon, title, body }) => (
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
              <Button variant="outline" size="sm" disabled>
                Register (coming soon)
              </Button>
            </div>
          </Card>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}

export function FormsCards() {
  return (
    <StaggerChildren as="div" className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <StaggerItem>
        <Card className="h-full border-cream-200/90 bg-white/90 p-6 shadow-sm shadow-brand-900/[0.04] sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
              <Download className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold text-brand-900 sm:text-xl">
              Download forms
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            Printable registration and submission forms (PDF) will be available
            for download.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-stone-600">
            <li className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gold-600" aria-hidden="true" />
              Consultant registration form (coming soon)
            </li>
            <li className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gold-600" aria-hidden="true" />
              Contractor registration form (coming soon)
            </li>
          </ul>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Card className="h-full border-cream-200/90 bg-white/90 p-6 shadow-sm shadow-brand-900/[0.04] sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
              <FileText className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold text-brand-900 sm:text-xl">
              Online forms
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            Secure online application forms will be added once the backend is in
            place, with validation and data protection built in.
          </p>
          <div className="mt-5">
            <Button variant="outline" size="sm" disabled>
              Open online form (coming soon)
            </Button>
          </div>
        </Card>
      </StaggerItem>
    </StaggerChildren>
  );
}
