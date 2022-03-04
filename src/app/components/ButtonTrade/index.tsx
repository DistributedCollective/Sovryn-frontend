import React from 'react';
import classNames from 'classnames';
import { TradingPosition } from 'types/trading-position';
import { TradingTypes } from 'app/pages/SpotTradingPage/types';
import { Spinner } from '../Spinner';
import { SpinnerSizeType } from '../Spinner/types';

interface IButtonTradeProps {
  position?: TradingPosition;
  tradingType?: TradingTypes;
  text: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const ButtonTrade: React.FC<IButtonTradeProps> = ({
  tradingType,
  position,
  onClick,
  loading,
  className,
  text,
  ...props
}) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      'tw-btn-trade',
      {
        'tw-bg-trade-long':
          position === TradingPosition.LONG || tradingType === TradingTypes.BUY,
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
    <span className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-truncate">
      <span
        className={classNames(
          'tw-flex-shrink-0 tw-btn-loader__spinner tw-flex tw-flex-row tw-items-center tw-justify-start',
          {
            active: loading,
          },
        )}
      >
        <Spinner
          size={SpinnerSizeType.SMALL}
          className="tw-fill-current tw-text-white"
        />
      </span>
      <span
        className={classNames('tw-truncate tw-btn-loader__value', {
          active: loading,
        })}
      >
        {text}
      </span>
    </span>
  </button>
);
