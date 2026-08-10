import type { Locale } from '@/constants/i18n';
import { isValidLocale } from '@/constants/i18n';
import { getCommittees } from '@/content/committees';
import {
  getFaqItems,
  getParishSchoolPreamble,
} from '@/content/parishSchool';
import {
  getParishGuidelinesAssistBody,
  getParishGuidelinesTips,
  getParishGuidelinesTipsTitle,
} from '@/content/parishGuidelines';
import { COMMITTEE_PAST_WORK_ANCHOR } from '@/lib/committeeNav';
import { getArticles } from '@/lib/articles';
import { getLegalLinks, getMainNav } from '@/lib/i18n/navigation';
import { t, tList } from '@/lib/i18n';
import { pickLocalized } from '@/lib/i18n/pickLocalized';
import { getCabpagNewsletters } from '@/lib/newsletters';
import { getPublishedProjects } from '@/lib/projects';
import { supabase } from '@/lib/supabaseClient';
import type {
  CommitteeDetailSection,
  CommitteeFaqItem,
} from '@/types/committee';
import type { FaqAnswerBlock } from '@/types/parishSchool';
import type {
  PastWorkCommitteeSlug,
  PastWorkItemRow,
  PastWorkYearRow,
} from '@/types/pastWork';

export type SiteSearchCategory =
  | 'page'
  | 'committee'
  | 'pastWork'
  | 'project'
  | 'article'
  | 'newsletter'
  | 'parish';

export type SiteSearchEntry = {
  title: string;
  href: string;
  /** Extra searchable text (not always shown). */
  keywords: string[];
  category: SiteSearchCategory;
  /** Short preview shown in results. */
  snippet?: string;
};

const PAST_WORK_SLUGS: PastWorkCommitteeSlug[] = ['rdc', 'sc', 'wc', 'cabpag'];

function withLocale(locale: Locale, href: string): string {
  if (href.startsWith('http') || href.startsWith('/documents/')) return href;
  if (href.includes('#')) {
    const [path, hash] = href.split('#');
    return `/${locale}${path}#${hash}`;
  }
  return `/${locale}${href}`;
}

function truncate(text: string, max = 140): string {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

function flattenFaqAnswers(answer: string | string[]): string {
  return Array.isArray(answer) ? answer.join(' ') : answer;
}

function flattenParishAnswer(blocks: FaqAnswerBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.kind) {
        case 'paragraph':
          return block.text;
        case 'list':
          return block.items.join(' ');
        case 'link':
          return `${block.label} ${block.href}`;
        case 'table':
          return [...block.headers, ...block.rows.flat()].join(' ');
        case 'contacts':
          return block.items.map((item) => `${item.label} ${item.value}`).join(' ');
        default:
          return '';
      }
    })
    .join(' ');
}

function collectCommitteeSectionText(section: CommitteeDetailSection): string[] {
  const parts = [section.title];
  const { content } = section;
  if (content.kind === 'list') {
    parts.push(...content.items);
  } else if (content.kind === 'faq') {
    for (const item of content.items) {
      parts.push(item.question, flattenFaqAnswers(item.answer));
    }
  } else if (content.kind === 'faq-groups') {
    for (const group of content.groups) {
      parts.push(group.title);
      for (const item of group.items) {
        parts.push(item.question, flattenFaqAnswers(item.answer));
      }
    }
  } else if (content.kind === 'links') {
    if (content.description) parts.push(content.description);
    for (const item of content.items) {
      parts.push(item.name, item.dateLabel);
    }
  }
  return parts.filter(Boolean);
}

function pushFaqItems(
  entries: SiteSearchEntry[],
  items: CommitteeFaqItem[],
  groupLabel: string,
  href: string,
) {
  for (const item of items) {
    const answer = flattenFaqAnswers(item.answer);
    entries.push({
      title: `${groupLabel} · ${item.question}`,
      href,
      category: 'committee',
      snippet: truncate(answer),
      keywords: [item.question, answer, groupLabel],
    });
  }
}

