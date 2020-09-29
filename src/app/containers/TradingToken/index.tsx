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
import btcIcon from 'assets/images/rBTC-logo.png';

interface Props {
  asset: Asset;
  position: TradingPosition;
  onPositionChange: (position: TradingPosition) => void;
}

export function TradingToken(props: Props) {
  const [leverage, setLeverage] = useState(2);
  const [asset, setAsset] = useState(props.asset);

  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);

  useEffect(() => {
    if (props.position === TradingPosition.LONG) {
      setAsset(Asset.DOC);
    } else {
      setAsset(Asset.BTC);
    }
  }, [props.position]);

  return (
    <div className="mr-0 bg-background">
      <div className="bg-component-bg p-3 mb-1">
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
          <BorrowAssetPrice asset={props.asset} />
        </div>
      </div>
      <div className="bg-component-bg p-3 mb-2 mt-2">
        <div className="mb-4 mt-2">
          <TradingPositionSelector
            value={props.position}
            onChange={value => props.onPositionChange(value)}
          />
        </div>
        <div className="mb-2">
          <LeverageSelector
            min={props.position === TradingPosition.LONG ? 2 : 1}
            max={5}
            value={leverage}
            onChange={value => setLeverage(value)}
            position={props.position}
          />
        </div>
        <div className="row mb-2">
          <div className="col-6">
            <BorrowLiquidationPrice
              asset={props.asset}
              leverage={leverage}
              position={props.position}
            />
          </div>
          <div className="col-6">
            <BorrowInterestRate
              asset={props.asset}
              weiAmount={weiAmount}
              leverage={leverage}
            />
          </div>
        </div>
      </div>
      <div>
        <TradeDialog
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
