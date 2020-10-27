/**
 *
 * FastBtcPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Header } from 'app/components/Header';
import { FastBtcForm } from '../FastBtcForm/Loadable';

const s = translations.tradingPage;

interface Props {}

export function FastBtcPage(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t(s.meta.title)}</title>
        <meta name="description" content={t(s.meta.description)} />
      </Helmet>
      <>
        <Header />

        <div className="container mt-5">
          <FastBtcForm />
        </div>
      </>
    </>
  );
}
