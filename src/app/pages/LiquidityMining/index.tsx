import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation, Trans } from 'react-i18next';
import cn from 'classnames';

import { translations } from 'locales/i18n';
import { Header } from 'app/components/Header';
import { Footer } from 'app/components/Footer';
import { MiningPool } from './components/MiningPool';
import { LiquidityPoolDictionary } from '../../../utils/dictionaries/liquidity-pool-dictionary';
import { AmmPoolsBanner } from './components/AmmPoolsBanner';
import { LootDropSectionWrapper } from '../../components/FinanceV2Components/LootDrop/LootDropSectionWrapper';
import { LootDrop } from '../../components/FinanceV2Components/LootDrop';
import { Asset } from 'types';
import { LootDropColors } from 'app/components/FinanceV2Components/LootDrop/styled';
import { HistoryTable } from './components/HistoryTable';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { discordInvite } from 'utils/classifiers';
import { useFetch } from 'app/hooks/useFetch';
import { backendUrl, currentChainId } from 'utils/classifiers';

const pools = LiquidityPoolDictionary.list();

export function LiquidityMining() {
  const { t } = useTranslation();
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.ADD_LIQUIDITY]: addLiqLocked,
    [States.REMOVE_LIQUIDITY]: removeLiqLocked,
  } = checkMaintenances();

  const [hasOldPools, setHasOldPools] = useState(true);

  const onOldPoolsNotPresent = useCallback(() => setHasOldPools(false), [
    setHasOldPools,
  ]);

  const { value: ammData } = useFetch(
    `${backendUrl[currentChainId]}/amm/apy/all`,
  );

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
            title="15k SOV"
            asset1={Asset.BNB}
            asset2={Asset.RBTC}
            message={t(translations.liquidityMining.recalibration, {
              date: 'July 26',
            })}
            linkUrl="https://www.sovryn.app/blog/bnb-btc-pool-is-live"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Blue}
          />
          <LootDrop
            title="15K SOV"
            asset1={Asset.XUSD}
            asset2={Asset.RBTC}
            message={t(translations.liquidityMining.recalibration, {
              date: 'July 26',
            })}
            linkUrl="https://www.sovryn.app/blog/xusd-go-brrrrr"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Yellow}
          />
          <LootDrop
            title="15K SOV"
            asset1={Asset.SOV}
            asset2={Asset.RBTC}
            message={t(translations.liquidityMining.recalibration, {
              date: 'July 26',
            })}
            linkUrl="https://www.sovryn.app/blog/prepare-yourself-for-the-awakening"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Purple}
          />
          <LootDrop
            title="15K SOV"
            asset1={Asset.ETH}
            asset2={Asset.RBTC}
            message={t(translations.liquidityMining.recalibration, {
              date: 'July 26',
            })}
            linkUrl="https://www.sovryn.app/blog/over-1000-yield-for-eth-btc-lp-s"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Green}
          />
          {/* <LootDrop
            title="$37500 worth of MoC"
            asset1={Asset.DOC}
            asset2={Asset.RBTC}
            startDate="02/06/21"
            endDate="01/07/21"
            linkUrl="https://forum.sovryn.app/t/draft-sip-17-money-on-chain-s-moc-listing-and-incentivization-strategy/714"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Pink}
          /> */}
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

        {(addLiqLocked || removeLiqLocked) && (
          <div className="text-red tw-font-xl tw-text-center">
            <Trans
              i18nKey={translations.maintenance.liquidity}
              components={[
                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tw-text-Red tw-underline hover:tw-no-underline"
                >
                  x
                </a>,
              ]}
            />
          </div>
        )}
        <div
          className={cn(
            'tw-max-w-screen-2xl tw-mx-auto tw-mt-5 tw-mb-32',
            hasOldPools && 'tw-opacity-25 tw-pointer-events-none',
          )}
        >
          {pools.map(item => (
            <MiningPool
              key={item.poolAsset}
              pool={item}
              ammData={
                ammData &&
                ammData[item?.assetDetails?.ammContract?.address?.toLowerCase()]
              }
            />
          ))}
        </div>

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
