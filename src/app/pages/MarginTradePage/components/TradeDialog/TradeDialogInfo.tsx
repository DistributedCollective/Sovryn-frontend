import React from 'react';
import cn from 'classnames';
import { Asset } from 'types';
import { fromWei } from 'utils/blockchain/math-helpers';
import { toNumberFormat, weiToNumberFormat } from 'utils/display-text/format';
import { LoadableValue } from 'app/components/LoadableValue';
import { TradingPosition } from 'types/trading-position';
import { PricePrediction } from 'app/containers/MarginTradeForm/PricePrediction';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { TradingTypes } from 'app/pages/SpotTradingPage/types';
import { OrderTypes } from 'app/components/OrderType/types';
import { TradingPair } from 'utils/models/trading-pair';

interface ITradeDialogInfo {
  position: TradingPosition;
  leverage: number;
  orderTypeValue: OrderTypes;
  pair: TradingPair;
  amount: string;
  collateral: Asset;
  loanToken: Asset;
  collateralToken: Asset;
  useLoanTokens: boolean;
  isToast?: boolean;
}

export const TradeDialogInfo: React.FC<ITradeDialogInfo> = ({
  position,
  leverage,
  orderTypeValue,
  pair,
  amount,
  collateral,
  loanToken,
  collateralToken,
  useLoanTokens,
  isToast,
}) => {
  return (
    <>
      {isToast ? (
        <div className="tw-text-xs tw-font-light">
          <div className="tw-flex tw-items-center">
            <div className="tw-lowercase tw-pr-1">
              {orderTypeValue}{' '}
              {position === TradingPosition.LONG
                ? TradingTypes.BUY
                : TradingTypes.SELL}
            </div>
            <PricePrediction
              position={position}
              leverage={leverage}
              loanToken={loanToken}
              collateralToken={collateralToken}
              useLoanTokens={useLoanTokens}
              weiAmount={amount}
            />
            <div className="tw-pl-1">
              <AssetRenderer asset={collateral} />
            </div>
          </div>
        </div>
      ) : (
        <div className="tw-pt-3 tw-pb-2 tw-px-6 tw-bg-gray-2 tw-mb-4 tw-rounded-lg tw-text-sm tw-font-light">
          <div
            className={cn(
              'tw-text-center tw-font-medium tw-lowercase tw-text-xl',
              {
                'tw-text-trade-short': position === TradingPosition.SHORT,
                'tw-text-trade-long': position === TradingPosition.LONG,
              },
            )}
          >
            {toNumberFormat(leverage) + 'x'} {orderTypeValue}{' '}
            {position === TradingPosition.LONG
              ? TradingTypes.BUY
              : TradingTypes.SELL}
          </div>
          <div className="tw-text-center tw-my-1">{pair.chartSymbol}</div>
          <div className="tw-flex tw-justify-center tw-items-center">
            <LoadableValue
              loading={false}
              value={
                <div className="tw-mr-1">{weiToNumberFormat(amount, 4)}</div>
              }
              tooltip={fromWei(amount)}
            />{' '}
            <AssetRenderer asset={collateral} />
            <div className="tw-px-1">&#64; &ge;</div>
            <PricePrediction
              position={position}
              leverage={leverage}
              loanToken={loanToken}
              collateralToken={collateralToken}
              useLoanTokens={useLoanTokens}
              weiAmount={amount}
            />
          </div>
        </div>
      )}
    </>
  );
};
