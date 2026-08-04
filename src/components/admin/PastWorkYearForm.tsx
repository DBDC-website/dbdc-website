import Button from '@/components/ui/Button';
import {
  createPastWorkYear,
  deletePastWorkYear,
  updatePastWorkYear,
} from '@/app/admin/actions/pastWork';
import { PAST_WORK_COMMITTEE_OPTIONS } from '@/constants/admin';
import type { AdminPastWorkYearDetail } from '@/lib/admin/pastWork';

const fieldClass =
  'mt-1 w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm text-brand-950 shadow-sm placeholder:text-stone-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const labelClass = 'block text-sm font-medium text-brand-900';

type PastWorkYearFormProps = {
  year?: Pick<AdminPastWorkYearDetail, 'id' | 'committeeSlug' | 'year'>;
};

export default function PastWorkYearForm({ year }: PastWorkYearFormProps) {
  const isEdit = Boolean(year);
  const action = isEdit ? updatePastWorkYear : createPastWorkYear;

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-6">
        {isEdit && year ? (
          <input type="hidden" name="id" value={year.id} />
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="committee_slug" className={labelClass}>
              Committee
            </label>
            <select
              id="committee_slug"
              name="committee_slug"
              required
              defaultValue={year?.committeeSlug ?? 'rdc'}
              className={fieldClass}
            >
              {PAST_WORK_COMMITTEE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className={labelClass}>
              Year
            </label>
            <input
              id="year"
              name="year"
              type="number"
              required
              min={1900}
              max={2100}
              placeholder="2010"
              defaultValue={year?.year ?? ''}
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-stone-500">
              Appears on the public timeline for this committee.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-cream-200 pt-6">
          <Button type="submit">
            {isEdit ? 'Save year' : 'Create year'}
          </Button>
          <Button href="/admin/past-work" variant="outline">
            Cancel
          </Button>
        </div>
      </form>

      {isEdit && year ? (
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
          <p className="text-sm font-medium text-red-900">Delete year</p>
          <p className="mt-1 text-xs text-red-800/80">
            Removes this year and all of its bullet points.
          </p>
          <form action={deletePastWorkYear} className="mt-3">
            <input type="hidden" name="id" value={year.id} />
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
