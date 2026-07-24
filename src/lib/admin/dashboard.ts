import { createClient } from '@/lib/supabase/server';

export type AdminDashboardStats = {
  projectsTotal: number;
  projectsPublished: number;
  membersTotal: number;
  membersActive: number;
  registrationsTotal: number;
  registrationsPending: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createClient();

  const [
    projectsTotal,
    projectsPublished,
    membersTotal,
    membersActive,
    consultantTotal,
    contractorTotal,
    consultantPending,
    contractorPending,
  ] = await Promise.all([
    countRows(supabase, 'projects'),
    countRows(supabase, 'projects', { column: 'published', value: true }),
    countRows(supabase, 'committee_members'),
    countRows(supabase, 'committee_members', { column: 'active', value: true }),
    countRows(supabase, 'consultant_registrations'),
    countRows(supabase, 'contractor_registrations'),
    countRows(supabase, 'consultant_registrations', {
      column: 'status',
      value: 'pending',
    }),
    countRows(supabase, 'contractor_registrations', {
      column: 'status',
      value: 'pending',
    }),
  ]);

  return {
    projectsTotal,
    projectsPublished,
    membersTotal,
    membersActive,
    registrationsTotal: consultantTotal + contractorTotal,
    registrationsPending: consultantPending + contractorPending,
  };
}

async function countRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  filter?: { column: string; value: string | boolean },
): Promise<number> {
  let query = supabase
    .from(table)
    .select('*', { count: 'exact', head: true });

  if (filter) {
    query = query.eq(filter.column, filter.value);
  }

  const { count, error } = await query;

  if (error) {
    console.error(`Failed to count ${table}:`, error);
    return 0;
  }

  return count ?? 0;
}
