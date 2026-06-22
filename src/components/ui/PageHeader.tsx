import AnimatedPageHeader from './AnimatedPageHeader';

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

/** Consistent page banner for interior routes. Renders the page's <h1>. */
export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <AnimatedPageHeader eyebrow={eyebrow} title={title} description={description} />
  );
}
