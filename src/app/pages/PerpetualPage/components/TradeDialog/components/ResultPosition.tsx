import React from 'react';
import { AssetValue } from '../../../../../components/AssetValue';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import classNames from 'classnames';
import styles from '../index.module.scss';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';
import { toNumberFormat } from '../../../../../../utils/display-text/format';
import { PerpetualPair } from '../../../../../../utils/models/perpetual-pair';
import { PerpetualPageModals } from '../../../types';

type ResultPositionProps = {
  origin?: PerpetualPageModals;
  pair: PerpetualPair;
  amountTarget: number;
  amountChange: number;
  marginTarget: number;
  leverageTarget: number;
  entryPrice: number;
  liquidationPrice: number;
  lotSize: number;
  lotPrecision: number;
};

export const ResultPosition: React.FC<ResultPositionProps> = ({
  origin,
  pair,
  amountTarget,
  amountChange,
  marginTarget,
  leverageTarget,
  entryPrice,
  liquidationPrice,
  lotSize,
  lotPrecision,
}) => {
  const { t } = useTranslation();

  if (
    origin === PerpetualPageModals.CLOSE_POSITION &&
    Math.abs(marginTarget) < lotSize
  ) {
    return (
      <div className="tw-text-sm tw-mt-6 tw-mb-2 tw-text-center tw-text-sov-white tw-font-medium">
        {t(translations.perpetualPage.reviewTrade.positionFullyClosed)}
      </div>
    );
  }

  return (
    <>
      <div className="tw-text-sm tw-mt-6 tw-mb-2 tw-text-center tw-text-sov-white tw-font-medium">
        {t(translations.perpetualPage.reviewTrade.positionDetailsTitle)}
      </div>

      <div className="tw-w-full tw-py-4 tw-px-6 tw-bg-gray-5 tw-flex tw-flex-col tw-items-center tw-rounded-xl">
        <div className={styles.positionInfoRow}>
          <span className="tw-text-gray-10">
            {t(translations.perpetualPage.reviewTrade.labels.positionSize)}
          </span>
          <span
            className={
              amountTarget > 0
                ? styles.positionSizeBuy
                : styles.positionSizeSell
            }
          >
            <AssetValue
              minDecimals={lotPrecision}
              maxDecimals={lotPrecision}
              mode={AssetValueMode.auto}
              value={amountTarget}
              assetString={pair.baseAsset}
              showPositiveSign
            />
          </span>
        </div>

        <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
          <span className="tw-text-gray-10">
            {t(translations.perpetualPage.reviewTrade.labels.margin)}
          </span>
          <span className="tw-font-medium">
            <AssetValue
              minDecimals={4}
              maxDecimals={4}
              mode={AssetValueMode.auto}
              value={marginTarget}
              assetString={pair.baseAsset}
            />
          </span>
        </div>

        <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
          <span className="tw-text-gray-10">
            {t(translations.perpetualPage.reviewTrade.labels.leverage)}
          </span>
          <span className="tw-font-medium">
            {toNumberFormat(leverageTarget, 2)}x
          </span>
        </div>
        {origin !== PerpetualPageModals.EDIT_LEVERAGE &&
          origin !== PerpetualPageModals.EDIT_MARGIN && (
            <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
              <span className="tw-text-gray-10">
                {t(translations.perpetualPage.reviewTrade.labels.entryPrice)}
              </span>
              <span className="tw-font-medium">
                {amountChange > 0 ? '≥ ' : '≤ '}
                <AssetValue
                  minDecimals={2}
                  maxDecimals={2}
                  mode={AssetValueMode.auto}
                  value={entryPrice}
                  assetString={pair.quoteAsset}
                />
              </span>
            </div>
          )}

        <div className={classNames(styles.positionInfoRow, 'tw-mt-2')}>
          <span className="tw-text-gray-10 tw-font-semibold">
            {t(translations.perpetualPage.reviewTrade.labels.liquidationPrice)}
          </span>
          <span className="tw-font-semibold">
            <AssetValue
              minDecimals={2}
              maxDecimals={2}
              mode={AssetValueMode.auto}
              value={liquidationPrice}
              assetString={pair.quoteAsset}
            />
          </span>
        </div>
      </div>
    </>
  );
};
