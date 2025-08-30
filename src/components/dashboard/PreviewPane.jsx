import React from 'react';
import { useI18n } from '@/lib/i18n';
import { canonLang } from '@/lib/lang';
import { usePreviewTranslate } from '@/hooks/usePreviewTranslate';
import AboutClientPreview from './preview/AboutClientPreview';
import ServicesPreview from './preview/ServicesPreview';
import SupportPreview from './preview/SupportPreview';
import PricingPreview from './preview/PricingPreview';

export default function PreviewPane({ spec }) {
  const { currentLanguage } = useI18n();
  const lang = canonLang(currentLanguage);

  const enableAuto = import.meta.env.VITE_PREVIEW_AUTOTRANSLATE === 'true';
  const resolved = usePreviewTranslate(spec, lang, enableAuto);

  return (
    <div key={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <AboutClientPreview data={resolved} lang={lang} />
      <ServicesPreview data={resolved} lang={lang} />
      <SupportPreview data={resolved} lang={lang} />
      <PricingPreview data={resolved} lang={lang} />
    </div>
  );
}
