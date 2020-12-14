import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(translations.homePage.title)}</title>
        <meta name="description" content={t(translations.homePage.meta)} />
      </Helmet>
      <div className="container vh-100 d-flex flex-row align-items-center justify-content-center">
        <div className="container d-flex flex-row justify-content-between">
          <div>
            <Link to="/lend" className="bp3-button px-5 py-3">
              {t(translations.homePage.lend)}
            </Link>
          </div>
          <div>
            <Link to="/trade" className="bp3-button px-5 py-3">
              {t(translations.homePage.trade)}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
