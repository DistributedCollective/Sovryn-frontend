import React from 'react';
import classNames from 'classnames';
import { Button, ButtonProps } from '../Button';
import { TradingPosition } from '../../../../types/trading-position';

interface Props extends ButtonProps {
  position: TradingPosition;
}

export function TradeButton({ className, position, ...props }: Props) {
  return (
    <Button
      className={classNames(
        'tw-btn tw-btn-trade',
        className,
        { 'tw-bg-trade-long': position === TradingPosition.LONG },
        { 'tw-bg-trade-short': position === TradingPosition.SHORT },
      )}
      {...props}
    />
  );
}

TradeButton.defaultProps = {
  type: 'button',
};
