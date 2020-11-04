/**
 *
 * TradingToken
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
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
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';

interface Props {
  marketToken: Asset;
}

/**
 * @deprecated
 * @param props
 * @constructor
 */
export function TradingToken(props: Props) {
  const [position, setPosition] = useState(TradingPosition.LONG);

  const resolveLoanToken = useCallback(() => {
    if (position === TradingPosition.LONG) {
      return Asset.DOC;
    }
    return Asset.BTC;
  }, [position]);

  const [leverage, setLeverage] = useState(2);
  const [loanToken, setLoanToken] = useState(resolveLoanToken());
  const [collateral, setCollateral] = useState(
    AssetsDictionary.get(loanToken).getCollateralAssets()[0],
  );

  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);

  useEffect(() => {
    setLoanToken(resolveLoanToken());
    // eslint-disable-next-line
  }, [position]);

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
          {props.marketToken}
        </h1>
        <div
          className="d-inline h-100 float-right"
          style={{ marginTop: '10px' }}
        >
          <BorrowAssetPrice asset={props.marketToken} />
        </div>
      </div>
      <div className="bg-component-bg p-3 mb-2 mt-2">
        <div className="mb-4 mt-2">
          <TradingPositionSelector
            value={position}
            onChange={value => setPosition(value)}
          />
        </div>
        <div className="mb-2">
          <LeverageSelector
            min={2}
            max={5}
            value={leverage}
            onChange={value => setLeverage(value)}
            position={position}
          />
        </div>
        <div className="row mb-2">
          <div className="col-6">
            <BorrowLiquidationPrice
              asset={props.marketToken}
              leverage={leverage}
              position={position}
            />
          </div>
          <div className="col-6">
            <BorrowInterestRate
              asset={loanToken}
              collateral={collateral}
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
          position={position}
          asset={loanToken}
          collateral={collateral}
          onCollateralChange={value => setCollateral(value)}
          onChangeAmount={value => setAmount(value)}
        />
      </div>
    </div>
  );
}

TradingToken.defaultProps = {
  marketToken: Asset.BTC,
};
