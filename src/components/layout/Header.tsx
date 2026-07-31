import type { Locale } from '@/constants/i18n';
import HeaderBar from './HeaderBar';
import type { NavItem } from '@/types/navigation';

type HeaderProps = {
  locale: Locale;
  items: NavItem[];
};

export default function Header({ locale, items }: HeaderProps) {
  return <HeaderBar locale={locale} items={items} />;
}
