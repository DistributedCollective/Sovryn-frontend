import React from 'react';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useTranslation } from 'react-i18next';
import { Title, VolumeValue } from './styled';
import { translations } from 'locales/i18n';

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
    <div className="tw-rounded-20px tw-bg-black tw-mr-2 lg:tw-mr-6 xl:tw-mr-12 tw-flex tw-py-5">
      <div className="tw-px-14 tw-py-2 tw-text-center tw-w-1/2 tw-border-r tw-border-white tw-flex tw-items-center tw-justify-center tw-flex-col">
        <Title>{t(translations.landingPage.tradingVolume.tvlTitle)}</Title>

        <div>
          {tvlLoading ? (
            <SkeletonRow />
          ) : (
            <VolumeValue>
              {tvlValueBtc?.toFixed(4)}{' '}
              {t(translations.landingPage.tradingVolume.btc)}
            </VolumeValue>
          )}

          {tvlLoading ? null : (
            <>
              ≈{' '}
              <span className="tw-tracking-normal">
                {tvlValueUsd?.toLocaleString('en', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {t(translations.landingPage.tradingVolume.usd)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="tw-px-14 tw-py-2 tw-text-center tw-w-1/2 tw-flex tw-items-center tw-justify-center tw-flex-col">
        <Title>
          {t(translations.landingPage.tradingVolume.dayVolumeTitle)}
        </Title>

        <div>
          {volumeLoading ? (
            <SkeletonRow />
          ) : (
            <VolumeValue>
              {volumeBtc?.toFixed(4)}{' '}
              {t(translations.landingPage.tradingVolume.btc)}
            </VolumeValue>
          )}

          {volumeLoading ? null : (
            <>
              ≈{' '}
              <span className="tw-tracking-normal">
                {volumeUsd?.toLocaleString('en', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {t(translations.landingPage.tradingVolume.usd)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
