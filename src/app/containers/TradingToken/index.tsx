/**
 *
 * TradingToken
 *
 */
import React, { useEffect, useState } from 'react';
import { Asset } from '../../../types/asset';
import { LeverageSelector } from '../../components/LeverageSelector';
import { TradingPosition } from '../../../types/trading-position';
import { TradingPositionSelector } from '../../components/TradingPositionSelector';
import { BorrowInterestRate } from '../../components/BorrowInterestRate';
import { BorrowAssetPrice } from '../../components/BorrowAssetPrice';
import { BorrowLiquidationPrice } from '../../components/BorrowLiquidationPrice';
import { TradeDialog } from '../../components/TradeDialog';
import { useWeiAmount } from '../../hooks/useWeiAmount';

interface Props {
  asset: Asset;
  position: TradingPosition;
  onPositionChange: (position: TradingPosition) => void;
}

export function TradingToken(props: Props) {
  const [leverage, setLeverage] = useState(1);
  const [asset, setAsset] = useState(props.asset);

  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);

  const [openTrade, setOpenTrade] = useState(false);

  useEffect(() => {
    if (props.position === TradingPosition.LONG) {
      setAsset(Asset.USD);
    } else {
      setAsset(Asset.BTC);
    }
  }, [props.position]);

  const color = props.position === 'LONG' ? 'customTeal' : 'customOrange';

  return (
    <div className="bg-secondary p-3 h-100 mr-0">
      <div className="mb-3">
        <label className="mr-4">Leverage</label>
        <LeverageSelector
          min={1}
          max={5}
          value={leverage}
          onChange={value => setLeverage(value)}
          position={props.position}
        />
      </div>

      <div className="mb-3">
        <label className="mr-4">Position</label>
        <TradingPositionSelector
          value={props.position}
          onChange={value => props.onPositionChange(value)}
        />
      </div>

      <BorrowAssetPrice asset={asset} />

      <BorrowLiquidationPrice
        asset={asset}
        leverage={leverage}
        position={props.position}
      />

      <BorrowInterestRate asset={asset} weiAmount={weiAmount} />

      <button
        className={`btn btn-${color} text-white font-weight-bold my-3 w-25`}
        onClick={() => setOpenTrade(true)}
      >
        Buy
      </button>

      <TradeDialog
        loanId={'0'}
        leverage={leverage}
        position={props.position}
        asset={asset}
        onChangeAmount={value => setAmount(value)}
        onClose={() => setOpenTrade(false)}
        isOpen={openTrade}
      />
    </div>
  );
}
