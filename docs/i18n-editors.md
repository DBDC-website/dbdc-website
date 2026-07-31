# Trilingual content — editor notes

Locales: **en** · **zh-Hant** (Traditional) · **zh-Hans** (Simplified)  
Paths stay English (`/zh-Hant/about`, not translated slugs). Root `/` redirects to `/en`.

## Fallback order

| Requested | Then try |
|-----------|----------|
| `zh-Hant` | `zh-Hans` → `en` → legacy DB column |
| `zh-Hans` | `zh-Hant` → `en` → legacy DB column |
| `en` | legacy column only |

Missing copy must never break the page — English (or the other Chinese script) fills gaps.

## Where copy lives

| Kind | Location |
|------|----------|
| UI chrome (nav, buttons, page headers, form section titles) | `src/messages/{en,zh-Hant,zh-Hans}.json` |
| Long-form parish / legal / committees / guidelines | `src/content/*.ts` via `pickContent` |
| CMS (projects, articles, member names) | Supabase columns `*_en`, `*_zh_hant`, `*_zh_hans` + legacy |

## Authoring workflow

1. **Author Traditional Chinese (`zh-Hant`)** as the HK source for Chinese.
2. **Draft Simplified (`zh-Hans`)** with OpenCC (or similar), then light human review for vocab (網絡/网络, 軟件/软件, etc.).
3. **Never machine-translate personal names.** Store authored `name_zh_hant` / `name_zh_hans` only when the Chinese form is known; otherwise leave null and show the romanized `name`.
4. **Legal / parish / PICS:** human translate or human-reviewed only. English remains authoritative if versions conflict (stated in the legal pages).
5. **Do not auto-overwrite** an already-edited `*_zh_hans` field when regenerating a Simplified draft.

## Admin — every CMS field has its own trilingual inputs

No Supabase Table Editor work is needed. Admin UI labels stay English (ops-only).

### Projects (`/admin/projects`)

- Fill **Title (English)** (required); optional Traditional / Simplified title, building name, and image alt.
- Saving writes locale columns **and** legacy `title` / `building_name` / `image_alt` from the English values.
- Slug is generated from the English title.
- **Gallery captions** are edited in their own panel on the project edit page — one English + Traditional + Simplified row per image.

### Articles (`/admin/articles`)

- English title, label, and date are required; Chinese title and label are optional.
- The list shows a translation badge (`繁 简` / `繁` / `简` / `EN only`) so gaps are visible at a glance.
- Upload a PDF (max 25MB) or paste an existing PDF URL. The PDF itself is not translated — only its listing.
- Leave the order blank on create to append to the end of the list.

### Committee members (`/admin/committees`)

- **Name (English / romanised)** is required. Chinese names are optional and only for people whose Chinese name you have been given.
- **Roles are translated automatically** from the dropdown value, so there is nothing to fill per language. A `role_zh_hant` / `role_zh_hans` value set directly in the database still wins if one exists.

## After schema migration

Apply both migrations before relying on the admin Chinese fields in production:

- `supabase/migrations/20260731120000_add_multilingual_cms_columns.sql` — the `*_en` / `*_zh_hant` / `*_zh_hans` columns.
- `supabase/migrations/20260731130000_admin_articles_write_access.sql` — article writes and PDF uploads (without it the articles admin can read but not save).

## Registration forms

- UI labels and client validation messages follow the active locale.
- Stored option **values** (nature of business, etc.) remain English for DB consistency.
- Applicant / admin emails stay English unless product asks otherwise.
