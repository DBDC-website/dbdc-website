-- Local development seed, applied by `supabase db reset` after migrations.
--
-- Intentionally minimal: production content is managed through the admin panel
-- at /admin, and the committee rosters are established by the migrations. Add
-- throwaway fixtures here when you need sample data locally — never real
-- personal data, since this file is committed.

-- Two draft projects so the admin list and the reorder UI have something to
-- work with. `published = false` keeps them off the public site.
insert into public.projects (slug, title, title_en, building_name, address, year, published, sort_order)
values
    ('sample-chapel-renovation', 'Sample Chapel Renovation', 'Sample Chapel Renovation', 'Sample Chapel', '1 Sample Road, Hong Kong', 2024, false, 1),
    ('sample-school-extension', 'Sample School Extension', 'Sample School Extension', 'Sample School', '2 Sample Road, Hong Kong', 2023, false, 2)
on conflict (slug) do nothing;
