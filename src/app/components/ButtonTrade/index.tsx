import React from 'react';
import classNames from 'classnames';
import { TradingPosition } from 'types/trading-position';
import { TradingTypes } from 'app/pages/SpotTradingPage/types';

interface IButtonTradeProps {
  position?: TradingPosition;
  tradingType?: TradingTypes;
  text: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function ButtonTrade({
  tradingType,
  position,
  onClick,
  loading,
  className,
  text,
  ...props
}: IButtonTradeProps) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={classNames(
        'tw-btn-trade',
        {
          'tw-bg-trade-long':
            position === TradingPosition.LONG ||
            tradingType === TradingTypes.BUY,
        },
        {
          'tw-bg-trade-short':
            position === TradingPosition.SHORT ||
            tradingType === TradingTypes.SELL,
        },
        { loading: loading },
        className,
      )}
      {...props}
    >
      {text}
    </button>
  );
}
