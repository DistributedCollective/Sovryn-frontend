import React from 'react';
import classNames from 'classnames';
import { TradingPosition } from 'types/trading-position';

interface Props {
  position: TradingPosition;
  text: React.ReactNode;
  onClick: (position: TradingPosition) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  position,
  onClick,
  loading,
  className,
  text,
  ...props
}: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(position)}
      className={classNames(
        'tw-btn-trade',
        { 'tw-bg-trade-long': position === TradingPosition.LONG },
        { 'tw-bg-trade-short': position === TradingPosition.SHORT },
        { loading: loading },
        className,
      )}
      {...props}
    >
      {text}
    </button>
  );
}
