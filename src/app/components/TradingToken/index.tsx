/**
 *
 * TradingToken
 *
 */
import React, { useState } from 'react';
import { Asset } from '../../../types/asset';
import { LeverageSelector } from '../LeverageSelector';
import { TradingPosition } from '../../../types/trading-position';
import { TradingPositionSelector } from '../TradingPositionSelector';
import { BorrowInterestRate } from '../BorrowInterestRate';
import { BorrowAssetPrice } from '../BorrowAssetPrice';
import { BorrowLiquidationPrice } from '../BorrowLiquidationPrice';
import { BorrowForm } from '../BorrowForm';

interface Props {
  asset: Asset;
}

export function TradingToken(props: Props) {
  const [leverage, setLeverage] = useState(1);
  const [position, setPosition] = useState(TradingPosition.LONG);

  const [amount, setAmount] = useState('0');

  return (
    <div className="border shadow p-3 h-100">
      <div className="mb-3">
        <label className="mr-4">Leverage</label>
        <LeverageSelector
          // min={position === TradingPosition.LONG ? 2 : 1}
          min={1}
          max={5}
          value={leverage}
          onChange={value => setLeverage(value)}
        />
      </div>

      <div className="mb-3">
        <label className="mr-4">Position</label>
        <TradingPositionSelector
          value={position}
          onChange={value => setPosition(value)}
        />
      </div>

      <BorrowAssetPrice asset={props.asset} />

      <BorrowLiquidationPrice
        asset={props.asset}
        leverage={leverage}
        position={position}
      />

      <BorrowInterestRate asset={props.asset} weiAmount={amount} />

      <BorrowForm
        asset={props.asset}
        position={position}
        leverage={leverage}
        onChange={value => setAmount(value)}
      />
    </div>
  );
}
