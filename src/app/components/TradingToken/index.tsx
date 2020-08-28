/**
 *
 * TradingToken
 *
 */
import React, { useEffect, useState } from 'react';
import { Asset } from '../../../types/asset';
import { LeverageSelector } from '../LeverageSelector';
import { TradingPosition } from '../../../types/trading-position';
import { TradingPositionSelector } from '../TradingPositionSelector';
import { BorrowInterestRate } from '../BorrowInterestRate';
import { BorrowAssetPrice } from '../BorrowAssetPrice';
import { BorrowLiquidationPrice } from '../BorrowLiquidationPrice';
import { TradeDialog } from '../TradeDialog';
import { useWeiAmount } from '../../hooks/useWeiAmount';

interface Props {
  asset: Asset;
}

export function TradingToken(props: Props) {
  const [leverage, setLeverage] = useState(1);
  const [position, setPosition] = useState(TradingPosition.LONG);
  const [asset, setAsset] = useState(props.asset);

  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);

  const [openTrade, setOpenTrade] = useState(false);

  useEffect(() => {
    if (position === TradingPosition.LONG) {
      setAsset(Asset.USD);
    } else {
      setAsset(Asset.BTC);
    }
  }, [position]);

  return (
    <div className="bg-secondary p-3 h-100 mr-0">
      <div className="mb-3">
        <label className="mr-4">Leverage</label>
        <LeverageSelector
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

      <BorrowAssetPrice asset={asset} />

      <BorrowLiquidationPrice
        asset={asset}
        leverage={leverage}
        position={position}
      />

      <BorrowInterestRate asset={asset} weiAmount={weiAmount} />

      <button
        className="btn btn-customTeal text-white font-weight-bold my-3 w-25"
        onClick={() => setOpenTrade(true)}
      >
        Buy
      </button>

      <TradeDialog
        loanId={'0'}
        leverage={leverage}
        position={position}
        asset={asset}
        onChangeAmount={value => setAmount(value)}
        onClose={() => setOpenTrade(false)}
        isOpen={openTrade}
      />
    </div>
  );
}
