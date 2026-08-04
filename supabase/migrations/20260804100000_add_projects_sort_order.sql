-- Restore manual ordering for the projects admin list / public showcase.
alter table public.projects
  add column if not exists sort_order integer not null default 0;

-- Seed from current year-desc listing so existing order is preserved.
with ordered as (
  select
    id,
    row_number() over (
      order by year desc nulls last, id asc
    ) as rn
  from public.projects
)
update public.projects as p
set sort_order = ordered.rn
from ordered
where p.id = ordered.id;

create index if not exists idx_projects_sort_order
  on public.projects (sort_order);
