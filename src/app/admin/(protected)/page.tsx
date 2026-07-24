import type { Metadata } from 'next';
import AdminHome from '@/components/admin/AdminHome';
import { isAdminEmail } from '@/constants/admin';
import { getAdminDashboardStats } from '@/lib/admin/dashboard';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Home',
};

export default async function AdminIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stats = await getAdminDashboardStats();
  const email =
    user && isAdminEmail(user.email) ? (user.email ?? '') : '';

  return <AdminHome email={email} stats={stats} />;
}
