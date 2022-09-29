import React, { useCallback, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TradingVolume } from './components/TradingVolume';
// import { ArbitrageOpportunity } from './components/ArbitrageOpportunity';
//import { Banner } from './components/Banner';
// import { BabelSoldOutBanner } from './components/Banner/BabelSoldOutBanner';
import { GetStartedBanner } from './components/Banner/GetStartedBanner';
import { TotalValueLocked } from './components/TotalValueLocked';
import { Promotions } from '../../components/Promotions';
import { AmmBalance } from './components/AmmBalance';
import { currentChainId, graphWrapperUrl } from 'utils/classifiers';
import { TvlData } from 'app/containers/StatsPage/types';
import axios, { Canceler } from 'axios';
import { useInterval } from 'app/hooks/useInterval';
import { LendingStats } from 'app/containers/StatsPage/components/LendingStats';
import { CryptocurrencyPrices } from './components/CryptocurrencyPrices';
import { IAssets } from './components/CryptocurrencyPrices/types';
import styles from './index.module.scss';
import { IPairsData } from 'types/trading-pairs';

interface ILandingPageProps {
  refreshInterval?: number;
}

export const LandingPage: React.FC<ILandingPageProps> = ({
  refreshInterval = 600000,
}) => {
  const { t } = useTranslation();

  const [tvlLoading, setTvlLoading] = useState(false);
  const [tvlData, setTvlData] = useState<TvlData>();
  const [pairsLoading, setPairsLoading] = useState(false);
  const [pairsData, setPairsData] = useState<IPairsData>();
  const [assetLoading, setAssetLoading] = useState(false);
  const [assetData, setAssetData] = useState<IAssets>();

  const cancelDataRequest = useRef<Canceler>();
  const cancelPairsDataRequest = useRef<Canceler>();
  const cancelAssetDataRequest = useRef<Canceler>();

  const getTvlData = useCallback(() => {
    setTvlLoading(true);
    cancelDataRequest.current && cancelDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(graphWrapperUrl[currentChainId] + '/cmc/tvl', {
        cancelToken,
      })
      .then(res => {
        setTvlData(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setTvlLoading(false);
      });
  }, []);

  const getPairsData = useCallback(() => {
    setPairsLoading(true);
    cancelPairsDataRequest.current && cancelPairsDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(graphWrapperUrl[currentChainId] + 'cmc/summary?extra=true', {
        cancelToken,
      })
      .then(res => {
        setPairsData(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setPairsLoading(false);
      });
  }, []);

  const getAssetData = useCallback(() => {
    setAssetLoading(true);
    cancelAssetDataRequest.current && cancelAssetDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(graphWrapperUrl[currentChainId] + 'cmc/asset', {
        cancelToken,
      })
      .then(res => {
        setAssetData(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => {
        setAssetLoading(false);
      });
  }, []);

  useInterval(
    () => {
      getTvlData();
      getPairsData();
      getAssetData();
    },
    refreshInterval,
    { immediate: true },
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.landingPage.meta.title)}</title>
        <meta
          name="description"
          content={t(translations.landingPage.meta.description)}
        />
      </Helmet>
      <div className="container tw-max-w-screen-2xl tw-mx-auto tw-mt-16 tw-px-4 2xl:tw-px-0 tw-w-full">
        <div className="tw-tracking-normal">
          <div className={styles.welcomeTitle}>
            {t(translations.landingPage.welcomeTitle)}
          </div>
        </div>
        <div className="tw-flex tw-flex-col xl:tw-flex-row">
          <div className="tw-w-full xl:tw-w-7/12 tw-mb-5 xl:tw-mb-0">
            <div className="tw-text-base tw-capitalize tw-mt-4 tw-mb-10">
              {t(translations.landingPage.welcomeMessage)}
            </div>
            <TradingVolume
              tvlValueBtc={tvlData?.total_btc}
              tvlValueUsd={tvlData?.total_usd}
              tvlLoading={tvlLoading}
              volumeBtc={pairsData?.total_volume_btc}
              volumeUsd={pairsData?.total_volume_usd}
              volumeLoading={pairsLoading}
            />
          </div>

          <div className="tw-w-8/12 xl:tw-mx-0 xl:tw-w-5/12 tw-mx-auto tw-mt-auto">
            {/*
              Should un comment this and remove Banner once the sale is over.
              <ArbitrageOpportunity />
            */}
            {/* <Banner
              title={t(translations.landingPage.banner.originsFish)}
              //remember month starts from 0
              date={Date.UTC(2021, 7, 26, 14, 0)}
              image={babelfishBanner}
              learnLink="https://www.sovryn.app/blog/babelfish-sale-on-origins-1400-utc-26-08-2021"
              buyLink="/origins"
            /> */}
            {/* <BabelSoldOutBanner /> */}
            <GetStartedBanner />
          </div>
        </div>

        <Promotions
          className="tw-mt-14"
          cardClassName="tw-my-7"
          cardImageClassName="tw-mb-3"
        />
        <div className="tw-max-w-screen-xl tw-mx-auto">
          <div className="tw-w-full tw-overflow-auto">
            {pairsData && pairsData.pairs && (
              <CryptocurrencyPrices
                pairs={pairsData.pairs}
                isLoading={pairsLoading}
                assetData={assetData}
                assetLoading={assetLoading}
              />
            )}
          </div>

          <div className="tw-font-semibold tw-mb-8 tw-mt-24">
            {t(translations.landingPage.lendBorrow)}
          </div>

          <div className="tw-w-full tw-overflow-auto">
            <LendingStats />
          </div>

          <AmmBalance />

          <div className="tw-w-full tw-overflow-auto">
            <TotalValueLocked loading={tvlLoading} data={tvlData} />
          </div>
        </div>
      </div>
    </>
  );
};
