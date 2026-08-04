'use client';

import { reorderCommitteeMembers } from '@/app/admin/actions/committees';
import AdminSortableTable from '@/components/admin/AdminSortableTable';
import type { CommitteeMember } from '@/types/committee';

type CommitteeMembersSortableTableProps = {
  members: CommitteeMember[];
  committeeSlug: string;
};

export default function CommitteeMembersSortableTable({
  members,
  committeeSlug,
}: CommitteeMembersSortableTableProps) {
  return (
    <AdminSortableTable
      items={members}
      headers={['Name', 'Role', 'Order', 'Status']}
      editHref={(member) => `/admin/committees/${member.id}`}
      onReorder={(orderedIds) =>
        reorderCommitteeMembers(committeeSlug, orderedIds)
      }
      renderCells={(member, index) => (
        <>
          <td className="px-4 py-3 font-medium text-brand-900">
            {member.name}
          </td>
          <td className="px-4 py-3 text-stone-600">{member.role ?? '—'}</td>
          <td className="px-4 py-3 text-stone-600">{index + 1}</td>
          <td className="px-4 py-3">
            <span
              className={
                member.active
                  ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800'
                  : 'rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600'
              }
            >
              {member.active ? 'Active' : 'Hidden'}
            </span>
          </td>
        </>
      )}
    />
  );
}
