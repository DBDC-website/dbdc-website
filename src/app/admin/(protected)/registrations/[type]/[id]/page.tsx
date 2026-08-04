import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteRegistrationButton from '@/components/admin/DeleteRegistrationButton';
import StatusActions from '@/components/admin/StatusActions';
import StatusBadge from '@/components/admin/StatusBadge';
import { isRegistrationType } from '@/constants/admin';
import {
  createSignedAssetUrl,
  createSignedAssetUrls,
  getRegistrationDetail,
} from '@/lib/admin/registrations';

type DetailPageProps = {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ updated?: string; error?: string }>;
};

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { type, id } = await params;
  return { title: `${type} #${id}` };
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value == null || value === '') return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-brand-950">{value}</dd>
    </div>
  );
}

function formatMoney(value: number | null) {
  if (value == null) return null;
  return `HKD ${value.toLocaleString('en-HK')}`;
}

function formatJsonList(value: unknown) {
  if (!Array.isArray(value)) return null;
  return value.filter((item) => typeof item === 'string').join(', ') || null;
}

export default async function RegistrationDetailPage({
  params,
  searchParams,
}: DetailPageProps) {
  const { type: typeRaw, id: idRaw } = await params;
  const { updated, error } = await searchParams;

  if (!isRegistrationType(typeRaw)) notFound();
  const id = Number(idRaw);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const detail = await getRegistrationDetail(typeRaw, id);
  if (!detail) notFound();

  const [documentLinks, contactSignatureUrls] = await Promise.all([
    createSignedAssetUrls(detail.documentUrls),
    Promise.all(
      detail.contacts.map(async (contact) => ({
        id: contact.id,
        url: await createSignedAssetUrl(contact.signatureUrl),
      })),
    ),
  ]);

  const contactSignatureMap = new Map(
    contactSignatureUrls.map((item) => [item.id, item.url]),
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/registrations"
          className="text-sm font-medium text-brand-800 hover:underline"
        >
          ← Back to registrations
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              {detail.type} registration
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-brand-900 sm:text-3xl">
              {detail.companyName}
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Submitted{' '}
              {new Date(detail.submittedAt).toLocaleString('en-HK', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={detail.status} />
            <a
              href={`/admin/registrations/${detail.type}/${detail.id}/download`}
              className="inline-flex items-center rounded-md border border-brand-300 bg-white px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50"
            >
              Download ZIP
            </a>
          </div>
        </div>
      </div>

      {updated ? (
        <p
          className="rounded-md border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-800"
          role="status"
        >
          Status updated successfully.
        </p>
      ) : null}
      {error === 'update' ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          Could not update status. Please try again.
        </p>
      ) : null}
      {error === 'delete' ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          Could not delete this registration. Please try again.
        </p>
      ) : null}

      {detail.status === 'pending' ? (
        <section className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-brand-900">Review</h2>
          <p className="mt-1 text-sm text-stone-600">
            Approve or reject this submission. Applicants are not emailed
            automatically — notify them manually if needed.
          </p>
          <div className="mt-4">
            <StatusActions type={detail.type} id={detail.id} />
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-brand-900">Company</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Email" value={detail.email} />
          <Field label="Telephone" value={detail.telephone} />
          <Field label="Fax" value={detail.fax} />
          <Field label="Website" value={detail.website} />
          <Field
            label="Registered address"
            value={detail.registeredAddress}
          />
          <Field
            label="Business registration no."
            value={detail.businessRegistrationNo}
          />
          <Field label="Registration date" value={detail.registrationDate} />
          <Field
            label="Nature of business"
            value={formatJsonList(detail.natureOfBusiness)}
          />
          <Field label="Scope of services" value={detail.scopeOfServices} />
          <Field
            label="Authorized capital"
            value={formatMoney(detail.capitalAuthorized)}
          />
          <Field
            label="Issued capital"
            value={formatMoney(detail.capitalIssued)}
          />
          <Field
            label="Available capital"
            value={formatMoney(detail.capitalAvailable)}
          />
          <Field label="Other approved lists" value={detail.otherApprovedLists} />
          <Field
            label="Audited accounts uploaded"
            value={detail.auditedAccountsProvided ? 'Yes' : 'No'}
          />
          {detail.type === 'consultant' ? (
            <>
              <Field
                label="AACSB listed"
                value={detail.aacsbListed ? 'Yes' : 'No'}
              />
              <Field label="AACSB date" value={detail.aacsbDate} />
              <Field
                label="EACSB listed date"
                value={detail.housingDeptApprovedDate}
              />
            </>
          ) : (
            <>
              <Field
                label="DevB approved"
                value={detail.asdWbApproved ? 'Yes' : 'No'}
              />
              <Field label="DevB date" value={detail.asdWbDate} />
              <Field
                label="Buildings Dept. reg. no."
                value={detail.buildingsDeptRegNo}
              />
              <Field
                label="Buildings Dept. date"
                value={detail.buildingsDeptDate}
              />
            </>
          )}
        </dl>
      </section>

      <section className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-brand-900">Contacts</h2>
        {detail.contacts.length === 0 ? (
          <p className="mt-3 text-sm text-stone-600">No contacts provided.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {detail.contacts.map((contact) => {
              const contactSignatureUrl = contactSignatureMap.get(contact.id);
              return (
              <li
                key={contact.id}
                className="rounded-lg border border-cream-100 bg-cream-50/70 px-4 py-3 text-sm"
              >
                <p className="font-medium text-brand-900">{contact.name}</p>
                <p className="text-stone-600">
                  {[contact.position, contact.telephone]
                    .filter(Boolean)
                    .join(' · ') || '—'}
                </p>
                {contactSignatureUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={contactSignatureUrl}
                    alt={`Signature for ${contact.name}`}
                    className="mt-3 max-h-32 rounded-md border border-cream-200 bg-white object-contain p-2"
                  />
                ) : contact.signatureUrl ? (
                  <p className="mt-2 text-xs text-stone-500">
                    Signature on file, but preview unavailable.
                  </p>
                ) : null}
              </li>
            );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-brand-900">
          Previous projects
        </h2>
        {detail.previousProjects.length === 0 ? (
          <p className="mt-3 text-sm text-stone-600">No projects provided.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {detail.previousProjects.map((project) => (
              <li
                key={project.id}
                className="rounded-lg border border-cream-100 bg-cream-50/70 px-4 py-3 text-sm"
              >
                <p className="font-medium text-brand-900">
                  {project.projectName}
                </p>
                <p className="mt-1 text-stone-600">
                  {[
                    project.projectAddress,
                    formatMoney(project.contractSum),
                    project.clientName,
                    project.architectEngineer,
                    [project.startDate, project.endDate]
                      .filter(Boolean)
                      .join(' → '),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-brand-900">
          Supporting documents
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Documents
            </p>
            {documentLinks.length === 0 ? (
              <p className="mt-2 text-sm text-stone-600">No documents uploaded.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {documentLinks.map(({ path, url }, index) => (
                  <li key={`${path}-${index}`} className="text-sm">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-brand-800 hover:underline"
                      >
                        Document {index + 1}
                      </a>
                    ) : (
                      <span className="text-stone-600">
                        Document {index + 1} (unavailable)
                      </span>
                    )}
                    <span className="ml-2 break-all text-xs text-stone-400">
                      {path}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-red-200 bg-red-50/50 p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-red-900">Delete registration</h2>
        <p className="mt-1 text-sm text-red-800/80">
          Permanently removes this submission, related contacts and projects, and
          uploaded signatures and documents from storage.
        </p>
        <div className="mt-4">
          <DeleteRegistrationButton
            type={detail.type}
            id={detail.id}
            companyName={detail.companyName}
          />
        </div>
      </section>
    </div>
  );
}
