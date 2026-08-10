import { NextResponse } from 'next/server';
import {
  buildFullSiteSearchIndex,
  filterSiteSearch,
  resolveSearchLocale,
} from '@/lib/siteSearch';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') ?? '').trim();
  const locale = resolveSearchLocale(searchParams.get('locale'));

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const index = await buildFullSiteSearchIndex(locale);
    const results = filterSiteSearch(index, query, 25).map((entry) => ({
      title: entry.title,
      href: entry.href,
      category: entry.category,
      snippet: entry.snippet ?? null,
    }));
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Site search failed:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
