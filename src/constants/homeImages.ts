/** Site imagery — public files under Supabase `website-assets` or `/public`. */
import { withSupabaseImageTransform } from '@/lib/supabaseImage';

const ASSETS =
  'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/website-assets';
const TRANSFORM = { width: 1200, quality: 80 } as const;
const withDefaultTransform = (src: string) =>
  withSupabaseImageTransform(src, TRANSFORM);

export type HeroSlide = {
  src: string;
  alt: string;
  /** CSS object-position — nudge framing per photo. */
  objectPosition: string;
};

/** Homepage hero carousel — first slide is shown on load. */
export const heroSlides: HeroSlide[] = [
  {
    src: withDefaultTransform(`${ASSETS}/indoor-statue-mary.jpg`),
    alt: 'Statue of Our Lady in a chapel interior',
    objectPosition: 'center 22%',
  },
  {
    src: withDefaultTransform(`${ASSETS}/outdoor-church-3.jpg`),
    alt: 'Church facade with rose window against blue sky',
    objectPosition: 'center 35%',
  },
  {
    src: withDefaultTransform(`${ASSETS}/indoor-1.jpg`),
    alt: 'Baptismal chapel with mosaic mural',
    objectPosition: 'center 35%',
  },
  {
    src: withDefaultTransform(`${ASSETS}/outdoor-bridge.jpg`),
    alt: 'White cross overlooking a coastal bridge',
    objectPosition: 'center 40%',
  },
];

export const homeImages = {
  hero: {
    src: heroSlides[0].src,
    alt: heroSlides[0].alt,
  },
  about: {
    src: '/images/organization-chart.png',
    alt: 'DBDC organization chart',
    width: 1944,
    height: 1294,
  },
  /** About section — single photo split into halves that meet in the centre. */
  aboutMeet: {
    src: withDefaultTransform(
      'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/project-images/CC%28CR%29_ren2019_02.jpg',
    ),
    alt: 'Aerial view of a white cathedral with dark green roof in an urban setting',
    objectPosition: 'center 42%',
  },
  /** Default backdrop for homepage Featured projects. */
  featuredProjects: {
    src: withDefaultTransform(`${ASSETS}/outdoor-church-3.jpg`),
    alt: 'Church facade with rose window against blue sky',
    objectPosition: 'center 35%',
  },
  /** Homepage Membership section — full-bleed photo behind the orange panel. */
  membership: {
    src: withDefaultTransform(`${ASSETS}/outdoor-bridge.jpg`),
    alt: 'White cross overlooking a coastal bridge',
    objectPosition: 'center 40%',
  },
  /** Homepage Committees section backdrop. */
  committees: {
    src: withDefaultTransform(
      'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/project-images/SJ%28YT%29_ren2021_02.jpg',
    ),
    alt: 'Fan-ceiling chapel interior with curved wooden pews',
    objectPosition: 'center 48%',
  },
  /** Individual committee detail pages. */
  committeeDetail: {
    src: withDefaultTransform(`${ASSETS}/indoor-statue-mary.jpg`),
    alt: 'Statue of Our Lady in a chapel interior',
    objectPosition: 'center 22%',
  },
  /** Selected Projects page hero — bright chapel interior with mosaic altar. */
  projectsHeader: {
    src: withDefaultTransform(
      'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/project-images/SJ%28FL%29_ext_03.JPG',
    ),
    alt: 'Chapel interior with curved wooden pews and a blue-and-gold mosaic behind the altar',
    objectPosition: 'center 42%',
  },
  /** Parish & School Corner hero — hilltop church facade. */
  parishSchoolHeader: {
    src: withDefaultTransform(
      'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/project-images/STCK%28SL%29_ren2019_01.jpg',
    ),
    alt: 'Colorful children playroom mural with space-themed artwork',
    objectPosition: 'center 46%',
  },
  renovation: {
    alt: 'Placeholder for renovation site',
    gradient: 'from-sage-100 via-brand-100 to-gold-100',
  },
  parish: {
    alt: 'Placeholder for Hong Kong parish building',
    gradient: 'from-gold-100 via-cream-200 to-brand-100',
  },
} as const;
