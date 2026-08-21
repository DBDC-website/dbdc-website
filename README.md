# DBDC Website

Public website and content-management system for the **Diocesan Building and Development Commission (DBDC)** of the Catholic Diocese of Hong Kong.

Vercel Production: `https://dbdc-website-on1a-dbdc.vercel.app/en`

**Contents:** [Overview](#project-overview) · [Tech Stack](#tech-stack) · [Architecture](#architecture) · [Features](#features) · [Project Structure](#project-structure) · [Local Development](#getting-started-local-development) · [Environment Variables](#environment-variables) · [Deployment](#deployment) · [Maintenance](#common-maintenance-tasks)

---

## Project Overview

The DBDC oversees construction, renovation, and maintenance of diocesan buildings — churches, chapels, schools, and parish facilities. This site is both its public face and its internal admin tool, serving four audiences:

| Audience | Uses the site to |
|---|---|
| Public / parishioners | Read about the Commission, browse completed projects, download research articles |
| Parish priests, school administrators | Find working guidelines, FAQs, government links, and flow-chart PDFs |
| Consultants and contractors | Submit registration applications with supporting documents and signatures |
| DBDC staff | Manage all content and review registrations via the admin panel |

The Commission has a main body plus four sub-committees, each with its own public page:

| Slug | Committee |
|---|---|
| `dbdc` | Main Commission (shown on the homepage, no standalone page) |
| `rdc` | Research & Development Committee |
| `sc` | Standing Committee |
| `wc` | Works Committee |
| `cabpag` | Church and Building Professionals Advisory Group |

The public site is fully trilingual: English (`en`), Traditional Chinese (`zh-Hant`), and Simplified Chinese (`zh-Hans`).

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16.2** | App Router. See the version warning below. |
| UI | **React 19.2** | Server Components by default; Server Actions for all mutations |
| Language | **TypeScript 5** | `strict: true`, path alias `@/*` → `./src/*` |
| Styling | **Tailwind CSS v4** | CSS-first config — **no `tailwind.config.js`**. Tokens live in the `@theme` block of `src/app/globals.css`. |
| Backend | **Supabase** | Postgres 17, Row Level Security, Auth (magic link), Storage |
| Forms | **react-hook-form + Zod** | Public registration forms; admin uses native `<form action={serverAction}>` |
| Animation | **Framer Motion**, **Lenis** | Lenis smooth scroll on desktop pointers only |
| Icons | **lucide-react** | |
| Email | **Resend** | Registration notifications and acknowledgements |
| ZIP export | **jszip** | Admin registration bundles |
| Hosting | **Vercel** | |
| Tooling | ESLint 9 (flat config), Prettier 3 | |

> ### Next.js 16 differs from older documentation
>
> Most Next.js material still describes v13–v15. Two differences you will hit immediately:
>
> 1. **Middleware is now "Proxy."** The file is `proxy.ts` at the repo root and exports a function named `proxy`.
> 2. **Route params are async.** `params` is a `Promise`: `const { locale } = await params;`
>
> Version-matched guides are bundled with the framework at `node_modules/next/dist/docs/`. Prefer them over anything found online.

---

## Architecture

### High-level shape

One Next.js application containing two logically separate apps that share a codebase, database, and deployment. There is **no separate backend service** — Server Components read from Supabase directly, and Server Actions perform writes.

```
                          ┌──────────────────────────────┐
   Visitor ──────────────▶│  Public site  /{locale}/...  │
                          │  Server Components, mostly   │
                          │  read-only                   │
                          └───────────┬──────────────────┘
                                      │  anon key, RLS-restricted reads
                                      ▼
                          ┌──────────────────────────────┐
                          │         Supabase             │
                          │  Postgres + Auth + Storage   │
                          └───────────▲──────────────────┘
                                      │  authenticated session, RLS writes
                          ┌───────────┴──────────────────┐
   DBDC staff ───────────▶│  Admin panel  /admin/...     │
                          │  Magic-link auth, Server     │
                          │  Actions for all mutations   │
                          └──────────────────────────────┘
```

### Routing and the Proxy

`proxy.ts` runs on every non-asset request and does two unrelated jobs:

```ts
if (pathname === '/admin' || pathname.startsWith('/admin/')) {
  return updateSession(request);   // refresh Supabase auth cookies
}
// everything else: ensure a locale prefix, sync the NEXT_LOCALE cookie
```

Session refresh happens in `updateSession()` (`src/lib/supabase/proxy.ts`), which calls `supabase.auth.getUser()` — that call is what rotates the auth cookies. **Do not insert logic between `createServerClient` and `getUser()`.**

| URL | Handled by |
|---|---|
| `/` | `src/app/page.tsx` → redirect to `/en` |
| `/{locale}/...` | `src/app/[locale]/` |
| `/admin/login`, `/admin/auth/callback` | Unauthenticated entry points |
| `/admin/...` | `src/app/admin/(protected)/` — route group invisible in URLs, its layout enforces auth |

Path segments are never translated: `/zh-Hant/projects`, not `/zh-Hant/項目`.

### The Supabase clients

Three clients, not interchangeable:

| File | Used by | Auth context |
|---|---|---|
| `src/lib/supabaseClient.ts` | Public reads, registration submits, client-side uploads | Anonymous (`anon`) |
| `src/lib/supabase/server.ts` | All admin Server Components and Server Actions | Signed-in admin (`authenticated`) |
| `src/lib/supabase/proxy.ts` | The Proxy, for session refresh only | — |

Rule of thumb: anything under `src/app/admin/` uses `supabase/server.ts`; anything public uses `supabaseClient.ts`.

### Authorization

Admin access is enforced in two layers, and only one of them is strong.

**Application layer (the real gate)** — an email allowlist in `src/constants/admin.ts` read from `ADMIN_EMAILS`. `isAdminEmail()` is checked in four places: before sending a magic link, in the auth callback (signing the user out if they fail), in `(protected)/layout.tsx`, and in `requireAdmin()`, which every mutating Server Action calls first.

**Database layer (deliberately coarse)** — every admin RLS policy is `auth.role() = 'authenticated'`. There is no allowlist inside the database, so Postgres treats *any* signed-in Supabase Auth user as an admin.

This is safe today because magic-link login is the only way to obtain a session and it validates the allowlist first. **If you ever add a second authentication path** — OAuth, public sign-up, or another app sharing this Supabase project — **harden the RLS policies to check the user's email before doing so.** That is the most important security note in this document.

### Login flow

Password-less, magic link only:

1. Admin submits their email at `/admin/login`.
2. `sendAdminMagicLink()` rejects it unless allowlisted, then calls `signInWithOtp` with `emailRedirectTo: '{origin}/admin/auth/callback'` and `shouldCreateUser: true`.
3. Supabase sends the email (via Supabase Auth, **not** Resend).
4. The callback exchanges the code, re-checks the allowlist, and redirects to `/admin`.

`shouldCreateUser: true` means Auth users never need to be created by hand — adding an email to `ADMIN_EMAILS` is sufficient.

### Internationalization

No i18n library; roughly 300 lines of hand-written code. Locales are declared in `src/constants/i18n.ts` and persisted in a `NEXT_LOCALE` cookie. Fallback chains: `zh-Hant` → `zh-Hans` → `en`, and `zh-Hans` → `zh-Hant` → `en`.

Three sources of translated text, depending on the kind of content:

| Kind of copy | Lives in | Read with |
|---|---|---|
| UI labels, buttons, headings | `src/messages/{en,zh-Hant,zh-Hans}.json` — 219 keys each, kept in sync | `t(locale, 'home.aboutTitle')`, `tList()` for arrays |
| Long-form prose (legal, parish guidelines, committee terms, CaBPAG FAQ) | English in `src/constants/`, Chinese in `src/content/` | `pickContent(map, locale)` |
| CMS content entered by staff | Supabase `{field}_en` / `_zh_hant` / `_zh_hans` columns plus a legacy unsuffixed column | `pickLocalized(row, 'title', locale)` |

`t()` takes a dot-path, not a namespace argument. Missing keys warn in development and render the key itself, so gaps are visible but never crash a page. Metadata and hreflang come from `buildPageMetadata()` in `src/lib/i18n/metadata.ts`, which every public page's `generateMetadata` calls.

Translation policy for editors is in `docs/i18n-editors.md`: author Traditional Chinese first as the Hong Kong source, generate Simplified with OpenCC but always human-review, never machine-translate personal names, and use human translation only for legal text.

### Data fetching and caching

Public pages fetch from Supabase inside Server Components — no SWR or React Query. Invalidation is entirely `revalidatePath`; most admin writes call `revalidatePath('/', 'layout')`, and Past Work actions additionally revalidate each committee page per locale.

Two deviations: `/{locale}/articles` is `force-dynamic`, and the guidelines and committee pages use `generateStaticParams`.

Read helpers in `src/lib/projects.ts` query the multilingual columns first and retry with the pre-i18n column set on error, so the site keeps rendering if a migration hasn't been applied yet. Keep that pattern if you add columns.

---

## Features

### Public site

**Homepage** — hero carousel (three parallax slides), About the DBDC with live membership from `committee_members` grouped by role band (static fallback in `src/constants/about.ts`), Featured Projects carousel, and Featured Experiences.

**Selected Projects** — grid of published projects with a lightbox showcase. Projects without photos get a branded gradient placeholder. Opening the lightbox hides the header and floating buttons via `src/lib/siteChrome.ts`.

**Parish & School Corner** — preamble, FAQ accordion, contact block, and government department links. The `/parish-school/guidelines` sub-page holds working tips and three flow-chart PDFs served from `public/documents/guidelines/`.

**Committee pages** (`/{locale}/committees/{rdc|sc|wc|cabpag}`) — statically generated per locale × committee. Sticky side nav, accordion content sections, live member list, and a Past Work timeline grouped by year with optional attachments and links. CaBPAG additionally lists newsletters and its own FAQ.

**Articles** — research PDFs with Roman-numeral labels, author, and date. Force-dynamic so uploads appear immediately.

**Consultants & Contractors** — landing page plus the two registration forms below.

**Legal** — `/copyright-disclaimer`, `/privacy-policy`, `/pics`.

**Redirect stubs** — `/about`, `/contact`, `/committees`, `/committee`, `/consultants`, `/partners` redirect to their current homes so older printed and linked URLs resolve. They are excluded from the sitemap by design.

**Chrome** — fixed scroll-reactive header, desktop dropdown nav, CSS-checkbox mobile menu, language switcher, footer with contact details and map, floating donate and back-to-top buttons, WCAG skip link. `NavigationScrollManager` implements custom scroll restoration (forward → top or hash, back/forward → saved position, reload → animated restore).

**Accessibility** — all motion respects `prefers-reduced-motion` via both `useReducedMotion()` and a global CSS override. Lenis is disabled on touch devices and for reduced-motion users.

**SEO** — `robots.ts` allows everything except `/admin`; `sitemap.ts` emits every public path × locale with hreflang alternates.

### Registration forms

Two long single-page forms using `react-hook-form` with `mode: 'onBlur'` and a Zod resolver.

**Shared sections:** company information, business registration, scope of services, company capital, principals and directors (repeatable, each with a signature), portfolio document uploads (repeatable), audited accounts, and a required privacy acknowledgement.

**Consultant-specific:** nature of business (11 disciplines plus Others), AACSB and EACSB approved-list status with dates and documents, other approved lists (repeatable), and in-house professionals — Authorised Person categories I/II/III, Registered Structural and Geotechnical Engineer, Authorised Land Surveyor, Registered Inspector, Registered Energy Assessor, and a repeatable "other professionals" list.

**Contractor-specific:** 15 contractor classifications including a Minor Works parent whose I/II/III sub-options auto-manage the parent selection, Buildings Department registration details, DevB approved-list status, and a boolean grid of in-house professionals.

**Signature capture** (`SignaturePad.tsx`) — draw on canvas or upload a PNG/JPEG. A pixel check rejects an empty canvas. On confirm the canvas becomes a PNG `File`, uploads immediately, and only the resulting storage path is held in form state.

**Document uploads** (`DocumentUploadField.tsx`) — PDF, DOCX, JPG, PNG at 10 MB per file, unlimited count, uploaded client-side before submit. Removing a file (or replacing a signature) deletes the object from storage, so the bucket does not accumulate orphans.

**Validation** enforces company name, telephone, email, and the privacy acknowledgement. Supporting documents, signatures, and nature-of-business selections are deliberately optional so applicants are never blocked from submitting an otherwise complete application — DBDC follows up on anything missing during review.

**Submission** (`src/app/actions/registrations.ts`) — the Server Action re-validates with the English schema, maps to the database shape, and calls a `SECURITY DEFINER` Postgres function (`submit_consultant_registration` / `submit_contractor_registration`) that inserts the parent and child rows in one transaction and returns the new ID. The RPC pattern lets anonymous users insert without ever being granted `SELECT` on submissions.

### Admin panel

At `/admin`. Every section follows a list → new → edit shape.

| Section | Manages | Tables |
|---|---|---|
| Dashboard | Counts across all content and registrations | — |
| Projects | Title, building name, address, year, published flag, primary image, gallery with captions | `projects`, `project_images` |
| Committees | Members per committee, role, active flag, ordering | `committee_members` |
| Past Work | Year sections per committee, bullets with optional PDF/image/link, bulk entry | `committee_past_work_years`, `committee_past_work_items` |
| Newsletters | CaBPAG newsletters — title, month/year, PDF or external URL, active flag | `cabpag_newsletters` |
| Articles | Research PDFs — title, label, author, date | `articles` |
| Registrations | Review, approve/reject, download, delete | registration tables |

**Drag-and-drop ordering** — `AdminSortableTable.tsx` is a generic HTML5 drag-and-drop table using `useOptimistic` + `useTransition`. Dropping calls the entity's reorder action, which rewrites `sort_order` as a contiguous 1-based sequence. Reordering articles renumbers Roman-numeral labels but leaves any label an editor typed untouched (`isAutoRomanLabel` in `src/lib/admin/romanLabel.ts`).

**Trilingual editing** — every content form renders three parallel inputs per translatable field. English is required; Chinese is optional and falls back at read time. `ArticlesSortableTable` shows EN / 繁 / 简 badges so editors can see coverage at a glance.

**Registration review** — the detail page renders every submitted field and signature, and exposes uploaded documents through 1-hour signed URLs (the bucket is private). Statuses are `pending` → `approved` | `rejected`. Applicants are not emailed on a status change; staff follow up directly, and the admin UI says so.

**ZIP export** (`/admin/registrations/{type}/{id}/download`) — bundles a printable `Registration-Form.html`, a complete `registration-data.json`, all documents sorted into category folders, signature PNGs, and a `MISSING_FILES.txt` if any storage download failed. Named `DBDC-{type}-{id}-{company}.zip`.

**Server Actions** — all writes live in `src/app/admin/actions/*.ts`. Each begins with `await requireAdmin()`, validates, writes, calls `revalidatePath`, and redirects back with a `?saved=1` / `?error=…` flag the page renders as a banner.

### Email

All email is sent from one place: `sendRegistrationEmails()` in `src/app/actions/registrations.ts`. Two messages, both triggered by a successful registration submission:

| Email | Recipients | Subject |
|---|---|---|
| Admin notification | **To** `ADMIN_EMAIL` only (office inbox; no Cc) | `[DBDC] New {Consultant\|Contractor} Registration — {companyName}` |
| Applicant acknowledgement | The address on the form | `DBDC Registration Acknowledgement — DBDC-{TYPE}-{id}` |

Both send from `RESEND_FROM_EMAIL` with inline HTML. **Emails are English-only by design** — the registration forms themselves are English, so correspondence matches the submitted application. Sending is skipped silently (the submission still succeeds) if Resend is not configured or the applicant left the email field blank.

Admin login emails come from Supabase Auth, not Resend.

---

## Project Structure

```
dbdc-website/
├── proxy.ts                    # Next.js 16 Proxy: locale routing + auth cookie refresh
├── next.config.ts              # Server Action body limit (26mb), Supabase image patterns
├── eslint.config.mjs           # Flat ESLint config
├── postcss.config.mjs          # Tailwind v4 via @tailwindcss/postcss
├── tsconfig.json               # strict; @/* → ./src/*
│
├── docs/i18n-editors.md        # Translation policy — read before translating
│
├── public/
│   ├── images/                 # Logo, map thumbnail, heritage/virtual-tour tiles
│   └── documents/guidelines/   # Parish flow-chart PDFs + a README on naming them
│
├── scripts/link-images.js      # One-off: bulk-link storage images to project records
│
├── supabase/
│   ├── config.toml             # Local CLI stack (Postgres 17, ports, auth)
│   ├── seed.sql                # Local dev fixtures for `supabase db reset`
│   └── migrations/             # Timestamped SQL — the schema source of truth
│
└── src/
    ├── app/
    │   ├── layout.tsx          # Root: fonts (Inter, Lora), metadataBase, smooth scroll
    │   ├── page.tsx            # / → redirect to /en
    │   ├── globals.css         # Tailwind @theme tokens, CJK font stacks, reduced motion
    │   ├── robots.ts           # Disallows /admin
    │   ├── sitemap.ts          # All public paths × 3 locales with hreflang
    │   │
    │   ├── [locale]/           # ── PUBLIC SITE ──
    │   │   ├── layout.tsx      # Locale validation, chrome, generateStaticParams
    │   │   ├── page.tsx        # Homepage
    │   │   ├── projects/  parish-school/ (+ guidelines/)
    │   │   ├── committees/[committee]/
    │   │   ├── consultants-contractors/  (+ consultant/ + contractor/)
    │   │   ├── articles/
    │   │   ├── copyright-disclaimer/  privacy-policy/  pics/
    │   │   └── about|contact|committee|consultants|partners/   # redirect stubs
    │   │
    │   ├── actions/registrations.ts   # Public submit actions + all Resend email
    │   │
    │   └── admin/              # ── ADMIN PANEL ──
    │       ├── login/  auth/callback/
    │       ├── actions/        # Server Actions: auth, articles, committees, newsletters,
    │       │                   #   pastWork, projects, registrations, updateStatus
    │       └── (protected)/    # Auth-gated route group (invisible in URLs)
    │           ├── layout.tsx  # THE auth gate + AdminNav
    │           └── page.tsx, projects|committees|past-work|newsletters|articles|registrations/
    │
    ├── components/
    │   ├── ui/                 # Button, Card, Container, Section, PageHeader…
    │   ├── layout/             # Header, MainNav, MobileMenu*, Footer, LanguageSwitcher,
    │   │                       #   FloatingActionButtons, NavigationScrollManager, SkipLink
    │   ├── motion/             # SmoothScroll (Lenis), ScrollReveal, StaggerChildren, parallax
    │   ├── home/               # Homepage sections
    │   ├── projects/ committees/ parish-school/ articles/ consultants/ legal/
    │   ├── registration/       # ConsultantForm, ContractorForm, SignaturePad, DocumentUploadField…
    │   ├── forms/Fields.tsx    # TextField, TextAreaField, CheckboxField, FormSection, FieldError
    │   └── admin/              # Admin forms, sortable tables, status badges/actions
    │
    ├── constants/              # English source data + configuration
    │   ├── i18n.ts             # Locales, cookie name, path helpers
    │   ├── admin.ts            # Admin allowlist, bucket names, committee/role/status enums
    │   ├── homeImages.ts       # Site imagery URLs + cache-busting version
    │   ├── site.ts             # contactInfo (footer + legal pages)
    │   └── about.ts committees.ts legal.ts parishSchool.ts parishGuidelines.ts
    │       donate.ts projectPlaceholders.ts
    │
    ├── content/                # Chinese translations of the constants/ long-form copy
    ├── messages/               # UI catalogs — en / zh-Hant / zh-Hans, 219 keys each
    │
    ├── lib/
    │   ├── supabaseClient.ts   # Anonymous client (public site)
    │   ├── supabase/           # server.ts, browser.ts, proxy.ts (@supabase/ssr)
    │   ├── i18n.ts             # t(), tList(), fallback chain, role localization
    │   ├── i18n/               # metadata.ts, navigation.ts, pickLocalized.ts
    │   ├── projects.ts articles.ts committees.ts newsletters.ts pastWork.ts
    │   ├── committeeNav.ts     # Committee side nav + page sections
    │   ├── validations/registration.ts   # Zod schemas
    │   ├── registrationUploads.ts        # Public uploads + discard of removed files
    │   ├── admin/              # Queries, ordering, storage helpers, ZIP export
    │   └── motion.ts cn.ts siteChrome.ts supabaseImage.ts
    │
    ├── hooks/                  # useTouchDevice, useSiteChromeHidden
    └── types/                  # Row and domain types per entity
```

### Where to make a given change

| I want to… | Go to |
|---|---|
| Change a button or heading label | `src/messages/*.json` (all three files) |
| Change legal or parish long-form copy | English in `src/constants/`, Chinese in `src/content/` |
| Change navigation links | `src/lib/i18n/navigation.ts` |
| Change brand colours or fonts | The `@theme` block in `src/app/globals.css` |
| Change a background photo | `src/constants/homeImages.ts`, bumping `ASSETS_VERSION` if you reused a filename |
| Add a database column | Migration → row type in `src/types/` → read helper in `src/lib/` → admin form |
| Change registration fields | `src/components/registration/`, the Zod schema, the mapper in `src/app/actions/registrations.ts`, and the Postgres RPC |
| Change email content | `sendRegistrationEmails()` in `src/app/actions/registrations.ts` |
| Add an admin user | The `ADMIN_EMAILS` environment variable |

---

## Getting Started (Local Development)

**Prerequisites:** Node.js 20.9+ (22 LTS recommended), npm, a Supabase project (hosted or local via the Supabase CLI and Docker), and optionally a Resend account to test email.

```bash
git clone <repository-url>
cd dbdc-website
npm install
```

Create `.env.local` with the variables in the next section — `.env*` is gitignored and must never be committed. Then:

```bash
npm run dev          # http://localhost:3000
```

`/` redirects to `/en`; the admin panel is at `/admin`.

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run link-images` | One-off bulk image import (see Maintenance) |

### Database setup

The schema lives entirely in `supabase/migrations/`, applied in timestamp order. Against a hosted project:

```bash
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push
```

Locally:

```bash
supabase start        # Postgres :54322, API :54321, Studio :54323
supabase db reset     # destructive — reapplies all migrations, then supabase/seed.sql
```

### Logging in as an admin locally

Put your email in `ADMIN_EMAILS`, go to `/admin/login`, and submit it. On the local stack the magic-link email is captured by Inbucket at `http://localhost:54324` rather than sent. On a hosted project, make sure Supabase Auth → URL Configuration lists `http://localhost:3000/admin/auth/callback` as an allowed redirect. No Auth user needs to be created by hand.

---

## Environment Variables

Set these in `.env.local` locally and in Vercel → Settings → Environment Variables for deployed environments.

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Yes | Anon key. Safe to expose — RLS protects the data. |
| `ADMIN_EMAILS` | Server | Yes | Comma-separated allowlist for `/admin` login only. Does not receive registration notifications. |
| `RESEND_API_KEY` | Server | Yes in production | Enables transactional email. Without it, submissions succeed but no email is sent. |
| `RESEND_FROM_EMAIL` | Server | Yes in production | From address, e.g. `DBDC <noreply@dbdc.catholic.org.hk>`. Must be on a domain verified in Resend. |
| `NEXT_PUBLIC_SITE_URL` | Public | Recommended | Email footer link and magic-link redirect fallback. Defaults to the production URL. |
| `ADMIN_EMAIL` | Server | Yes in production | Sole recipient (**To**) for new-registration notifications, e.g. `office@hkdbdc.org.hk`. Falls back to the first `ADMIN_EMAILS` address if unset. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Script only | Bypasses RLS; used only by `npm run link-images`. **Do not add it to Vercel** — the app never reads it. Treat as a secret. |

`NEXT_PUBLIC_` variables are inlined into the client bundle at build time, so changing one requires a redeploy.

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # only to run link-images

ADMIN_EMAIL=office@hkdbdc.org.hk
ADMIN_EMAILS=office@hkdbdc.org.hk,person.one@dbdc.catholic.org.hk,person.two@dbdc.catholic.org.hk

RESEND_API_KEY=<resend-api-key>
RESEND_FROM_EMAIL=DBDC <noreply@dbdc.catholic.org.hk>

NEXT_PUBLIC_SITE_URL=https://dbdc.catholic.org.hk
```

---

## Deployment

### Vercel

Deploys with zero custom configuration — no `vercel.json`; Vercel auto-detects Next.js.

| Setting | Value |
|---|---|
| Framework | Next.js |
| Build / install / output | Defaults (`npm run build`, `npm install`, `.next`) |
| Node version | 20.x or 22.x |
| Production branch | `main` |

Pushes to `main` deploy to production; other branches create previews. Set the environment variables for Production, and for Preview if you want previews working against the same Supabase project. Attach `dbdc.catholic.org.hk` under Domains.

**Upload limits.** `next.config.ts` raises the Server Action body limit to 26 MB because admin uploads go through Server Actions. Article and newsletter PDFs are capped at 25 MB and project images at 8 MB in the actions themselves; if you raise those, raise `bodySizeLimit` too.

### Supabase

Storage buckets:

| Bucket | Visibility | Contents |
|---|---|---|
| `registration-documents` | Private | Registration documents and signatures. Anonymous insert allowed; reads only via authenticated session or signed URL. Applicants may delete their own uploads for 24 hours so abandoned files clean themselves up. |
| `project-images` | Public | Project primary and gallery images |
| `articles-bucket` | Public | Article PDFs |
| `committee-past-work` | Public | Past Work attachments |
| `cabpag-newsletters` | Public | CaBPAG newsletter PDFs |
| `website-assets` | Public | Site photography referenced by `src/constants/homeImages.ts` |

`website-assets` is managed through the Supabase dashboard rather than a migration, since it holds design assets rather than application data. The other five are created by migrations.

Auth settings to confirm after any project change:

- Email / magic-link provider enabled
- Site URL set to `https://dbdc.catholic.org.hk`
- Redirect allowlist includes `https://dbdc.catholic.org.hk/admin/auth/callback` plus any preview and localhost equivalents

### Ownership transfer

| Service | Moves to | Check afterwards |
|---|---|---|
| GitHub | The DBDC organisation | Repoint the Vercel Git integration; consider branch protection on `main` |
| Vercel | The DBDC team | Re-enter all environment variables and re-attach the custom domain |
| Supabase | Organisation ownership to `cloud-ops@dbdc.catholic.org.hk` | Transferring the organisation preserves the project ref, URL, and keys, so no code changes are needed. Verify billing and Auth access. |
| Resend | Company domain and mailboxes | Point `RESEND_FROM_EMAIL` at the verified domain; set `ADMIN_EMAIL` to the office inbox and `ADMIN_EMAILS` to DBDC staff |

If the Supabase **project** is ever recreated rather than transferred, the project ref appears in `next.config.ts` (`images.remotePatterns`), `src/constants/homeImages.ts` (the `ASSETS` base URL and two direct image URLs), and in `image_url` / `pdf_url` values already stored in the database.

### Launch checklist

- [ ] `ADMIN_EMAIL` set to the office inbox and `ADMIN_EMAILS` set to real DBDC staff addresses in Vercel Production
- [ ] `RESEND_FROM_EMAIL` on the verified company domain
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production URL
- [ ] Supabase Auth redirect allowlist includes the production callback URL
- [ ] Each admin has received and used a magic link
- [ ] A test registration submits end to end, both emails arrive, and the ZIP export downloads
- [ ] `/robots.txt` and `/sitemap.xml` return the expected content
- [ ] All three locales render correctly on the homepage, a committee page, and a legal page

---

## Common Maintenance Tasks

**Add or remove an admin.** Edit `ADMIN_EMAILS` in Vercel and redeploy. Adding an email is enough — the Supabase Auth user is created on first login. Removing one blocks login immediately but leaves the Auth user in place; delete it in the Supabase dashboard to fully revoke the session.

**Add a UI string.** Add the same dot-path key to all three files in `src/messages/`, then read it with `t(locale, 'your.key')`.

**Add a public page.**

1. Create `src/app/[locale]/your-page/page.tsx` as a Server Component.
2. Accept `params: Promise<{ locale: string }>` and await it.
3. Guard with `isValidLocale(locale)` → `notFound()`.
4. Export `generateMetadata` using `buildPageMetadata({ locale, path, titleKey, descriptionKey })`.
5. Add the path to `PUBLIC_PATHS` in `src/lib/i18n/metadata.ts` for the sitemap.
6. Add a nav entry in `src/lib/i18n/navigation.ts` if it should be linked.

**Add a database column.** Run `supabase migration new <name>` and write idempotent SQL (`add column if not exists`). Then update, in order: the row type in `src/types/`, the `SELECT` list and mapper in the relevant `src/lib/` helper, the admin data helper in `src/lib/admin/`, the Server Action, and the admin form. For user-facing text, add all three locale variants and read with `pickLocalized`.

**Replace a site photograph.** Upload to the `website-assets` bucket. If you kept the filename, bump `ASSETS_VERSION` in `src/constants/homeImages.ts` so the cache-busting query changes.

**Bulk-import project images** (`npm run link-images`). Reads every `projects` row, lists the `project-images` bucket, groups files by matching the project slug (stripping the extension and any trailing `_01` suffix), inserts `project_images` rows, and sets each project's `image_url` to its first image. Requires `SUPABASE_SERVICE_ROLE_KEY` because it bypasses RLS. It appends rather than reconciles, so running it twice creates duplicates — use it for initial import, and the admin panel for everyday gallery work.
