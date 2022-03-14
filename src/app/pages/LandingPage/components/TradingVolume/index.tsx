import React from 'react';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toNumberFormat } from 'utils/display-text/format';
import styles from './index.module.scss';

interface ITradingVolumeProps {
  tvlLoading: boolean;
  tvlValueBtc?: number;
  tvlValueUsd?: number;
  volumeLoading: boolean;
  volumeBtc?: number;
  volumeUsd?: number;
}

export const TradingVolume: React.FC<ITradingVolumeProps> = ({
  tvlLoading,
  tvlValueBtc,
  tvlValueUsd,
  volumeLoading,
  volumeBtc,
  volumeUsd,
}) => {
  const { t } = useTranslation();

  return (
    <div className="tw-rounded-3xl tw-bg-black tw-mr-0 md:tw-mr-2 lg:tw-mr-6 xl:tw-mr-12 tw-flex tw-py-5">
      <div className="tw-px-14 tw-py-2 tw-text-center tw-w-1/2 tw-border-r tw-border-sov-white tw-flex tw-items-center tw-justify-center tw-flex-col">
        <div className={styles.title}>
          {t(translations.landingPage.tradingVolume.tvlTitle)}
        </div>

        <div>
          {tvlLoading ? (
            <SkeletonRow />
          ) : (
            <div className={styles.volumeValue}>
              {toNumberFormat(tvlValueBtc || 0, 4)}{' '}
              {t(translations.landingPage.tradingVolume.btc)}
            </div>
          )}

          {tvlLoading ? null : (
            <>
              ≈{' '}
              <span className="tw-tracking-normal">
                {toNumberFormat(tvlValueUsd || 0, 2)}{' '}
                {t(translations.landingPage.tradingVolume.usd)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="tw-px-14 tw-py-2 tw-text-center tw-w-1/2 tw-flex tw-items-center tw-justify-center tw-flex-col">
        <div className={styles.title}>
          {t(translations.landingPage.tradingVolume.dayVolumeTitle)}
        </div>

        <div>
          {volumeLoading ? (
            <SkeletonRow />
          ) : (
            <div className={styles.volumeValue}>
              {toNumberFormat(volumeBtc || 0, 4)}{' '}
              {t(translations.landingPage.tradingVolume.btc)}
            </div>
          )}

          {volumeLoading ? null : (
            <>
              ≈{' '}
              <span className="tw-tracking-normal">
                {toNumberFormat(volumeUsd || 0, 2)}{' '}
                {t(translations.landingPage.tradingVolume.usd)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
