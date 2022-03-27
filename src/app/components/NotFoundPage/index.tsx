import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Helmet } from 'react-helmet-async';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>404 {t(translations.pageNotFound.text)}</title>
        <meta name="description" content={t(translations.pageNotFound.text)} />
      </Helmet>
      <main className="tw-container tw-flex tw-flex-1 tw-flex-col tw-justify-center tw-items-center">
        <h1 className="tw-font-bold">
          4
          <span role="img" aria-label="Crying Face">
            😢
          </span>
          4
        </h1>
        <p>{t(translations.pageNotFound.text)}</p>
        <Link to={'/'}>{t(translations.pageNotFound.backHome)}</Link>
      </main>
    </>
  );
};
