import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { LocalSharedArrayBuffer } from 'app/components/LocalSharedArrayBuffer';
import { useFetch } from 'app/hooks/useFetch';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { translations } from 'locales/i18n';
import { ammServiceUrl, discordInvite } from 'utils/classifiers';
import { currentChainId } from 'utils/classifiers';
import { LiquidityPoolDictionary } from '../../../utils/dictionaries/liquidity-pool-dictionary';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { useAccount } from '../../hooks/useAccount';
import { AmmPoolsBanner } from './components/AmmPoolsBanner';
import { HistoryTable } from './components/HistoryTable';
import { MiningPool } from './components/MiningPool';
import { useHistory, useLocation } from 'react-router-dom';
import { IPromotionLinkState } from '../../components/Promotions/components/PromotionCard/types';

const pools = LiquidityPoolDictionary.list();

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

  const { value: ammData, loading } = useFetch(
    `${ammServiceUrl[currentChainId]}/amm`,
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
      <div className="tw-max-w-screen-2xl tw-mx-auto tw-container 2xl:tw-px-0 tw-w-full tw-pt-11">
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
          className={classNames(
            'tw-max-w-screen-2xl tw-mx-auto tw-mb-32',
            hasOldPools && 'tw-opacity-25 tw-pointer-events-none',
          )}
        >
          {pools.map(item => (
            <MiningPool
              key={`${item.assetA}/${item.assetB}`}
              pool={item}
              ammData={ammData && ammData[item?.converter.toLowerCase()]}
              ammDataLoading={loading}
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
    </>
  );
}
