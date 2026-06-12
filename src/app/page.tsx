import { redirect } from 'next/navigation';
import { defaultLocale } from '@/constants/i18n';

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
