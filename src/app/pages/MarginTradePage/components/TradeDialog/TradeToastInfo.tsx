import React from 'react';
import { Asset } from 'types';
import { TradingPosition } from 'types/trading-position';
import { PricePrediction } from 'app/containers/MarginTradeForm/PricePrediction';
import { TradingTypes } from 'app/pages/SpotTradingPage/types';
import { OrderType } from 'app/components/OrderTypeTitle/types';

interface ITradeToastInfoProps {
  position: TradingPosition;
  leverage: number;
  orderTypeValue: OrderType;
  amount: string;
  collateral: Asset;
  loanToken: Asset;
  collateralToken: Asset;
  useLoanTokens: boolean;
}

export const TradeToastInfo: React.FC<ITradeToastInfoProps> = ({
  position,
  leverage,
  orderTypeValue,
  amount,
  loanToken,
  collateralToken,
  useLoanTokens,
}) => {
  return (
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
      </div>
    </div>
  );
};
