import JSZip from 'jszip';
import { REGISTRATION_BUCKET } from '@/constants/admin';
import { createClient } from '@/lib/supabase/server';
import type { AdminRegistrationDetail } from '@/lib/admin/registrations';

function toObjectPath(storedPath: string): string {
  const prefix = `${REGISTRATION_BUCKET}/`;
  return storedPath.startsWith(prefix)
    ? storedPath.slice(prefix.length)
    : storedPath;
}

function basenameFromStoredPath(storedPath: string): string {
  const objectPath = toObjectPath(storedPath);
  const parts = objectPath.split('/');
  const raw = parts[parts.length - 1] || 'file';
  // Paths are `{timestamp}-{uuid}-{originalName}` — keep the original suffix when present.
  const match = raw.match(/^\d+-[0-9a-f-]+-(.+)$/i);
  return match?.[1] ?? raw;
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120) || 'file';
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function displayText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return '';
}

function formatDate(value: unknown): string {
  const text = displayText(value);
  if (!text) return '';
  // Prefer readable local date when value is ISO / YYYY-MM-DD.
  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(text)) {
    return parsed.toLocaleDateString('en-HK', { dateStyle: 'medium' });
  }
  return text;
}

function formatMoney(value: unknown): string {
  if (value == null || value === '') return '';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `HKD ${value.toLocaleString('en-HK')}`;
  }
  const text = displayText(value);
  if (!text) return '';
  const asNumber = Number(text.replace(/,/g, ''));
  if (Number.isFinite(asNumber) && text.replace(/,/g, '').match(/^\d+(\.\d+)?$/)) {
    return `HKD ${asNumber.toLocaleString('en-HK')}`;
  }
  return text;
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatTypeLabel(type: AdminRegistrationDetail['type']): string {
  return type === 'consultant' ? 'Consultant' : 'Contractor';
}

const DOCUMENT_FOLDER_LABELS: Record<string, string> = {
  'business-registration': 'Business registration certificate',
  'audited-accounts': 'Audited accounts',
  aacsb: 'AACSB list documents',
  eacsb: 'EACSB list documents',
  'buildings-dept': 'Buildings Department registration',
  devb: 'DevB list documents',
  'previous-projects': 'Previous project documents',
  'other-approved-lists': 'Other approved list documents',
  other: 'Other documents',
};

function fieldRow(label: string, value: string, emptyLabel = 'Not provided'): string {
  const filled = value.trim().length > 0;
  const shown = filled ? escapeHtml(value) : emptyLabel;
  const valueClass = filled ? 'value' : 'value empty';
  return `<div class="field"><div class="label">${escapeHtml(label)}</div><div class="${valueClass}">${shown}</div></div>`;
}

function yesNoRow(label: string, value: boolean | undefined | null): string {
  return fieldRow(label, value ? 'Yes' : 'No');
}

