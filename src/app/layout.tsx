import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import SmoothScroll from '@/components/motion/SmoothScroll';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dbdc.catholic.org.hk'),
  title: {
    default: 'DBDC – Diocesan Building and Development Commission',
    template: '%s | DBDC',
  },
  description:
    'Official website of the Diocesan Building and Development Commission, Catholic Diocese of Hong Kong.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
