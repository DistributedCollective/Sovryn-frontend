import React, { useMemo } from 'react';
import { AssetValue } from '../../../../../components/AssetValue';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import classNames from 'classnames';
import styles from '../index.module.scss';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../../../locales/i18n';
import {
  toNumberFormat,
  numberToPercent,
} from '../../../../../../utils/display-text/format';
import { PerpetualPair } from '../../../../../../utils/models/perpetual-pair';
import {
  PerpetualPageModals,
  PerpetualTrade,
  PerpetualTradeType,
} from '../../../types';

type TradeSummaryProps = {
  origin?: PerpetualPageModals;
  trade?: PerpetualTrade;
  pair: PerpetualPair;
  amountTarget: number;
  amountChange: number;
  marginTarget: number;
  marginChange: number;
  roe: number;
  leverageTarget: number;
  entryPrice: number;
  liquidationPrice: number;
  tradingFee: number;
};

export const TradeSummary: React.FC<TradeSummaryProps> = ({
  origin = PerpetualPageModals.NONE,
  trade,
  pair,
  amountTarget,
  amountChange,
  marginTarget,
  marginChange,
  roe,
  leverageTarget,
  entryPrice,
  liquidationPrice,
  tradingFee,
}) => {
  const { t } = useTranslation();

  let {
    title,
    showMarginText,
    showAmountText,
    showCloseText,
    isBuy,
  } = useMemo(() => {
    switch (origin) {
      case PerpetualPageModals.CLOSE_POSITION:
        return {
          title: `${
            trade?.tradeType === PerpetualTradeType.MARKET
              ? t(translations.perpetualPage.reviewTrade.market)
              : t(translations.perpetualPage.reviewTrade.limit)
          } ${t(translations.perpetualPage.reviewTrade.close)}`,
          showAmountText: true,
          showCloseText: true,
          isBuy: false,
        };
      case PerpetualPageModals.EDIT_LEVERAGE:
        return {
          title: `${t(
            translations.perpetualPage.reviewTrade.leverage,
          )} ${toNumberFormat(leverageTarget, 2)}x`,
          showMarginText: true,
          isBuy: marginChange > 0,
        };
      case PerpetualPageModals.EDIT_MARGIN:
        return {
          title: `${
            marginChange > 0
              ? t(translations.perpetualPage.reviewTrade.deposit)
              : t(translations.perpetualPage.reviewTrade.withdraw)
          } ${t(translations.perpetualPage.reviewTrade.margin)}`,
          showMarginText: true,
          isBuy: marginChange > 0,
        };
      case PerpetualPageModals.EDIT_POSITION_SIZE:
        return {
          title: `${
            trade?.tradeType === PerpetualTradeType.MARKET
              ? t(translations.perpetualPage.reviewTrade.market)
              : t(translations.perpetualPage.reviewTrade.limit)
          } ${
            amountChange > 0
              ? t(translations.perpetualPage.reviewTrade.buy)
              : t(translations.perpetualPage.reviewTrade.sell)
          }`,
          showAmountText: true,
          isBuy: amountChange > 0,
        };
      default:
        return {
          title: `${toNumberFormat(leverageTarget, 2)}x ${
            trade?.tradeType === PerpetualTradeType.MARKET
              ? t(translations.perpetualPage.reviewTrade.market)
              : t(translations.perpetualPage.reviewTrade.limit)
          } ${
            amountChange > 0
              ? t(translations.perpetualPage.reviewTrade.buy)
              : t(translations.perpetualPage.reviewTrade.sell)
          }`,
          showAmountText: true,
          isBuy: amountChange > 0,
        };
    }
  }, [t, origin, marginChange, amountChange, leverageTarget, trade?.tradeType]);

  return (
    <>
      <div className="tw-w-full tw-p-4 tw-bg-gray-2 tw-flex tw-flex-col tw-items-center tw-rounded-xl">
        <div
          className={classNames(
            'tw-text-xl tw-font-semibold tw-tracking-normal',
            isBuy ? styles.orderActionBuy : styles.orderActionSell,
          )}
        >
          {title}
        </div>
        {showMarginText && (
          <div className="tw-text-base tw-tracking-normal tw-mt-2 tw-leading-none tw-text-sov-white tw-font-medium">
            {marginChange > 0
              ? t(translations.perpetualPage.reviewTrade.deposit)
              : t(translations.perpetualPage.reviewTrade.withdraw)}{' '}
            {toNumberFormat(Math.abs(marginChange), 4)} {pair.baseAsset}
          </div>
        )}
        {showAmountText && (
          <div className="tw-text-sm tw-tracking-normal tw-mt-2 tw-leading-none tw-text-sov-white tw-font-medium">
            {toNumberFormat(Math.abs(amountChange), 3)} {pair.baseAsset} @{' '}
            {isBuy ? '≥' : '≤'} {toNumberFormat(entryPrice, 2)}{' '}
            {pair.quoteAsset}
          </div>
        )}
        {showCloseText && (
          <div className="tw-flex tw-justify-center tw-w-full tw-mt-2 tw-text-sm">
            <span className="tw-text-gray-10 tw-mr-2">
              {t(translations.perpetualPage.reviewTrade.labels.totalToReceive)}
            </span>
            <span className="tw-flex tw-flex-col tw-text-sov-white tw-font-medium">
              <AssetValue
                className={
                  marginChange > 0
                    ? 'tw-text-trade-short'
                    : 'tw-text-trade-long'
                }
                minDecimals={4}
                maxDecimals={4}
                mode={AssetValueMode.auto}
                value={-marginChange}
                assetString={pair.baseAsset}
                showPositiveSign
              />
              <span
                className={
                  roe > 0 ? 'tw-text-trade-long' : 'tw-text-trade-short'
                }
              >
                {roe >= 0 ? '+' : ''}
                {numberToPercent(roe, 2)}
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="tw-w-full tw-p-4 tw-bg-gray-2 tw-flex tw-flex-col tw-items-center tw-rounded-xl tw-mt-4">
        <div className={styles.tradingFeeWrapper}>
          <span className="tw-text-gray-10">
            {t(translations.perpetualPage.tradeForm.labels.tradingFee)}
          </span>
          <span className="tw-text-sov-white tw-font-medium">
            <AssetValue
              minDecimals={0}
              maxDecimals={6}
              mode={AssetValueMode.auto}
              value={String(tradingFee)}
              assetString={pair.baseAsset}
            />
          </span>
        </div>
      </div>
    </>
  );
};
