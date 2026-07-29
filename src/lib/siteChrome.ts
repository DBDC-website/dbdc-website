/** Toggle site chrome (header / floating controls) while a project lightbox is open. */
export const SITE_CHROME_HIDDEN_ATTR = 'data-site-chrome-hidden';

export function setSiteChromeHidden(hidden: boolean) {
  if (typeof document === 'undefined') return;
  if (hidden) {
    document.documentElement.setAttribute(SITE_CHROME_HIDDEN_ATTR, 'true');
  } else {
    document.documentElement.removeAttribute(SITE_CHROME_HIDDEN_ATTR);
  }
  window.dispatchEvent(
    new CustomEvent('site-chrome-hidden-change', { detail: { hidden } }),
  );
}

export function isSiteChromeHidden() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute(SITE_CHROME_HIDDEN_ATTR) === 'true';
}
