'use client';

import { useLayoutEffect } from 'react';
import { htmlLang, type Locale } from '@/constants/i18n';

type LocaleDocumentProps = {
  locale: Locale;
};

/**
 * Keeps `<html lang>` and `data-locale` in sync on client navigations.
 * Initial paint is also covered by LocaleBootstrap in the locale layout.
 */
export default function LocaleDocument({ locale }: LocaleDocumentProps) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = htmlLang[locale];
    root.dataset.locale = locale;
  }, [locale]);

  return null;
}
