import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { isAdminEmail } from '@/constants/admin';
import { createClient } from '@/lib/supabase/server';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  if (!isAdminEmail(user.email)) {
    await supabase.auth.signOut();
    redirect('/admin/login?error=unauthorized');
  }

  return (
    <>
      <AdminNav email={user.email ?? ''} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </>
  );
}
