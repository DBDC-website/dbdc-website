'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { CommitteeNavItem } from '@/lib/committeeNav';
import type { CommitteeSlug } from '@/types/committee';
import type { Locale } from '@/constants/i18n';

type CommitteeSideNavProps = {
  locale: Locale;
  currentSlug: CommitteeSlug;
  items: CommitteeNavItem[];
  title: string;
  openLabel: string;
  closeLabel: string;
};

function openSectionForHash(hash: string) {
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;

  const details = target.closest('details');
  if (details && !details.open) {
    details.open = true;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function CommitteeSideNav({
  locale,
  currentSlug,
  items,
  title,
  openLabel,
  closeLabel,
}: CommitteeSideNavProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((item) => [item.slug, item.slug === currentSlug])),
  );

  useEffect(() => {
    setExpanded((current) => ({
      ...current,
      [currentSlug]: true,
    }));
  }, [currentSlug]);

  useEffect(() => {
    if (!window.location.hash) return;
    const timer = window.setTimeout(() => {
      openSectionForHash(window.location.hash);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [currentSlug]);

  const toggleCommittee = (slug: CommitteeSlug) => {
    setExpanded((current) => ({
      ...current,
      [slug]: !current[slug],
    }));
  };

  return (
    <>
      {!panelOpen ? (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="fixed left-3 top-28 z-30 inline-flex items-center gap-2.5 rounded-2xl border border-gold-300/85 bg-gradient-to-br from-[#fff7e8]/95 via-[#ffffff]/92 to-[#eef6ff]/92 px-4 py-3 text-sm font-semibold text-brand-900 shadow-lg shadow-brand-900/15 ring-1 ring-white/70 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-900/20 lg:left-4 lg:top-32 lg:px-4.5 lg:py-3.5 lg:text-base"
          aria-expanded={false}
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-900 text-white shadow-sm shadow-brand-900/25 lg:h-8 lg:w-8">
            <PanelLeftOpen className="h-4 w-4 lg:h-4.5 lg:w-4.5" aria-hidden />
          </span>
          <span className="max-w-[11rem] truncate tracking-[0.01em] sm:max-w-none">
            {openLabel}
          </span>
        </button>
      ) : null}

      <aside
        className={cn(
          'fixed left-0 top-20 z-40 flex h-[calc(100%-5rem)] w-[min(18rem,88vw)] flex-col border-r border-t border-sky-200/70 border-t-gold-300/80 bg-white/95 shadow-xl shadow-brand-900/10 backdrop-blur-md transition-transform duration-300 ease-out lg:top-24 lg:h-[calc(100%-6rem)] lg:w-72',
          panelOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-hidden={!panelOpen}
      >
        <div className="flex items-center justify-between border-b border-sky-100 px-4 py-3">
          <p className="text-sm font-semibold text-brand-950">{title}</p>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            className="rounded-md p-1 text-stone-500 hover:bg-cream-100 hover:text-brand-900"
            aria-label={closeLabel}
          >
            <PanelLeftClose className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto px-3 py-4"
          aria-label={title}
        >
          <ul className="space-y-2">
            {items.map((item) => {
              const isCurrent = item.slug === currentSlug;
              const isExpanded = expanded[item.slug] ?? isCurrent;

              return (
                <li
                  key={item.slug}
                  className="overflow-hidden rounded-xl border border-sky-100/90 bg-cream-50/50"
                >
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/${locale}/committees/${item.slug}`}
                      onClick={() => setPanelOpen(false)}
                      className={cn(
                        'min-w-0 flex-1 px-3 py-2.5 text-sm font-semibold transition-colors',
                        isCurrent
                          ? 'text-brand-900'
                          : 'text-brand-800 hover:text-brand-950',
                      )}
                    >
                      <span className="block truncate">{item.abbreviation}</span>
                      <span className="mt-0.5 block truncate text-xs font-medium text-stone-500">
                        {item.name}
                      </span>
                    </Link>
                    {item.sections.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => toggleCommittee(item.slug)}
                        className="mr-1 rounded-md p-1.5 text-brand-800 hover:bg-white/80"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.abbreviation} sections`}
                      >
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            isExpanded && 'rotate-180',
                          )}
                          aria-hidden
                        />
                      </button>
                    ) : null}
                  </div>

                  {isExpanded && item.sections.length > 0 ? (
                    <ul className="border-t border-sky-100/80 px-2 py-2">
                      {item.sections.map((section) => (
                        <li key={section.anchorId}>
                          <Link
                            href={`/${locale}/committees/${item.slug}#${section.anchorId}`}
                            onClick={() => {
                              if (item.slug === currentSlug) {
                                openSectionForHash(`#${section.anchorId}`);
                              }
                              setPanelOpen(false);
                            }}
                            className={cn(
                              'block rounded-md px-2 py-1.5 text-xs leading-snug transition-colors sm:text-sm',
                              isCurrent
                                ? 'text-stone-700 hover:bg-white hover:text-brand-900'
                                : 'text-stone-600 hover:bg-white hover:text-brand-900',
                            )}
                          >
                            {section.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {panelOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-brand-950/20 backdrop-blur-[1px] lg:bg-brand-950/10"
          aria-label={closeLabel}
          onClick={() => setPanelOpen(false)}
        />
      ) : null}
    </>
  );
}
