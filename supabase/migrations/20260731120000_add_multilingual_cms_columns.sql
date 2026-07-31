-- Multilingual columns for projects, project_images, articles, committee_members.
-- Backfill *_en from legacy columns. Keep legacy columns for fallback.

-- Projects
alter table public.projects
  add column if not exists title_en text,
  add column if not exists title_zh_hant text,
  add column if not exists title_zh_hans text,
  add column if not exists building_name_en text,
  add column if not exists building_name_zh_hant text,
  add column if not exists building_name_zh_hans text,
  add column if not exists image_alt_en text,
  add column if not exists image_alt_zh_hant text,
  add column if not exists image_alt_zh_hans text;

update public.projects
set
  title_en = coalesce(title_en, title),
  building_name_en = coalesce(building_name_en, building_name),
  image_alt_en = coalesce(image_alt_en, image_alt)
where title_en is null
   or (building_name is not null and building_name_en is null)
   or (image_alt is not null and image_alt_en is null);

-- Project image captions
alter table public.project_images
  add column if not exists caption_en text,
  add column if not exists caption_zh_hant text,
  add column if not exists caption_zh_hans text;

update public.project_images
set caption_en = coalesce(caption_en, caption)
where caption is not null and caption_en is null;

-- Articles
alter table public.articles
  add column if not exists title_en text,
  add column if not exists title_zh_hant text,
  add column if not exists title_zh_hans text,
  add column if not exists label_en text,
  add column if not exists label_zh_hant text,
  add column if not exists label_zh_hans text;

update public.articles
set
  title_en = coalesce(title_en, title),
  label_en = coalesce(label_en, label)
where title_en is null
   or (label is not null and label_en is null);

-- Committee members: authored Chinese names (optional) + role labels
alter table public.committee_members
  add column if not exists name_zh_hant text,
  add column if not exists name_zh_hans text,
  add column if not exists role_en text,
  add column if not exists role_zh_hant text,
  add column if not exists role_zh_hans text;

update public.committee_members
set role_en = coalesce(role_en, role)
where role is not null and role_en is null;
