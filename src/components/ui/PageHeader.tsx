import AnimatedPageHeader from './AnimatedPageHeader';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  backgroundImage?: {
    src: string;
    alt?: string;
    objectPosition?: string;
    /** Uniform zoom (>1) to reframe the crop without stretching. */
    scale?: number;
  };
  theme?: 'default' | 'sanctuary' | 'cathedral' | 'sky';
  contentClassName?: string;
  align?: 'left' | 'center';
};

/** Consistent page banner for interior routes. Renders the page's <h1>. */
export default function PageHeader({
  eyebrow,
  title,
  description,
  backgroundImage,
  theme,
  contentClassName,
  align,
}: PageHeaderProps) {
  return (
    <AnimatedPageHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      backgroundImage={backgroundImage}
      theme={theme}
      contentClassName={contentClassName}
      align={align}
    />
  );
}
