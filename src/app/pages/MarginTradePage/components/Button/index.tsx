import React from 'react';
import cn from 'classnames';
import { TradingPosition } from 'types/trading-position';

interface Props {
  position: TradingPosition;
  text: React.ReactNode;
  onClick: (position: TradingPosition) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ position, onClick, loading, text, ...props }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(position)}
      className={cn(
        'tw-btn-trade',
        { 'tw-bg-trade-long': position === TradingPosition.LONG },
        { 'tw-bg-trade-short': position === TradingPosition.SHORT },
        { loading: loading },
      )}
      {...props}
    >
      {text}
    </button>
  );
}
