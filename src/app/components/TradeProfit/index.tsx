import React from 'react';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLongArrowAltDown,
  faLongArrowAltUp,
} from '@fortawesome/free-solid-svg-icons';
import { bignumber } from 'mathjs';
import { TradingPosition } from '../../../types/trading-position';

interface Props {
  entryPrice: string;
  closePrice: string;
  profit: string;
  position: TradingPosition;
}

export function TradeProfit(props: Props) {
  let change = bignumber(bignumber(props.closePrice).minus(props.entryPrice))
    .div(props.closePrice)
    .mul(100)
    .toFixed(4);
  if (props.position === TradingPosition.SHORT) {
    change = bignumber(bignumber(props.entryPrice).minus(props.closePrice))
      .div(props.entryPrice)
      .mul(100)
      .toFixed(4);
  }
  return (
    <>
      <div className="tw-inline">{`$ ${parseFloat(
        weiTo4(props.profit),
      ).toLocaleString('en')}`}</div>
      <div
        className="tw-inline tw-ml-2 tw-mr-2"
        style={{
          fontSize: '12px',
          color: Number(change) > 0 ? 'Green' : 'Red',
        }}
      >
        <div className="tw-inline">
          <FontAwesomeIcon
            icon={Number(change) > 0 ? faLongArrowAltUp : faLongArrowAltDown}
          />
          {` ${change} %`}
        </div>
      </div>
    </>
  );
}