/** Static pages + authored committee/parish copy (no CMS fetch). */
export function getStaticSiteSearchIndex(locale: Locale): SiteSearchEntry[] {
  const entries: SiteSearchEntry[] = [
    {
      title: t(locale, 'site.name'),
      href: withLocale(locale, '/'),
      category: 'page',
      keywords: [
        'home',
        'dbdc',
        'about',
        t(locale, 'home.aboutTitle'),
        t(locale, 'home.aboutIntro'),
        t(locale, 'home.objectives'),
        t(locale, 'home.membershipTitle'),
        t(locale, 'home.committeesTitle'),
        ...tList(locale, 'home.objectivesList'),
        '首頁',
        '首页',
        '關於',
        '关于',
      ],
    },
  ];

  for (const item of getMainNav(locale)) {
    entries.push({
      title: item.label,
      href: withLocale(locale, item.href),
      category: 'page',
      keywords: [item.label],
    });
    for (const child of item.children ?? []) {
      entries.push({
        title: `${item.label} · ${child.label}`,
        href: withLocale(locale, child.href),
        category: 'page',
        keywords: [item.label, child.label],
      });
    }
  }

  entries.push({
    title: t(locale, 'parish.guidelines.title'),
    href: withLocale(locale, '/parish-school/guidelines'),
    category: 'parish',
    snippet: t(locale, 'parish.guidelines.description'),
    keywords: [
      'guidelines',
      'working guidelines',
      '工作指引',
      'contractor',
      '承建商',
      t(locale, 'parish.guidelines.description'),
    ],
  });

  for (const tip of getParishGuidelinesTips(locale)) {
    entries.push({
      title: `${getParishGuidelinesTipsTitle(locale)} · ${truncate(tip.text, 60)}`,
      href: withLocale(locale, '/parish-school/guidelines'),
      category: 'parish',
      snippet: tip.text,
      keywords: [tip.text, getParishGuidelinesTipsTitle(locale)],
    });
  }

  entries.push({
    title: getParishGuidelinesTipsTitle(locale),
    href: withLocale(locale, '/parish-school/guidelines'),
    category: 'parish',
    snippet: truncate(getParishGuidelinesAssistBody(locale)),
    keywords: [getParishGuidelinesAssistBody(locale)],
  });

  const preamble = getParishSchoolPreamble(locale);
  entries.push({
    title: t(locale, 'parish.title'),
    href: withLocale(locale, '/parish-school'),
    category: 'parish',
    snippet: truncate(preamble.intro),
    keywords: [
      preamble.intro,
      preamble.leadIn,
      ...preamble.considerations.flatMap((c) => [
        c.label,
        c.text,
        ...(c.subItems ?? []),
      ]),
    ],
  });

  for (const faq of getFaqItems(locale)) {
    const answerParts = flattenParishAnswer(faq.answer);
    entries.push({
      title: faq.question,
      href: withLocale(locale, '/parish-school#faq-heading'),
      category: 'parish',
      snippet: truncate(answerParts),
      keywords: [faq.question, answerParts],
    });
  }

  for (const committee of getCommittees(locale)) {
    const committeeHref = withLocale(
      locale,
      `/committees/${committee.slug}`,
    );
    entries.push({
      title: committee.name,
      href: committeeHref,
      category: 'committee',
      snippet: truncate(committee.summary),
      keywords: [
        committee.name,
        committee.abbreviation,
        committee.summary,
        committee.slug,
      ],
    });

    committee.sections.forEach((section, index) => {
      const texts = collectCommitteeSectionText(section);
      const sectionHref = withLocale(
        locale,
        `/committees/${committee.slug}#${committee.slug}-section-${index}`,
      );
      entries.push({
        title: `${committee.name} · ${section.title}`,
        href: sectionHref,
        category: 'committee',
        snippet: truncate(texts.slice(1).join(' ')),
        keywords: texts,
      });

      if (section.content.kind === 'faq') {
        pushFaqItems(entries, section.content.items, committee.name, sectionHref);
      } else if (section.content.kind === 'faq-groups') {
        for (const group of section.content.groups) {
          pushFaqItems(
            entries,
            group.items,
            `${committee.name} · ${group.title}`,
            sectionHref,
          );
        }
      }
    });
  }

  for (const link of getLegalLinks(locale)) {
    entries.push({
      title: link.label,
      href: withLocale(locale, link.href),
      category: 'page',
      keywords: [link.label, 'legal', 'privacy', 'pics'],
    });
  }

  return entries;
}

