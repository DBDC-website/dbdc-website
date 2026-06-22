/** A downloadable article PDF listed on the Related Articles page. */
export interface ArticlePdf {
  /** Roman numeral label, e.g. "I", "II". */
  label: string;
  title: string;
  author: string;
  /** Display date, e.g. "Sep 2011". */
  date: string;
  /**
   * Path under /public, e.g. "/documents/articles/my-article.pdf".
   * Files in public/ are served at the site root.
   */
  href: string;
}
