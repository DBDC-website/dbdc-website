'use client';

import { FileText } from 'lucide-react';
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren';
import type { ArticlePdf } from '@/types/article';

type ArticlePdfListProps = {
  articles: ArticlePdf[];
};

export default function ArticlePdfList({ articles }: ArticlePdfListProps) {
  return (
    <StaggerChildren as="ol" className="max-w-4xl space-y-6">
      {articles.map((article) => (
        <StaggerItem key={article.id} as="li">
          <a
            href={article.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 rounded-2xl border border-cream-200/90 bg-white/80 p-5 shadow-sm shadow-brand-900/[0.03] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-gold-200/80 hover:shadow-md hover:shadow-brand-900/[0.06] sm:gap-5 sm:p-6"
          >
            <span
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-sm font-semibold text-gold-800"
              aria-hidden="true"
            >
              {article.label}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-serif text-lg font-semibold uppercase leading-snug tracking-wide text-brand-900 transition-colors group-hover:text-brand-950 sm:text-xl">
                {article.title}
              </span>
              <span className="mt-2 block text-sm text-stone-600 sm:text-base">
                {article.author
                  ? `by ${article.author}, ${article.date}`
                  : article.date}
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-800 transition-colors group-hover:text-brand-950">
                <FileText className="h-4 w-4 text-gold-600" aria-hidden="true" />
                English PDF
              </span>
            </span>
          </a>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
