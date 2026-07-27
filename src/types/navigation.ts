export type NavChild = {
  /** Locale-relative path, hash, or absolute URL (e.g. PDF). */
  href: string;
  label: string;
  /** Open in a new tab (PDFs / external). */
  external?: boolean;
};

export type NavItem = {
  /** Locale-relative path, e.g. "/projects" (locale prefix added at render). */
  href: string;
  label: string;
  children?: NavChild[];
};
