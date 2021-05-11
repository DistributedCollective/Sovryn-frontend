import React from 'react';
import cn from 'classnames';
import { TradingTypes } from '../../types';

interface Props {
  tradingType: TradingTypes;
  text: React.ReactNode;
  onClick: (type: TradingTypes) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  tradingType,
  onClick,
  loading,
  text,
  ...props
}: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(tradingType)}
      className={cn(
        'tw-btn-trade',
        { 'tw-btn-trade--short': tradingType === TradingTypes.SELL },
        { 'tw-btn-trade--long': tradingType === TradingTypes.BUY },
        { loading: loading },
      )}
      {...props}
    >
      {text}
    </button>
  );
}
