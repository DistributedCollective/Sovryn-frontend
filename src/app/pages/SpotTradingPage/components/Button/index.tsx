import React from 'react';
import classNames from 'classnames';
import { TradingTypes } from '../../types';

interface Props {
  tradingType: TradingTypes;
  text: React.ReactNode;
  onClick: (type: TradingTypes) => void;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  className?: string;
}

export function Button({
  tradingType,
  onClick,
  loading,
  small,
  text,
  disabled,
  className,
  ...props
}: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick(tradingType)}
      className={classNames(
        'tw-text-sov-white tw-text-xl tw-font-bold tw-leading-none tw-font-body tw-rounded-lg tw-px-6 tw-transition tw-w-full',
        className,
        {
          'tw-bg-trade-short': tradingType === TradingTypes.SELL,
          'tw-bg-trade-long': tradingType === TradingTypes.BUY,
          'tw-py-2': small,
          'tw-py-4': !small,
          'tw-opacity-25': disabled,
          'hover:tw-opacity-75': !disabled,
        },
        { loading: loading },
      )}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
}
