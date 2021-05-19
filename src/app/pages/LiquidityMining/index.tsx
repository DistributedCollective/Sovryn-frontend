import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { translations } from 'locales/i18n';

import { MiningPool } from './components/MiningPool';
import { LiquidityPoolDictionary } from '../../../utils/dictionaries/liquidity-pool-dictionary';
import { AmmPoolsBanner } from './components/AmmPoolsBanner';
import { TopInfoSectionWrapper } from '../../components/FinanceV2Components/TopInfo/TopInfoSectionWrapper/index';
import { TopInfoTitle } from '../../components/FinanceV2Components/TopInfo/TopInfoTitle/index';
import { TopInfoContent } from '../../components/FinanceV2Components/TopInfo/TopInfoContent/index';
import { TopInfoWrapper } from '../../components/FinanceV2Components/TopInfo/TopInfoWrapper/index';
import { LootDropSectionWrapper } from '../../components/FinanceV2Components/LootDrop/LootDropSectionWrapper/index';
import { LootDrop } from '../../components/FinanceV2Components/LootDrop/index';
import { Asset } from 'types';
import { HistoryTable } from './components/HistoryTable';
import { LootDropColors } from 'app/components/FinanceV2Components/LootDrop/styled';

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
        <LootDropSectionWrapper>
          <LootDrop
            title="50K SOV Loot Drop"
            pool="USDT/RBTC"
            startDate="01/04/21, 12.00 UTC"
            endDate="01/05/21, 12.00 UTC"
            linkUrl="https://www.test.sk"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Purple}
          />
          <LootDrop
            title="75K SOV Loot Drop"
            pool="SOV/RBTC"
            startDate="13/04/21, 12.00 UTC"
            endDate="11/05/21, 12.00 UTC"
            linkUrl="https://www.test.sk"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Yellow}
          />
          <LootDrop
            title="100K SOV Loot Drop"
            pool="ETH/RBTC"
            startDate="17/05/21, 12.00 UTC"
            endDate="17/06/21, 12.00 UTC"
            linkUrl="https://www.test.sk"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Green}
          />
        </LootDropSectionWrapper>
        <TopInfoSectionWrapper>
          <TopInfoWrapper>
            <TopInfoTitle title="Liquidity Provided" />
            <TopInfoContent
              isApproximation={true}
              amount="3.5827"
              asset={Asset.RBTC}
            />
          </TopInfoWrapper>

          <TopInfoWrapper>
            <TopInfoTitle title="Available Fees" />
            <TopInfoContent
              isApproximation={true}
              amount="0.2857"
              asset={Asset.RBTC}
            />
          </TopInfoWrapper>

          <TopInfoWrapper>
            <TopInfoTitle title="Available Rewards" />
            <TopInfoContent amount="23.4323" asset={Asset.SOV} />
          </TopInfoWrapper>

          <TopInfoWrapper>
            <TopInfoTitle title="All time Fees Earned" />
            <TopInfoContent
              isApproximation={true}
              amount="34.3928"
              asset={Asset.RBTC}
            />
          </TopInfoWrapper>
        </TopInfoSectionWrapper>

        <AmmPoolsBanner />
        {pools.map(item => (
          <MiningPool key={item.poolAsset} pool={item} />
        ))}

        <div className="tw-mt-10">
          <div className="tw-px-3 tw-text-lg">
            {t(translations.liquidityMining.historyTable.title)}
          </div>
          <HistoryTable />
        </div>
      </div>

      <Footer />
    </>
  );
}
