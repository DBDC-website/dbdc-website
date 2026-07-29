'use client';

import { useEffect, useState } from 'react';
import { isSiteChromeHidden } from '@/lib/siteChrome';

/** Subscribe to project-lightbox chrome hiding. */
export function useSiteChromeHidden() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(isSiteChromeHidden());

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ hidden: boolean }>).detail;
      setHidden(Boolean(detail?.hidden));
    };

    window.addEventListener('site-chrome-hidden-change', onChange);
    return () => window.removeEventListener('site-chrome-hidden-change', onChange);
  }, []);

  return hidden;
}
