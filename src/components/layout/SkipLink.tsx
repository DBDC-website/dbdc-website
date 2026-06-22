/**
 * Keyboard/screen-reader users can jump straight to main content (WCAG 2.4.1).
 * Hidden until focused, then visible at the top-left.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
    >
      Skip to main content
    </a>
  );
}
