import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { translations } from 'locales/i18n';

import { MiningPool } from './components/MiningPool';
import { LiquidityPoolDictionary } from '../../../utils/dictionaries/liquidity-pool-dictionary';
import { AmmPoolsBanner } from './components/AmmPoolsBanner';
import { TopInfoSectionWrapper } from '../../components/Finance V2 shared components/TopInfo/TopInfoSectionWrapper/index';
import { TopInfoTitle } from '../../components/Finance V2 shared components/TopInfo/TopInfoTitle/index';
import { TopInfoContent } from '../../components/Finance V2 shared components/TopInfo/TopInfoContent/index';

const pools = LiquidityPoolDictionary.list();

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
        <TopInfoSectionWrapper>
          <div>
            <TopInfoTitle title="Liquidity Provided" />
            <TopInfoContent isApproximation={true} content="3.5827 RBTC" />
          </div>
          <div>
            <TopInfoTitle title="Available Fees" />
            <TopInfoContent isApproximation={true} content="0.2857 RBTC" />
          </div>
          <div>
            <TopInfoTitle title="Available Rewards" />
            <TopInfoContent content="23.4323 SOV" />
          </div>
          <div>
            <TopInfoTitle title="All time Fees Earned" />
            <TopInfoContent isApproximation={true} content="34.3928 RBTC" />
          </div>
        </TopInfoSectionWrapper>
        <AmmPoolsBanner />
        {pools.map(item => (
          <MiningPool key={item.poolAsset} pool={item} />
        ))}
      </div>
      <Footer />
    </>
  );
}
