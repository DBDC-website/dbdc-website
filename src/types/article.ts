export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO 8601 date string (machine-readable for <time>). */
  date: string;
  readingTimeMinutes: number;
}
