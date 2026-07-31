import type { Locale } from '@/constants/i18n';
import type { NavItem } from '@/types/navigation';
import { t } from '@/lib/i18n';
import MobileMenuPanel from './MobileMenuPanel';

export const MOBILE_MENU_TOGGLE_ID = 'mobile-menu-toggle';

type MobileMenuOverlayProps = {
  locale: Locale;
  items: NavItem[];
};

/**
 * CSS-driven mobile menu overlay (checkbox peer). Rendered at layout level so
 * `position: fixed` is not trapped inside the sticky header.
 */
export default function MobileMenuOverlay({
  locale,
  items,
}: MobileMenuOverlayProps) {
  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t(locale, 'nav.siteMenuAria')}
      className="fixed inset-0 z-[100] hidden peer-checked:block lg:hidden"
    >
      <label
        htmlFor={MOBILE_MENU_TOGGLE_ID}
        className="absolute inset-0 block cursor-pointer bg-brand-950/40"
        aria-label={t(locale, 'nav.closeMenu')}
      />
      <MobileMenuPanel
        locale={locale}
        items={items}
        toggleId={MOBILE_MENU_TOGGLE_ID}
      />
    </div>
  );
}