function listBlock(items: string[]): string {
  if (items.length === 0) {
    return `<div class="value empty">Not provided</div>`;
  }
  return `<ul class="list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function section(title: string, body: string): string {
  return `<section class="section"><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function parseOtherApprovedListEntries(
  detail: AdminRegistrationDetail,
): Array<{ listName: string; listedDate: string; documentCount: number }> {
  const professional = asRecord(detail.professionalDetails);
  const fromDetails = Array.isArray(professional.otherApprovedListEntries)
    ? professional.otherApprovedListEntries
    : [];

  let fromColumn: unknown[] = [];
  if (detail.otherApprovedLists) {
    try {
      const parsed = JSON.parse(detail.otherApprovedLists) as unknown;
      if (Array.isArray(parsed)) fromColumn = parsed;
    } catch {
      // leave empty; raw text handled separately below
    }
  }

  const source = fromDetails.length > 0 ? fromDetails : fromColumn;
  return source
    .map((entry) => {
      const record = asRecord(entry);
      const docs = asStringArray(record.documentUrls ?? record.document_urls);
      return {
        listName: displayText(record.listName ?? record.list_name),
        listedDate: formatDate(record.listedDate ?? record.listed_date),
        documentCount: docs.length,
      };
    })
    .filter(
      (entry) =>
        entry.listName || entry.listedDate || entry.documentCount > 0,
    );
}

function natureOfBusinessItems(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function consultantProfessionalHtml(professional: Record<string, unknown>): string {
  const categories = asStringArray(professional.authorizedPersonCategories);
  const selected: string[] = [];
  if (categories.length > 0) {
    selected.push(`Authorized Person — Category ${categories.join(', ')}`);
  }
  if (professional.registeredStructuralEngineer) {
    selected.push('Registered Structural Engineer');
  }
  if (professional.registeredGeotechnicalEngineer) {
    selected.push('Registered Geotechnical Engineer');
  }
  if (professional.authorizedLandSurveyor) {
    selected.push('Authorised Land Surveyor');
  }
  if (professional.registeredInspector) {
    selected.push(
      'Registered Inspector (R.I.) under Section 3(3B) of the Building Ordinance',
    );
  }
  if (professional.registeredEnergyAssessor) {
    selected.push('Registered Energy Assessors (REA)');
  }

  const otherProfessionals = Array.isArray(professional.otherRegisteredProfessionals)
    ? professional.otherRegisteredProfessionals
        .map((entry) => {
          const record = asRecord(entry);
          const name = displayText(record.professional);
          const no = displayText(record.no);
          if (!name && !no) return null;
          return [name, no ? `No. ${no}` : ''].filter(Boolean).join(' — ');
        })
        .filter((item): item is string => Boolean(item))
    : [];

  return [
    `<div class="subsection"><h3>Selected registrations</h3>${listBlock(selected)}</div>`,
    `<div class="grid">`,
    fieldRow('Professional', displayText(professional.professionalName)),
    fieldRow('Professional no.', displayText(professional.professionalNo)),
    `</div>`,
    otherProfessionals.length > 0
      ? `<div class="subsection"><h3>Additional registered professionals</h3>${listBlock(otherProfessionals)}</div>`
      : '',
  ].join('');
}

function contractorProfessionalHtml(professional: Record<string, unknown>): string {
  const selected: string[] = [];
  if (professional.authorizedPerson) selected.push('Authorized Person (A.P.)');
  if (professional.architect) selected.push('Architect');
  if (professional.siteEngineer) selected.push('Engineer');
  if (professional.buildingSurveyor) selected.push('Building Surveyor');
  if (professional.quantitySurveyor) selected.push('Quantity Surveyor');
  if (professional.registeredInspector) {
    selected.push(
      'Registered Inspector (R.I.) under Section 3(3B) of the Building Ordinance',
    );
  }
  if (professional.registeredEnergyAssessor) {
    selected.push('Registered Energy Assessors (REA)');
  }
  if (professional.otherProfessional) {
    const specify = displayText(professional.otherProfessionalSpecify);
    selected.push(specify ? `Others: ${specify}` : 'Others');
  }

  return `<div class="subsection"><h3>Selected in-house professionals</h3>${listBlock(selected)}</div>`;
}

/** Printable HTML summary of the registration form for non-technical users. */
export function buildRegistrationSummaryHtml(
  detail: AdminRegistrationDetail,
): string {
  const professional = asRecord(detail.professionalDetails);
  const natureItems = natureOfBusinessItems(detail.natureOfBusiness);
  const otherLists = parseOtherApprovedListEntries(detail);
  const categorized = collectCategorizedDocumentPaths(detail);
  const typeLabel = formatTypeLabel(detail.type);
  const submittedAt = new Date(detail.submittedAt).toLocaleString('en-HK', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const companySection = section(
    'Company information',
    `<div class="grid">
      ${fieldRow('Company name', detail.companyName)}
      ${fieldRow('Registered address', displayText(detail.registeredAddress))}
      ${fieldRow('Telephone', displayText(detail.telephone))}
      ${fieldRow('Fax', displayText(detail.fax))}
      ${fieldRow('Email', displayText(detail.email))}
      ${fieldRow('Website', displayText(detail.website))}
    </div>`,
  );

  const natureSection = section(
    'Nature of business',
    natureItems.length > 0
      ? listBlock(natureItems)
      : `<div class="value empty">Not provided</div>`,
  );

  const scopeSection = section(
    'Scope of services',
    fieldRow('Scope of services', displayText(detail.scopeOfServices)),
  );

  const businessRegSection = section(
    'Business registration certificate',
    `<div class="grid">
      ${fieldRow('Business registration cert. no.', displayText(detail.businessRegistrationNo))}
      ${fieldRow('Business registration date', formatDate(detail.registrationDate))}
    </div>`,
  );

  const capitalSection = section(
    'Company capital',
    `<div class="grid">
      ${fieldRow('Authorized capital', formatMoney(detail.capitalAuthorized))}
      ${fieldRow('Issued capital', formatMoney(detail.capitalIssued))}
      ${fieldRow('Available capital', formatMoney(detail.capitalAvailable))}
    </div>`,
  );

  const professionalSection = section(
    'In-house professional',
    detail.type === 'consultant'
      ? consultantProfessionalHtml(professional)
      : contractorProfessionalHtml(professional),
  );

  let approvalsBody = '';
  if (detail.type === 'consultant') {
    approvalsBody = `<div class="card">
      ${yesNoRow('List of Consultants of AACSB', detail.aacsbListed)}
      ${fieldRow('Date of listed (AACSB)', formatDate(detail.aacsbDate))}
    </div>
    <div class="card">
      ${yesNoRow('List of consultants of EACSB', detail.housingDeptApproved)}
      ${fieldRow('Date of listed (EACSB)', formatDate(detail.housingDeptApprovedDate))}
    </div>`;
  } else {
    approvalsBody = `<div class="card">
      ${fieldRow('Buildings Department Registration No.', displayText(detail.buildingsDeptRegNo))}
      ${fieldRow('Date of Registration / Renewal', formatDate(detail.buildingsDeptDate))}
    </div>
    <div class="card">
      ${yesNoRow('DevB List of Approved Contractors', detail.asdWbApproved)}
      ${fieldRow('Date of listed (DevB)', formatDate(detail.asdWbDate))}
    </div>`;
  }

  if (otherLists.length > 0) {
    approvalsBody += otherLists
      .map(
        (entry, index) => `<div class="card">
          <h3>Other approved list ${index + 1}</h3>
          <div class="grid">
            ${fieldRow('List name', entry.listName)}
            ${fieldRow('Date of listed', entry.listedDate)}
            ${fieldRow('Supporting documents', entry.documentCount > 0 ? `${entry.documentCount} file(s) in ZIP` : 'None')}
          </div>
        </div>`,
      )
      .join('');
  } else if (
    detail.otherApprovedLists &&
    detail.otherApprovedLists.trim() &&
    !detail.otherApprovedLists.trim().startsWith('[')
  ) {
    approvalsBody += fieldRow('Other approved lists', detail.otherApprovedLists);
  }

  const approvalsSection = section(
    'Approved lists & professional registrations',
    approvalsBody || `<div class="value empty">None selected</div>`,
  );

  const contactsBody =
    detail.contacts.length === 0
      ? `<div class="value empty">None provided</div>`
      : detail.contacts
          .map((contact, index) => {
            const signatureFile = contact.signatureUrl
              ? `signatures/contact-${index + 1}-${sanitizeFileName(contact.name)}.png`
              : '';
            return `<div class="card">
              <h3>Contact ${index + 1}</h3>
              <div class="grid">
                ${fieldRow('Name', contact.name)}
                ${fieldRow('Post', displayText(contact.position))}
                ${fieldRow('Telephone', displayText(contact.telephone))}
                ${fieldRow('Signature', signatureFile ? `Included in ZIP as ${signatureFile}` : 'Not provided')}
              </div>
            </div>`;
          })
          .join('');

  const contactsSection = section('Principals / Directors', contactsBody);

  const projectsBody =
    detail.previousProjects.length === 0
      ? `<div class="value empty">None provided</div>`
      : detail.previousProjects
          .map(
            (project, index) => `<div class="card">
              <h3>Project ${index + 1}</h3>
              <div class="grid">
                ${fieldRow('Project name', project.projectName)}
                ${fieldRow('Project address', displayText(project.projectAddress))}
                ${fieldRow('Contract sum', formatMoney(project.contractSum))}
                ${fieldRow('Client', displayText(project.clientName))}
                ${fieldRow('Architect / Engineer', displayText(project.architectEngineer))}
                ${fieldRow('Start date', formatDate(project.startDate))}
                ${fieldRow('End date', formatDate(project.endDate))}
              </div>
            </div>`,
          )
          .join('');

  const projectsSection = section(
    'Major projects completed in the past 5 years',
    projectsBody,
  );

  const preferencesSection = section(
    'Accounts',
    `<div class="grid">
      ${yesNoRow('Audited accounts uploaded', detail.auditedAccountsProvided)}
    </div>`,
  );

  const documentBlocks = Object.entries(categorized)
    .filter(([, paths]) => paths.length > 0)
    .map(([folder, paths]) => {
      const label = DOCUMENT_FOLDER_LABELS[folder] ?? folder;
      return `<div class="card">
        <h3>${escapeHtml(label)}</h3>
        ${listBlock(paths.map((path) => basenameFromStoredPath(path)))}
      </div>`;
    });

  const documentsSection = section(
    'Uploaded documents included in this ZIP',
    documentBlocks.length > 0
      ? documentBlocks.join('')
      : `<div class="value empty">No documents uploaded</div>`,
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DBDC ${escapeHtml(typeLabel)} Registration — ${escapeHtml(detail.companyName)}</title>
  <style>
    :root {
      --ink: #1c1917;
      --muted: #57534e;
      --line: #e7e5e4;
      --bg: #fafaf9;
      --card: #ffffff;
      --brand: #1e3a5f;
      --accent: #8a6d3b;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      background: var(--bg);
      font: 15px/1.5 "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    }
    .page {
      max-width: 880px;
      margin: 0 auto;
      padding: 32px 20px 64px;
    }
    .hero {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 24px 28px;
      margin-bottom: 20px;
    }
    .eyebrow {
      margin: 0 0 6px;
      color: var(--accent);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      color: var(--brand);
      font-size: 28px;
      line-height: 1.2;
    }
    .meta {
      margin-top: 14px;
      display: grid;
      gap: 8px 24px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
    .meta .label { color: var(--muted); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .meta .value { margin-top: 2px; font-weight: 600; }
    .section {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 22px 28px;
      margin-bottom: 16px;
    }
    h2 {
      margin: 0 0 16px;
      color: var(--brand);
      font-size: 18px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 8px;
    }
    h3 {
      margin: 0 0 10px;
      color: var(--ink);
      font-size: 14px;
    }
    .grid {
      display: grid;
      gap: 14px 20px;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .field .label {
      color: var(--muted);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }
    .field .value {
      margin-top: 3px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .value.empty { color: #a8a29e; font-style: italic; }
    .list { margin: 0; padding-left: 1.2rem; }
    .list li { margin: 0.25rem 0; }
    .card {
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 14px 16px;
      margin-top: 12px;
      background: #fcfcfb;
    }
    .subsection { margin-top: 8px; }
    .note {
      margin-top: 18px;
      color: var(--muted);
      font-size: 13px;
    }
    @media print {
      body { background: white; }
      .page { padding: 0; max-width: none; }
      .section, .hero, .card { break-inside: avoid; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="hero">
      <p class="eyebrow">Diocesan Building and Development Commission</p>
      <h1>${escapeHtml(typeLabel)} Registration Form</h1>
      <div class="meta">
        <div><div class="label">Company</div><div class="value">${escapeHtml(detail.companyName)}</div></div>
        <div><div class="label">Reference</div><div class="value">DBDC-${escapeHtml(detail.type.toUpperCase())}-${detail.id}</div></div>
        <div><div class="label">Status</div><div class="value">${escapeHtml(formatStatus(detail.status))}</div></div>
        <div><div class="label">Submitted</div><div class="value">${escapeHtml(submittedAt)}</div></div>
      </div>
      <p class="note">Open this file in a browser to review. Uploaded documents and signature images are in the folders inside this ZIP.</p>
    </header>
    ${companySection}
    ${natureSection}
    ${scopeSection}
    ${businessRegSection}
    ${capitalSection}
    ${professionalSection}
    ${approvalsSection}
    ${contactsSection}
    ${projectsSection}
    ${preferencesSection}
    ${documentsSection}
  </div>
</body>
</html>`;
}

type CategorizedDocs = Record<string, string[]>;

function collectCategorizedDocumentPaths(
  detail: AdminRegistrationDetail,
): CategorizedDocs {
  const professional = asRecord(detail.professionalDetails);
  const categorized: CategorizedDocs = {
    'business-registration': asStringArray(
      professional.businessRegistrationDocumentUrls,
    ),
    'audited-accounts': asStringArray(professional.auditedAccountDocumentUrls),
    aacsb: asStringArray(professional.aacsbDocumentUrls),
    eacsb: asStringArray(professional.eacsbDocumentUrls),
    'buildings-dept': asStringArray(professional.buildingsDeptDocumentUrls),
    devb: asStringArray(professional.devbDocumentUrls),
    'previous-projects': [],
    'other-approved-lists': [],
    other: [],
  };

  const previousUploads = professional.previousProjectUploads;
  if (Array.isArray(previousUploads)) {
    for (const entry of previousUploads) {
      const record = asRecord(entry);
      categorized['previous-projects'].push(...asStringArray(record.documentUrls));
    }
  }

  const otherEntries = professional.otherApprovedListEntries;
  if (Array.isArray(otherEntries)) {
    for (const entry of otherEntries) {
      const record = asRecord(entry);
      categorized['other-approved-lists'].push(
        ...asStringArray(record.documentUrls),
      );
    }
  }

  // Also parse stringified other_approved_lists column if present.
  if (detail.otherApprovedLists) {
    try {
      const parsed = JSON.parse(detail.otherApprovedLists) as unknown;
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          const record = asRecord(entry);
          categorized['other-approved-lists'].push(
            ...asStringArray(
              record.documentUrls ?? record.document_urls,
            ),
          );
        }
      }
    } catch {
      // keep raw text in summary only
    }
  }

  const assigned = new Set(
    Object.values(categorized)
      .flat()
      .map((path) => toObjectPath(path)),
  );

  for (const path of detail.documentUrls) {
    const key = toObjectPath(path);
    if (!assigned.has(key)) {
      categorized.other.push(path);
      assigned.add(key);
    }
  }

  // Deduplicate within each folder
  for (const folder of Object.keys(categorized)) {
    const seen = new Set<string>();
    categorized[folder] = categorized[folder].filter((path) => {
      const key = toObjectPath(path);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return categorized;
}

async function downloadStorageFile(
  storedPath: string,
): Promise<{ bytes: Uint8Array; fileName: string } | null> {
  const supabase = await createClient();
  const objectPath = toObjectPath(storedPath);
  const { data, error } = await supabase.storage
    .from(REGISTRATION_BUCKET)
    .download(objectPath);

  if (error || !data) {
    console.error('Failed to download registration asset:', objectPath, error);
    return null;
  }

  // Node/JSZip does not reliably accept the Blob returned by supabase-js —
  // convert to Uint8Array before adding to the archive.
  const bytes = new Uint8Array(await data.arrayBuffer());

  return {
    bytes,
    fileName: basenameFromStoredPath(storedPath),
  };
}

function uniqueZipPath(used: Set<string>, folder: string, fileName: string): string {
  const safe = sanitizeFileName(fileName);
  let candidate = `${folder}/${safe}`;
  let counter = 2;
  while (used.has(candidate.toLowerCase())) {
    const dot = safe.lastIndexOf('.');
    const stem = dot > 0 ? safe.slice(0, dot) : safe;
    const ext = dot > 0 ? safe.slice(dot) : '';
    candidate = `${folder}/${stem}-${counter}${ext}`;
    counter += 1;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

export async function buildRegistrationZip(
  detail: AdminRegistrationDetail,
): Promise<Uint8Array> {
  const zip = new JSZip();
  const usedPaths = new Set<string>();
  const missing: string[] = [];

  zip.file('Registration-Form.html', buildRegistrationSummaryHtml(detail));
  zip.file(
    'registration-data.json',
    JSON.stringify(
      {
        ...detail,
        exportGeneratedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  const categorized = collectCategorizedDocumentPaths(detail);
  for (const [folder, paths] of Object.entries(categorized)) {
    for (const path of paths) {
      const downloaded = await downloadStorageFile(path);
      if (!downloaded) {
        missing.push(path);
        continue;
      }
      const zipPath = uniqueZipPath(
        usedPaths,
        `documents/${folder}`,
        downloaded.fileName,
      );
      zip.file(zipPath, downloaded.bytes);
    }
  }

  for (let index = 0; index < detail.contacts.length; index += 1) {
    const contact = detail.contacts[index];
    if (!contact.signatureUrl) continue;

    const downloaded = await downloadStorageFile(contact.signatureUrl);
    if (!downloaded) {
      missing.push(contact.signatureUrl);
      continue;
    }

    const preferredName = `contact-${index + 1}-${sanitizeFileName(contact.name)}.png`;
    const zipPath = uniqueZipPath(usedPaths, 'signatures', preferredName);
    zip.file(zipPath, downloaded.bytes);
  }

  // Legacy denormalized signature on the parent row (if not already included).
  if (detail.signatureUrl) {
    const alreadyIncluded = detail.contacts.some(
      (contact) =>
        contact.signatureUrl &&
        toObjectPath(contact.signatureUrl) === toObjectPath(detail.signatureUrl!),
    );
    if (!alreadyIncluded) {
      const downloaded = await downloadStorageFile(detail.signatureUrl);
      if (downloaded) {
        const zipPath = uniqueZipPath(
          usedPaths,
          'signatures',
          `registration-signature-${downloaded.fileName}`,
        );
        zip.file(zipPath, downloaded.bytes);
      } else {
        missing.push(detail.signatureUrl);
      }
    }
  }

  if (missing.length > 0) {
    zip.file(
      'MISSING_FILES.txt',
      [
        'The following storage paths could not be downloaded:',
        ...missing.map((path) => `- ${path}`),
        '',
      ].join('\n'),
    );
  }

  const output = await zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return output;
}

export function registrationZipFileName(detail: AdminRegistrationDetail): string {
  const company = sanitizeFileName(detail.companyName).replace(/\s+/g, '-');
  return `DBDC-${detail.type}-${detail.id}-${company}.zip`;
}
