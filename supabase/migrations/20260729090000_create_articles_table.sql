-- Research articles (PDF library) shown at /{locale}/articles.
--
-- The table was originally created outside the migration history, so this file
-- backfills it for fresh environments. Every statement is idempotent and is a
-- no-op against a database where the table already exists.
--
-- The `_en` / `_zh_hant` / `_zh_hans` variants of `label` and `title` are added
-- later by 20260731120000_add_multilingual_cms_columns.sql.
create table if not exists public.articles (
    id bigint generated always as identity primary key,
    label text not null default '',
    title text not null,
    author text not null default '',
    date text not null default '',
    pdf_url text not null default '',
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_articles_sort_order on public.articles (sort_order);

alter table public.articles enable row level security;

drop policy if exists "Public read articles" on public.articles;
create policy "Public read articles" on public.articles
    for select using (true);
