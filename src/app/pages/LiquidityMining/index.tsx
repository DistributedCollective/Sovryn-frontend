/**
 *
 * TradingPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { translations } from 'locales/i18n';

import { MiningPoolDictionary } from './dictionaries/mining-pool-dictionary';
import { MiningPool } from './components/MiningPool';

const pools = MiningPoolDictionary.pools;

export function LiquidityMining() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t(translations.escrowPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.escrowPage.meta.description)}
        />
      </Helmet>
      <Header />
      <div className="container mt-5 font-family-montserrat">
        {pools.map(item => (
          <MiningPool key={item.pool} pool={item} />
        ))}
      </div>
      <Footer />
    </>
  );
}
