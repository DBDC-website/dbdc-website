import type { Metadata } from 'next';
import { Download, FileText, UserCheck, HardHat } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Consultants & Contractors',
  description:
    'Registration information and forms for consultants and contractors working with the DBDC.',
};

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
];

export default function ConsultantsContractorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work With Us"
        title="Consultants & Contractors"
        description="Registration information, downloadable forms, and online applications for consultants and contractors."
      />

      <Section aria-labelledby="registration-heading">
        <SectionHeading
          id="registration-heading"
          eyebrow="Get Registered"
          title="Registration"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {registration.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-brand-900">{title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{body}</p>
              <div className="mt-5">
                <Button variant="outline" size="sm" disabled>
                  Register (coming soon)
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="muted" aria-labelledby="forms-heading">
        <SectionHeading
          id="forms-heading"
          eyebrow="Resources"
          title="Forms"
          description="Downloadable and online forms will be made available here."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                <Download className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-brand-900">
                Download forms
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Printable registration and submission forms (PDF) will be available
              for download.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-stone-500">
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4" aria-hidden="true" />
                Consultant registration form (coming soon)
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4" aria-hidden="true" />
                Contractor registration form (coming soon)
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-brand-900">
                Online forms
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Secure online application forms will be added once the backend is in
              place, with validation and data protection built in.
            </p>
            <div className="mt-5">
              <Button variant="outline" size="sm" disabled>
                Open online form (coming soon)
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
