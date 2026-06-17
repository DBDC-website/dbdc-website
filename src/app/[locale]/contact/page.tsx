import type { Metadata } from 'next';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import PlaceholderBox from '@/components/ui/PlaceholderBox';
import { contactInfo } from '@/constants/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact details for the Diocesan Building and Development Commission.',
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact"
        description="Reach the DBDC Office using the details below. Placeholder details for now."
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-brand-900">DBDC Office</h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <dt className="font-medium text-stone-900">Address</dt>
                  <dd className="mt-1 text-stone-600">
                    {contactInfo.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <dt className="font-medium text-stone-900">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-brand-700 hover:underline"
                    >
                      {contactInfo.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <dt className="font-medium text-stone-900">Phone</dt>
                  <dd className="mt-1 text-stone-600">{contactInfo.phone}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <dt className="font-medium text-stone-900">Office hours</dt>
                  <dd className="mt-1 text-stone-600">{contactInfo.officeHours}</dd>
                </div>
              </div>
            </dl>
          </Card>

          <div>
            <h2 className="text-lg font-semibold text-brand-900">Location</h2>
            <div className="mt-6">
              <PlaceholderBox
                label="Office location map"
                description="An interactive map will be embedded here."
                aspect="aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
