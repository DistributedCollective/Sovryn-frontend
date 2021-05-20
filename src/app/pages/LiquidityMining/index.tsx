import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { translations } from 'locales/i18n';

import { MiningPool } from './components/MiningPool';
import { LiquidityPoolDictionary } from '../../../utils/dictionaries/liquidity-pool-dictionary';
import { AmmPoolsBanner } from './components/AmmPoolsBanner';
import { LootDropSectionWrapper } from '../../components/FinanceV2Components/LootDrop/LootDropSectionWrapper';
import { LootDrop } from '../../components/FinanceV2Components/LootDrop';
import { Asset } from 'types';
import { LootDropColors } from 'app/components/FinanceV2Components/LootDrop/styled';
import cn from 'classnames';
import { usePriceFeeds_tradingPairRates } from '../../hooks/price-feeds/usePriceFeeds_tradingPairRates';

const pools = LiquidityPoolDictionary.list();

export function LiquidityMining() {
  const { t } = useTranslation();
  usePriceFeeds_tradingPairRates();
  const [hasOldPools, setHasOldPools] = useState(true);

  const onOldPoolsNotPresent = useCallback(() => setHasOldPools(false), [
    setHasOldPools,
  ]);

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
        <LootDropSectionWrapper>
          <LootDrop
            title="40K SOV Loot Drop"
            asset1={Asset.SOV}
            asset2={Asset.RBTC}
            startDate="24/05/21, 12.00 UTC"
            endDate="30/05/21, 12.00 UTC"
            linkUrl="https://www.sovryn.app/blog"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Purple}
          />
        </LootDropSectionWrapper>
        {/*<TopInfoSectionWrapper>*/}
        {/*  <TopInfoWrapper>*/}
        {/*    <TopInfoTitle title="Liquidity Provided" />*/}
        {/*    <TopInfoContent*/}
        {/*      isApproximation={true}*/}
        {/*      amount="3.5827"*/}
        {/*      asset={Asset.RBTC}*/}
        {/*    />*/}
        {/*  </TopInfoWrapper>*/}

        {/*  <TopInfoWrapper>*/}
        {/*    <TopInfoTitle title="Available Fees" />*/}
        {/*    <TopInfoContent*/}
        {/*      isApproximation={true}*/}
        {/*      amount="0.2857"*/}
        {/*      asset={Asset.RBTC}*/}
        {/*    />*/}
        {/*  </TopInfoWrapper>*/}

        {/*  <TopInfoWrapper>*/}
        {/*    <TopInfoTitle title="Available Rewards" />*/}
        {/*    <TopInfoContent amount="23.4323" asset={Asset.SOV} />*/}
        {/*  </TopInfoWrapper>*/}

        {/*  <TopInfoWrapper>*/}
        {/*    <TopInfoTitle title="All time Fees Earned" />*/}
        {/*    <TopInfoContent*/}
        {/*      isApproximation={true}*/}
        {/*      amount="34.3928"*/}
        {/*      asset={Asset.RBTC}*/}
        {/*    />*/}
        {/*  </TopInfoWrapper>*/}
        {/*</TopInfoSectionWrapper>*/}

        <AmmPoolsBanner onDataNotPresent={onOldPoolsNotPresent} />

        <div
          className={cn(
            'tw-max-w-screen-2xl tw-mx-auto tw-mt-5',
            hasOldPools && 'tw-opacity-25 tw-pointer-events-none',
          )}
        >
          {pools.map(item => (
            <MiningPool key={item.poolAsset} pool={item} />
          ))}
        </div>

        {/*<div className="tw-mt-10">*/}
        {/*  <div className="tw-px-3 tw-text-lg">*/}
        {/*    {t(translations.liquidityMining.historyTable.title)}*/}
        {/*  </div>*/}
        {/*  <HistoryTable />*/}
        {/*</div>*/}
      </div>

      <Footer />
    </>
  );
}
