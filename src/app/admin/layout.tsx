import type { Metadata } from 'next';
import MosaicHueBackdrop from '@/components/layout/MosaicHueBackdrop';

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
    <div className="relative min-h-screen text-stone-800 antialiased">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <MosaicHueBackdrop className="opacity-80" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
