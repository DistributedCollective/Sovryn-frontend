import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Asset } from 'types';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { TradingPosition } from 'types/trading-position';
import { PricePrediction } from 'app/containers/MarginTradeForm/PricePrediction';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { OrderType } from 'app/components/OrderTypeTitle/types';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { useSelector } from 'react-redux';
import { selectMarginTradePage } from '../../selectors';

interface ITradeDialogInfoProps {
  position: TradingPosition;
  leverage: number;
  orderTypeValue: OrderType;
  amount: string;
  collateral: Asset;
  loanToken: Asset;
  collateralToken: Asset;
  useLoanTokens: boolean;
  minEntryPrice?: string;
}

export const TradeDialogInfo: React.FC<ITradeDialogInfoProps> = ({
  position,
  leverage,
  orderTypeValue,
  amount,
  collateral,
  loanToken,
  collateralToken,
  useLoanTokens,
  minEntryPrice,
}) => {
  const { t } = useTranslation();
  const { pairType } = useSelector(selectMarginTradePage);
  const pair = useMemo(() => TradingPairDictionary.get(pairType), [pairType]);

  return (
    <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
      <div
        className={classNames(
          'tw-text-center tw-font-medium tw-lowercase tw-text-xl',
          {
            'tw-text-trade-short': position === TradingPosition.SHORT,
            'tw-text-trade-long': position === TradingPosition.LONG,
          },
        )}
      >
        {toNumberFormat(leverage) + 'x'} {orderTypeValue}{' '}
        {position === TradingPosition.LONG
          ? t(translations.marginTradePage.tradeDialog.buy)
          : t(translations.marginTradePage.tradeDialog.sell)}
      </div>
      <div className="tw-text-center tw-my-1">
        <AssetRenderer asset={pair.collaterals[0]} />/
        <AssetRenderer asset={pair.collaterals[1]} />
      </div>
      <div className="tw-flex tw-justify-center tw-items-center">
        {<div className="tw-mr-1">{weiToNumberFormat(amount, 4)}</div>}{' '}
        <AssetRenderer asset={collateral} />
        <div className="tw-px-1">
          @ {position === TradingPosition.LONG ? '≤' : '≥'}
        </div>
        {!minEntryPrice ? (
          <>
            <PricePrediction
              position={position}
              leverage={leverage}
              loanToken={loanToken}
              collateralToken={collateralToken}
              useLoanTokens={useLoanTokens}
              weiAmount={amount}
              asset={pair.longAsset}
            />
            <AssetRenderer className="tw-ml-1.5" asset={pair.longAsset} />
          </>
        ) : (
          <>
            {minEntryPrice}{' '}
            <AssetRenderer className="tw-ml-1.5" asset={pair.longAsset} />
          </>
        )}
      </div>
    </div>
  );
};
