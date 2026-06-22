import type { Locale } from '@/constants/i18n';
import { mainNav } from '@/constants/site';
import HeaderBar from './HeaderBar';

type HeaderProps = {
  locale: Locale;
};

export default function Header({ locale }: HeaderProps) {
  return <HeaderBar locale={locale} items={mainNav} />;
}