async function getPastWorkSearchEntries(
  locale: Locale,
): Promise<SiteSearchEntry[]> {
  const committees = getCommittees(locale);
  const nameBySlug = new Map(
    committees.map((committee) => [committee.slug, committee.name]),
  );

  const { data: years, error: yearsError } = await supabase
    .from('committee_past_work_years')
    .select('id, committee_slug, year, sort_order')
    .in('committee_slug', PAST_WORK_SLUGS);

  if (yearsError) {
    console.error('Search: failed to load past work years:', yearsError);
    return [];
  }

  const yearRows = (years as PastWorkYearRow[] | null) ?? [];
  if (yearRows.length === 0) return [];

  const { data: items, error: itemsError } = await supabase
    .from('committee_past_work_items')
    .select(
      'id, year_id, text, text_en, text_zh_hant, text_zh_hans, link_url, file_url, sort_order',
    )
    .in(
      'year_id',
      yearRows.map((year) => year.id),
    );

  if (itemsError) {
    console.error('Search: failed to load past work items:', itemsError);
    return [];
  }

  const yearById = new Map(yearRows.map((year) => [year.id, year]));
  const entries: SiteSearchEntry[] = [];
  const pastWorkLabel = t(locale, 'committees.pastWork');

  for (const year of yearRows) {
    const committeeName =
      nameBySlug.get(year.committee_slug) ?? year.committee_slug;
    entries.push({
      title: `${committeeName} · ${pastWorkLabel} · ${year.year}`,
      href: withLocale(
        locale,
        `/committees/${year.committee_slug}#past-work-${year.year}`,
      ),
      category: 'pastWork',
      keywords: [
        pastWorkLabel,
        String(year.year),
        committeeName,
        year.committee_slug,
        COMMITTEE_PAST_WORK_ANCHOR,
      ],
    });
  }

  for (const row of (items as PastWorkItemRow[] | null) ?? []) {
    const year = yearById.get(row.year_id);
    if (!year) continue;
    const record = row as unknown as Record<string, unknown>;
    const text = pickLocalized(record, 'text', locale);
    if (!text.trim()) continue;
    const committeeName =
      nameBySlug.get(year.committee_slug) ?? year.committee_slug;
    entries.push({
      title: `${committeeName} · ${year.year}`,
      href: withLocale(
        locale,
        `/committees/${year.committee_slug}#past-work-${year.year}`,
      ),
      category: 'pastWork',
      snippet: truncate(text, 180),
      keywords: [text, String(year.year), committeeName, pastWorkLabel],
    });
  }

  return entries;
}

/** Full site index: static copy + CMS (past work, projects, articles, newsletters). */
export async function buildFullSiteSearchIndex(
  locale: Locale,
): Promise<SiteSearchEntry[]> {
  const [pastWork, projects, articles, newsletters] = await Promise.all([
    getPastWorkSearchEntries(locale),
    getPublishedProjects(locale),
    getArticles(locale),
    getCabpagNewsletters(locale),
  ]);

  const entries = [...getStaticSiteSearchIndex(locale), ...pastWork];

  for (const project of projects) {
    entries.push({
      title: project.title,
      href: withLocale(locale, '/projects#project-showcase-heading'),
      category: 'project',
      snippet: truncate(
        [project.buildingName, project.location, project.year]
          .filter(Boolean)
          .join(' · '),
      ),
      keywords: [
        project.title,
        project.buildingName ?? '',
        project.location,
        project.year,
        project.slug,
      ],
    });
  }

  for (const article of articles) {
    entries.push({
      title: article.title,
      href: withLocale(locale, '/articles'),
      category: 'article',
      snippet: truncate(
        [article.label, article.author, article.date].filter(Boolean).join(' · '),
      ),
      keywords: [
        article.title,
        article.label,
        article.author ?? '',
        article.date,
      ],
    });
  }

  for (const newsletter of newsletters) {
    entries.push({
      title: newsletter.title,
      href: newsletter.href || withLocale(locale, '/committees/cabpag'),
      category: 'newsletter',
      snippet: newsletter.dateLabel,
      keywords: [
        newsletter.title,
        newsletter.dateLabel,
        'newsletter',
        '通訊',
        '通讯',
      ],
    });
  }

  return entries;
}

export function filterSiteSearch(
  entries: SiteSearchEntry[],
  query: string,
  limit = 25,
): SiteSearchEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter(Boolean);

  const scored = entries
    .map((entry) => {
      const haystack = [entry.title, entry.snippet ?? '', ...entry.keywords]
        .join(' ')
        .toLowerCase();
      if (!tokens.every((token) => haystack.includes(token))) {
        return null;
      }
      let score = 0;
      const titleLower = entry.title.toLowerCase();
      if (titleLower.includes(normalized)) score += 40;
      if (entry.snippet?.toLowerCase().includes(normalized)) score += 20;
      for (const token of tokens) {
        if (titleLower.includes(token)) score += 10;
        if (entry.category === 'pastWork' && haystack.includes(token)) score += 5;
      }
      return { entry, score };
    })
    .filter((row): row is { entry: SiteSearchEntry; score: number } => row != null)
    .sort(
      (a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title),
    );

  return scored.slice(0, limit).map((row) => row.entry);
}

export function resolveSearchLocale(raw: string | null | undefined): Locale {
  if (raw && isValidLocale(raw)) return raw;
  return 'en';
}

/** @deprecated Prefer buildFullSiteSearchIndex for full-text search. */
export function getSiteSearchIndex(locale: Locale): SiteSearchEntry[] {
  return getStaticSiteSearchIndex(locale);
}
