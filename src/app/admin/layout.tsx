import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Admin | DBDC',
    template: '%s | DBDC Admin',
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream-50 text-stone-800 antialiased">
      {children}
    </div>
  );
}
