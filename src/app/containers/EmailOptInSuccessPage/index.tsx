/**
 *
 * EmailOptInSuccessPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { translations } from 'locales/i18n';

import { Header } from 'app/components/Header';
import { Footer } from '../../components/Footer';

const s = translations.tradingPage;

interface Props {}

export function EmailOptInSuccessPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(s.meta.title)}</title>
        <meta name="description" content={t(s.meta.description)} />
      </Helmet>
      <Header />
      <div className="container my-5 py-5">
        <h1 className="mb-3">Success!</h1>
        <h3>
          You will now receive email notifications when your positions are close
          to liquidation. You may opt out of these at any time.
        </h3>
      </div>
      <Footer />
    </>
  );
}
