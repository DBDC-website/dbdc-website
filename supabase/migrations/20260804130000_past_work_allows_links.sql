-- Year-level flag: linked bullets (separate rows) vs bulk text (no links).
alter table public.committee_past_work_years
  add column if not exists allows_links boolean not null default false;

-- R&DC 2010 example has a linked bullet.
update public.committee_past_work_years
set allows_links = true
where committee_slug = 'rdc'
  and year = 2010;
