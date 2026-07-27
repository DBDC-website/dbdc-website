/** Site imagery — public files under Supabase `website-assets` or `/public`. */

const ASSETS =
  'https://cgwkyszmhbwirecaxbuq.supabase.co/storage/v1/object/public/website-assets';

export type HeroSlide = {
  src: string;
  alt: string;
  /** CSS object-position — nudge framing per photo. */
  objectPosition: string;
};

/** Homepage hero carousel — first slide is shown on load. */
export const heroSlides: HeroSlide[] = [
  {
    src: `${ASSETS}/indoor-statue-mary.jpg`,
    alt: 'Statue of Our Lady in a chapel interior',
    objectPosition: 'center 22%',
  },
  {
    src: `${ASSETS}/jesus-statue-closeup.jpg`,
    alt: 'Close-up of a statue of Jesus',
    objectPosition: 'center 30%',
  },
  {
    src: `${ASSETS}/indoor-1.jpg`,
    alt: 'Baptismal chapel with mosaic mural',
    objectPosition: 'center 35%',
  },
  {
    src: `${ASSETS}/outdoor-bridge.jpg`,
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
  /** About section — two panels that meet in the centre on scroll. */
  aboutMeet: [
    {
      src: `${ASSETS}/indoor-5.jpg`,
      alt: 'Chapel seating before mural walls',
      objectPosition: 'center 45%',
    },
    {
      src: `${ASSETS}/indoor-8.jpg`,
      alt: 'Column with Agnus Dei emblem',
      objectPosition: 'center 40%',
    },
  ],
  renovation: {
    alt: 'Placeholder for renovation site',
    gradient: 'from-sage-100 via-brand-100 to-gold-100',
  },
  parish: {
    alt: 'Placeholder for Hong Kong parish building',
    gradient: 'from-gold-100 via-cream-200 to-brand-100',
  },
} as const;
