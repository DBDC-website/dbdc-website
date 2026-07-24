import { redirect } from 'next/navigation';
import { isAdminEmail } from '@/constants/admin';
import { createClient } from '@/lib/supabase/server';

/** Cookie-session Supabase client after verifying allowlisted admin user. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect('/admin/login?error=unauthorized');
  }

  return supabase;
}
