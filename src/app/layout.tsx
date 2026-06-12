import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DBDC – Diocesan Building and Development Commission',
  description:
    'Official website of the Diocesan Building and Development Commission, Catholic Diocese of Hong Kong.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
