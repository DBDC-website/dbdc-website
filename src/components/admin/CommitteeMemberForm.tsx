import Button from '@/components/ui/Button';
import {
  createCommitteeMember,
  deleteCommitteeMember,
  updateCommitteeMember,
} from '@/app/admin/actions/committees';
import {
  COMMITTEE_MEMBER_OPTIONS,
  COMMITTEE_ROLE_OPTIONS,
  matchCommitteeRoleOption,
} from '@/constants/admin';
import type { CommitteeMember } from '@/types/committee';

const fieldClass =
  'mt-1 w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm text-brand-950 shadow-sm placeholder:text-stone-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500';

const labelClass = 'block text-sm font-medium text-brand-900';

type CommitteeMemberFormProps = {
  member?: CommitteeMember;
};

export default function CommitteeMemberForm({
  member,
}: CommitteeMemberFormProps) {
  const isEdit = Boolean(member);
  const action = isEdit ? updateCommitteeMember : createCommitteeMember;
  const defaultRole = matchCommitteeRoleOption(member?.role) || 'Member';

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-6">
        {isEdit && member ? (
          <input type="hidden" name="id" value={member.id} />
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className={labelClass}>
              Name (English / romanised)
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={member?.name ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="name_zh_hant" className={labelClass}>
              Name (Traditional Chinese)
            </label>
            <input
              id="name_zh_hant"
              name="name_zh_hant"
              defaultValue={member?.nameZhHant ?? ''}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="name_zh_hans" className={labelClass}>
              Name (Simplified Chinese)
            </label>
            <input
              id="name_zh_hans"
              name="name_zh_hans"
              defaultValue={member?.nameZhHans ?? ''}
              className={fieldClass}
            />
          </div>

          <p className="text-xs text-stone-500 sm:col-span-2">
            Only fill the Chinese names you have been given. Leave blank and the
            romanised name is shown instead — never convert a person&apos;s name
            automatically.
          </p>

          <div>
            <label htmlFor="role" className={labelClass}>
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              defaultValue={defaultRole}
              className={fieldClass}
            >
              {COMMITTEE_ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-stone-500">
              Role labels are translated automatically on the public site.
            </p>
          </div>

          <div>
            <label htmlFor="committee_slug" className={labelClass}>
              Committee
            </label>
            <select
              id="committee_slug"
              name="committee_slug"
              required
              defaultValue={member?.committeeSlug ?? 'dbdc'}
              className={fieldClass}
            >
              {COMMITTEE_MEMBER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="sort_order" className={labelClass}>
              Position (optional)
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min={1}
              defaultValue={isEdit ? (member?.sortOrder ?? '') : ''}
              placeholder={
                isEdit ? undefined : 'Leave blank to place by role'
              }
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-stone-500">
              {isEdit
                ? 'Changing this moves the member and renumbers the rest automatically.'
                : 'Leave blank to insert after others with the same role (and shift everyone below). Or type a position like 4 to insert there.'}
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-brand-900">
          <input
            type="checkbox"
            name="active"
            defaultChecked={member?.active ?? true}
            className="h-4 w-4 rounded border-cream-300 text-brand-700"
          />
          Active (shown on the public site)
        </label>

        <div className="flex flex-wrap items-center gap-3 border-t border-cream-200 pt-6">
          <Button type="submit">
            {isEdit ? 'Save changes' : 'Add member'}
          </Button>
          <Button href="/admin/committees" variant="outline">
            Cancel
          </Button>
        </div>
      </form>

      {isEdit && member ? (
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
          <p className="text-sm font-medium text-red-900">Delete member</p>
          <p className="mt-1 text-xs text-red-800/80">
            Removes this person and closes the gap in the order list.
          </p>
          <form action={deleteCommitteeMember} className="mt-3">
            <input type="hidden" name="id" value={member.id} />
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
