import React, { useCallback, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from 'app/components/Header';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TradingVolume } from './components/TradingVolume';
// import { ArbitrageOpportunity } from './components/ArbitrageOpportunity';
//import { Banner } from './components/Banner';
// import { BabelSoldOutBanner } from './components/Banner/BabelSoldOutBanner';
import { GetStartedBanner } from './components/Banner/GetStartedBanner';
import { TotalValueLocked } from './components/TotalValueLocked';
import { Promotions } from './components/Promotions';
import { AmmBalance } from './components/AmmBalance';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { TvlData } from 'app/containers/StatsPage/types';
import axios, { Canceler } from 'axios';
import { useInterval } from 'app/hooks/useInterval';
import { WelcomeTitle } from './styled';
import { LendingStats } from 'app/containers/StatsPage/components/LendingStats';
import { Footer } from 'app/components/Footer';
import { CryptocurrencyPrices } from './components/CryptocurrencyPrices';
import { IAssets } from './components/CryptocurrencyPrices/types';
import { IPairsData } from 'types/trading-pairs';

const url = backendUrl[currentChainId];

interface ILandingPageProps {
  refreshInterval?: number;
}

export const LandingPage: React.FC<ILandingPageProps> = ({
  refreshInterval = 300000,
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
      .get(url + '/tvl', {
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
      .get(url + '/api/v1/trading-pairs/summary', {
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
      .get(url + '/api/v1/trading-pairs/assets', {
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
      <Header />
      <div className="container tw-max-w-screen-2xl tw-mx-auto tw-mt-16 tw-px-4 2xl:tw-px-0 tw-w-full">
        <div className="tw-tracking-normal">
          <WelcomeTitle>
            {t(translations.landingPage.welcomeTitle)}
          </WelcomeTitle>
        </div>
        <div className="tw-flex tw-flex-col md:tw-flex-row">
          <div className="tw-w-full md:tw-w-7/12 tw-mb-5 md:tw-mb-0">
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

          <div className="tw-w-full md:tw-w-5/12">
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

        <Promotions />
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
      <Footer />
    </>
  );
};
