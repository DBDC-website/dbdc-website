import Button from '@/components/ui/Button';
import {
  createArticle,
  deleteArticle,
  updateArticle,
} from '@/app/admin/actions/articles';
import type { AdminArticle } from '@/lib/admin/articles';

const fieldClass =
  'mt-1 w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm text-brand-950 shadow-sm placeholder:text-stone-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const labelClass = 'block text-sm font-medium text-brand-900';

type ArticleFormProps = {
  article?: AdminArticle;
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

export default function ArticleForm({ article }: ArticleFormProps) {
  const isEdit = Boolean(article);
  const action = isEdit ? updateArticle : createArticle;

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-6">
        {isEdit && article ? (
          <input type="hidden" name="id" value={article.id} />
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title_en" className={labelClass}>
              Title (English)
            </label>
            <input
              id="title_en"
              name="title_en"
              required
              defaultValue={article?.titleEn ?? ''}
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-stone-500">
              Only this field is required. Everything else can be filled in later.
            </p>
          </div>

          <div>
            <label htmlFor="title_zh_hant" className={labelClass}>
              Title (Traditional Chinese)
            </label>
            <input
              id="title_zh_hant"
              name="title_zh_hant"
              defaultValue={article?.titleZhHant ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="title_zh_hans" className={labelClass}>
              Title (Simplified Chinese)
            </label>
            <input
              id="title_zh_hans"
              name="title_zh_hans"
              defaultValue={article?.titleZhHans ?? ''}
              className={fieldClass}
            />
          </div>

          <p className="text-xs text-stone-500 sm:col-span-2">
            The PDF itself stays in its original language. Translate the title
            only when a published Chinese title exists; otherwise leave blank
            and English is shown.
          </p>

          <div>
            <label htmlFor="label_en" className={labelClass}>
              Label (English)
            </label>
            <input
              id="label_en"
              name="label_en"
              placeholder="Auto (I, II, III…)"
              defaultValue={article?.labelEn ?? ''}
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-stone-500">
              Leave blank to auto-assign a Roman numeral from the article order.
            </p>
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
              defaultValue={isEdit ? (article?.sortOrder ?? '') : ''}
              placeholder={isEdit ? undefined : 'Leave blank to add last'}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="label_zh_hant" className={labelClass}>
              Label (Traditional Chinese)
            </label>
            <input
              id="label_zh_hant"
              name="label_zh_hant"
              defaultValue={article?.labelZhHant ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="label_zh_hans" className={labelClass}>
              Label (Simplified Chinese)
            </label>
            <input
              id="label_zh_hans"
              name="label_zh_hans"
              defaultValue={article?.labelZhHans ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="author" className={labelClass}>
              Author
            </label>
            <input
              id="author"
              name="author"
              defaultValue={article?.author ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="date" className={labelClass}>
              Date
            </label>
            <input
              id="date"
              name="date"
              placeholder="Sep 2011"
              defaultValue={article?.date ?? ''}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="rounded-lg border border-cream-200 bg-cream-50/60 p-4">
          <p className={labelClass}>PDF file</p>
          <p className="mt-1 text-xs text-stone-500">
            Optional. Choose a PDF from your computer when you have it — the site
            stores it automatically.
          </p>

          {article?.pdfUrl ? (
            <p className="mt-3 text-sm text-stone-700">
              Current file:{' '}
              <a
                href={article.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand-800 hover:underline"
              >
                {pdfFileName(article.pdfUrl)}
              </a>
            </p>
          ) : (
            <p className="mt-3 text-sm text-stone-500">No PDF yet.</p>
          )}

          {/* Keeps the existing PDF when the editor only updates text fields. */}
          {isEdit && article?.pdfUrl ? (
            <input type="hidden" name="existing_pdf_url" value={article.pdfUrl} />
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
            <label htmlFor="pdf_filename" className="text-sm font-medium text-stone-700">
              Storage file name (optional)
            </label>
            <input
              id="pdf_filename"
              name="pdf_filename"
              placeholder="article3.pdf"
              defaultValue={
                article?.pdfUrl ? pdfFileName(article.pdfUrl) : ''
              }
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-stone-500">
              Keep this the same as the current file to overwrite it in place
              (recommended). If you change it, the new name is used and the old
              file is removed from storage.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-cream-200 pt-6">
          <Button type="submit">
            {isEdit ? 'Save changes' : 'Add article'}
          </Button>
          <Button href="/admin/articles" variant="outline">
            Cancel
          </Button>
        </div>
      </form>

      {isEdit && article ? (
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
          <p className="text-sm font-medium text-red-900">Delete article</p>
          <p className="mt-1 text-xs text-red-800/80">
            Removes the listing. The PDF file stays in storage.
          </p>
          <form action={deleteArticle} className="mt-3">
            <input type="hidden" name="id" value={article.id} />
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
