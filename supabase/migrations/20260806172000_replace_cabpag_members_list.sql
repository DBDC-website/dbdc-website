-- Replace CaBPAG members with the latest steering group list.
-- Keeps exact order as provided by CaBPAG office. 

delete from public.committee_members
where committee_slug = 'cabpag';

insert into public.committee_members (
  committee_slug,
  name,
  role,
  sort_order,
  active
)
values
  ('cabpag', 'Mr. Alain LAW', 'CaBPAG Convenor', 1, true),
  ('cabpag', 'Mr. Edward LEUNG', 'Deputy Convenor', 2, true),
  ('cabpag', 'Ms. Carmen LEE', 'Hon. Secretary', 3, true),
  ('cabpag', 'Mr. Alen LAI', 'Leader of Facilities Management Team', 4, true),
  ('cabpag', 'Mr. Laurence KWAN', 'Leader of Building Services Engineering Team', 5, true),
  ('cabpag', 'Ms. Lana HO', 'Leader of Spiritual Team', 6, true),
  ('cabpag', 'Mr. William TANG', 'Leader of Cemetery Team', 7, true),
  ('cabpag', 'Deacon Sair-ling LAM', null, 8, true),
  ('cabpag', 'Mr. Joseph CHAN', null, 9, true),
  ('cabpag', 'Ms. Belinda HO', null, 10, true),
  ('cabpag', 'Mr. Michael HO', null, 11, true),
  ('cabpag', 'Mr. Raymond TANG', null, 12, true),
  ('cabpag', 'Ms. Rose WONG', null, 13, true),
  ('cabpag', 'Mr. Stephen AU YEUNG', null, 14, true);
