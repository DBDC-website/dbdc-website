/** Site imagery — public files under Supabase `website-assets` or `/public`. */
import { withSupabaseImageTransform } from '@/lib/supabaseImage';

const ASSETS =
  'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/website-assets';
const TRANSFORM = { width: 1200, quality: 80 } as const;
const withDefaultTransform = (src: string) =>
  withSupabaseImageTransform(src, TRANSFORM);

/**
 * Bump when files in `website-assets` are replaced under the same filename
 * so browsers / Next Image cache pick up the new (smaller) uploads.
 */
const ASSETS_VERSION = '20260731b';

export function websiteAsset(filename: string): string {
  return withDefaultTransform(`${ASSETS}/${filename}?v=${ASSETS_VERSION}`);
}

export type HeroSlide = {
  src: string;
  alt: string;
  /** CSS object-position — nudge framing per photo. */
  objectPosition: string;
};

/** Homepage hero carousel — first slide is shown on load. */
export const heroSlides: HeroSlide[] = [
  {
    src: websiteAsset('indoor-statue-mary.jpg'),
    alt: 'Statue of Our Lady in a chapel interior',
    objectPosition: '28% 42%',
  },
  {
    src: websiteAsset('jesus-statue-side.jpg'),
    alt: 'Statue of Jesus on a cross with a gold and blue mosaic backdrop',
    objectPosition: 'center 35%',
  },
  {
    src: websiteAsset('indoor-1.jpg'),
    alt: 'Baptismal chapel with mosaic mural',
    objectPosition: 'center 48%',
  },
  {
    src: websiteAsset('outdoor-bridge.jpg'),
    alt: 'White cross overlooking a coastal bridge',
    objectPosition: 'center 42%',
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
    src: websiteAsset('outdoor-church-3.jpg'),
    alt: 'Church facade with rose window against blue sky',
    objectPosition: 'center 40%',
  },
  /** Homepage Featured experiences — hanging crucifix chapel interior. */
  featuredExperiences: {
    src: websiteAsset('indoor-church-hanging.jpg'),
    alt: 'Ornate hanging crucifix in a cream and blue chapel interior',
    objectPosition: 'center 40%',
  },
  /** Homepage Membership section — full-bleed photo behind the orange panel. */
  membership: {
    src: websiteAsset('indoor-15.jpg'),
    alt: 'Cream chapel interior with pointed windows and coffered ceiling',
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
    src: websiteAsset('indoor-10.jpg'),
    alt: 'Modern chapel interior with wooden pews and stained glass',
    objectPosition: 'center 42%',
  },
  /** Legal / policy pages. */
  legalPage: {
    src: websiteAsset('jesus-statue-side.jpg'),
    alt: 'Statue of Jesus on a cross with a gold and blue mosaic backdrop',
    objectPosition: 'center 38%',
  },
  /** Parish working guidelines page. */
  guidelinesPage: {
    src: websiteAsset('outdoor-statue.jpg'),
    alt: 'White marble statue of two figures against a red wall and greenery',
    objectPosition: 'center 45%',
  },
  /** Articles page header. */
  articlesHeader: {
    src: websiteAsset('indoor-1.jpg'),
    alt: 'Baptismal chapel with mosaic mural',
    objectPosition: 'center 48%',
  },
  /** Consultants & contractors page headers. */
  consultantsHeader: {
    src: websiteAsset('outdoor-bridge.jpg'),
    alt: 'White cross overlooking a coastal bridge',
    objectPosition: 'center 42%',
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
