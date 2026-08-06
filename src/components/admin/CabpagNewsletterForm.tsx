import Button from '@/components/ui/Button';
import {
  createCabpagNewsletter,
  deleteCabpagNewsletter,
  updateCabpagNewsletter,
} from '@/app/admin/actions/newsletters';
import type { AdminCabpagNewsletter } from '@/lib/admin/newsletters';

const fieldClass =
  'mt-1 w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm text-brand-950 shadow-sm placeholder:text-stone-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const labelClass = 'block text-sm font-medium text-brand-900';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
] as const;

type CabpagNewsletterFormProps = {
  newsletter?: AdminCabpagNewsletter;
};

function pdfFileName(url: string): string {
  try {
    const path = new URL(url).pathname;
    const name = path.split('/').pop();
    return name ? decodeURIComponent(name) : 'Current PDF';
  } catch {
    return 'Current PDF';
  }
}

export default function CabpagNewsletterForm({
  newsletter,
}: CabpagNewsletterFormProps) {
  const isEdit = Boolean(newsletter);
  const action = isEdit ? updateCabpagNewsletter : createCabpagNewsletter;
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-6">
        {isEdit && newsletter ? (
          <input type="hidden" name="id" value={newsletter.id} />
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title_en" className={labelClass}>
              Newsletter name (English)
            </label>
            <input
              id="title_en"
              name="title_en"
              required
              defaultValue={newsletter?.titleEn ?? ''}
              placeholder="CaBPAG Newsletter 2025"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="title_zh_hant" className={labelClass}>
              Name (Traditional Chinese)
            </label>
            <input
              id="title_zh_hant"
              name="title_zh_hant"
              defaultValue={newsletter?.titleZhHant ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="title_zh_hans" className={labelClass}>
              Name (Simplified Chinese)
            </label>
            <input
              id="title_zh_hans"
              name="title_zh_hans"
              defaultValue={newsletter?.titleZhHans ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="published_month" className={labelClass}>
              Month
            </label>
            <select
              id="published_month"
              name="published_month"
              required
              defaultValue={newsletter?.publishedMonth ?? ''}
              className={fieldClass}
            >
              <option value="" disabled>
                Select month
              </option>
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="published_year" className={labelClass}>
              Year
            </label>
            <input
              id="published_year"
              name="published_year"
              type="number"
              required
              min={1900}
              max={2100}
              defaultValue={newsletter?.publishedYear ?? currentYear}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="sort_order" className={labelClass}>
              Order
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min={1}
              defaultValue={isEdit ? (newsletter?.sortOrder ?? '') : ''}
              placeholder={isEdit ? undefined : 'Leave blank to add at top'}
              className={fieldClass}
            />
          </div>

          <div className="flex items-end pb-1">
            <label className="inline-flex items-center gap-2 text-sm text-brand-900">
              <input
                type="checkbox"
                name="active"
                defaultChecked={newsletter?.active ?? true}
                className="h-4 w-4 rounded border-cream-300 text-brand-800 focus:ring-brand-500"
              />
              Published on the CaBPAG page
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-cream-200 bg-cream-50/60 p-4">
          <p className={labelClass}>Document or link</p>
          <p className="mt-1 text-xs text-stone-500">
            Provide a PDF upload and/or an external URL. At least one is
            required. If both are set, the uploaded PDF is used on the public
            page.
          </p>

          <div className="mt-4">
            <label htmlFor="external_url" className={labelClass}>
              External link (optional)
            </label>
            <input
              id="external_url"
              name="external_url"
              type="url"
              placeholder="https://…"
              defaultValue={newsletter?.externalUrl ?? ''}
              className={fieldClass}
            />
          </div>

          {newsletter?.pdfUrl ? (
            <p className="mt-4 text-sm text-stone-700">
              Current PDF:{' '}
              <a
                href={newsletter.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand-800 hover:underline"
              >
                {pdfFileName(newsletter.pdfUrl)}
              </a>
            </p>
          ) : (
            <p className="mt-4 text-sm text-stone-500">No PDF uploaded yet.</p>
          )}

          {isEdit && newsletter?.pdfUrl ? (
            <input
              type="hidden"
              name="existing_pdf_url"
              value={newsletter.pdfUrl}
            />
          ) : null}

          <div className="mt-4">
            <label htmlFor="pdf" className="text-sm font-medium text-stone-700">
              {isEdit ? 'Upload a new PDF to replace it' : 'Upload PDF'}
              <span className="font-normal text-stone-500"> (optional)</span>
            </label>
            <input
              id="pdf"
              name="pdf"
              type="file"
              accept="application/pdf,.pdf"
              className="mt-1 block w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
            />
            <p className="mt-1 text-xs text-stone-500">PDF · max 25MB</p>
          </div>

          <div className="mt-4">
            <label
              htmlFor="pdf_filename"
              className="text-sm font-medium text-stone-700"
            >
              Storage file name (optional)
            </label>
            <input
              id="pdf_filename"
              name="pdf_filename"
              placeholder="cabpag-newsletter-2025.pdf"
              defaultValue={
                newsletter?.pdfUrl ? pdfFileName(newsletter.pdfUrl) : ''
              }
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-cream-200 pt-6">
          <Button type="submit">
            {isEdit ? 'Save changes' : 'Add newsletter'}
          </Button>
          <Button href="/admin/newsletters" variant="outline">
            Cancel
          </Button>
        </div>
      </form>

      {isEdit && newsletter ? (
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
          <p className="text-sm font-medium text-red-900">Delete newsletter</p>
          <p className="mt-1 text-xs text-red-800/80">
            Removes this entry from the CaBPAG page list.
          </p>
          <form action={deleteCabpagNewsletter} className="mt-3">
            <input type="hidden" name="id" value={newsletter.id} />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-red-300 text-red-800 hover:bg-red-50"
            >
              Delete permanently
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
