import cn from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';

import { LootDropColors } from 'app/components/FinanceV2Components/LootDrop/styled';
import { Footer } from 'app/components/Footer';
import { Header } from 'app/components/Header';
import { LocalSharedArrayBuffer } from 'app/components/LocalSharedArrayBuffer';
import { useFetch } from 'app/hooks/useFetch';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { translations } from 'locales/i18n';
import { Asset } from 'types';
import { discordInvite } from 'utils/classifiers';
import { backendUrl, currentChainId } from 'utils/classifiers';

import { LiquidityPoolDictionary } from '../../../utils/dictionaries/liquidity-pool-dictionary';
import { LootDrop } from '../../components/FinanceV2Components/LootDrop';
import { LootDropSectionWrapper } from '../../components/FinanceV2Components/LootDrop/LootDropSectionWrapper';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { useAccount } from '../../hooks/useAccount';
import { AmmPoolsBanner } from './components/AmmPoolsBanner';
import { HistoryTable } from './components/HistoryTable';
import { MiningPool } from './components/MiningPool';
import { getNextMonday } from '../../../utils/dateHelpers';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../LandingPage/components/Promotions/components/PromotionCard/types';

const pools = LiquidityPoolDictionary.list();

const date = getNextMonday();

export function LiquidityMining() {
  const { t } = useTranslation();
  const location = useLocation<IPromotionLinkState>();
  const history = useHistory<IPromotionLinkState>();
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.ADD_LIQUIDITY]: addLiqLocked,
    [States.REMOVE_LIQUIDITY]: removeLiqLocked,
  } = checkMaintenances();
  const account = useAccount();
  const [hasOldPools, setHasOldPools] = useState(true);
  const [linkAsset] = useState(location.state?.asset);

  const onOldPoolsNotPresent = useCallback(() => setHasOldPools(false), [
    setHasOldPools,
  ]);

  const { value: ammData } = useFetch(
    `${backendUrl[currentChainId]}/amm/apy/all`,
  );

  useEffect(() => linkAsset && history.replace(location.pathname), [
    history,
    linkAsset,
    location.pathname,
    location.state,
  ]);

  return (
    <>
      <LocalSharedArrayBuffer />
      <Helmet>
        <title>{t(translations.liquidityMining.meta.title)}</title>
      </Helmet>
      <Header />
      <div className="tw-container tw-mt-12 tw-font-body">
        <LootDropSectionWrapper>
          <LootDrop
            title="15k SOV"
            asset1={Asset.BNB}
            asset2={Asset.RBTC}
            message={t(translations.liquidityMining.recalibration, {
              date,
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
              date,
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
              date,
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
              date,
            })}
            linkUrl="https://www.sovryn.app/blog/over-1000-yield-for-eth-btc-lp-s"
            linkText={t(translations.liquidityMining.lootDropLink)}
            highlightColor={LootDropColors.Green}
          />
        </LootDropSectionWrapper>

        <AmmPoolsBanner onDataNotPresent={onOldPoolsNotPresent} />

        {(addLiqLocked || removeLiqLocked) && (
          <div className="tw-text-warning tw-text-xl tw-text-center">
            <Trans
              i18nKey={translations.maintenance.liquidity}
              components={[
                <a
                  href={discordInvite}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tw-text-warning tw-underline hover:tw-no-underline"
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
              linkAsset={location.state?.asset}
            />
          ))}
        </div>

        <div className="tw-mt-10">
          <div className="tw-px-3 tw-text-lg">
            {t(translations.liquidityMining.historyTable.title)}
          </div>
          {!account ? (
            <SkeletonRow
              loadingText={t(translations.topUpHistory.walletHistory)}
              className="tw-mt-2"
            />
          ) : (
            <HistoryTable />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
