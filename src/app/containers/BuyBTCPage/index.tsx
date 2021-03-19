/**
 *
 * BuyBTCPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useIsConnected } from '../../hooks/useAccount';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { OpenTransak } from './components/transak';

export function BuyBTCPage() {
  const { t } = useTranslation();
  const connected = useIsConnected();
  return (
    <>
      <Helmet>
        <title>{t(translations.buyBTCPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.buyBTCPage.meta.description)}
        />
      </Helmet>
      <Header />

      <div className="container" style={{ maxWidth: 1200 }}>
        <div className="d-flex flex-wrap align-items-center justify-content-center mb-3">
          <h2 className="flex-shrink-0 flex-grow-0 mb-2 ">
            {t(translations.buyBTCPage.meta.title)}
          </h2>
        </div>
        <div className="row">
          <div className="col-12 mt-2">{connected && <OpenTransak />}</div>
        </div>
        )
      </div>
      <Footer />
    </>
  );
}
