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
import { TradeDialogNotModal } from '../../components/TradeDialogNotModal';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import btcIcon from 'assets/images/rBTC-logo.png';

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

  useEffect(() => {
    if (props.position === TradingPosition.LONG) {
      setAsset(Asset.USD);
    } else {
      setAsset(Asset.BTC);
    }
  }, [props.position]);

  return (
    <div className="h-100 mr-0 bg-background">
      <div className="bg-component-bg p-3 mb-3">
        <img
          src={btcIcon}
          alt=""
          className="d-inline"
          style={{ height: '3rem', verticalAlign: 'middle' }}
        />
        <h1 className="d-inline ml-2" style={{ verticalAlign: 'middle' }}>
          {props.asset}
        </h1>
        <div
          className="d-inline h-100 float-right"
          style={{ marginTop: '10px' }}
        >
          <BorrowAssetPrice asset={asset} />
        </div>
      </div>
      <div className="bg-component-bg p-3 mb-3">
        <div className="mb-3">
          <TradingPositionSelector
            value={props.position}
            onChange={value => props.onPositionChange(value)}
          />
        </div>
        <div className="mb-3">
          <LeverageSelector
            min={1}
            max={5}
            value={leverage}
            onChange={value => setLeverage(value)}
            position={props.position}
          />
        </div>
        <BorrowLiquidationPrice
          asset={asset}
          leverage={leverage}
          position={props.position}
        />

        <BorrowInterestRate asset={asset} weiAmount={weiAmount} />
      </div>
      <div className="bg-component-bg p-3 mb-3">
        <TradeDialogNotModal
          loanId={'0'}
          leverage={leverage}
          position={props.position}
          asset={asset}
          onChangeAmount={value => setAmount(value)}
        />
      </div>
    </div>
  );
}
