/**
 *
 * TradeDialog
 *
 */
import React, { useEffect, useState } from 'react';
import { Asset } from 'types/asset';
import { InputGroup } from '@blueprintjs/core';
import { BorrowInterestRate } from '../BorrowInterestRate';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { FormSelect, SelectItem } from '../FormSelect';
import { useTokenBalanceOf } from '../../hooks/useTokenBalanceOf';
import { AssetWalletBalance } from '../AssetWalletBalance';
import { weiTo18 } from '../../../utils/blockchain/math-helpers';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { TradingPosition } from '../../../types/trading-position';
import { useApproveAndTrade } from '../../hooks/trading/useApproveAndTrade';
import { SendTxProgress } from '../SendTxProgress';
import { useIsConnected } from '../../hooks/useAccount';
import { useIsAmountWithinLimits } from '../../hooks/useIsAmountWithinLimits';

interface Props {
  asset: Asset;
  loanId: string;
  leverage: number;
  position: TradingPosition;
  onChangeAmount: (value) => void;
}

export function TradeDialog(props: Props) {
  const assetDetails = AssetsDictionary.get(props.asset);
  const isConnected = useIsConnected();

  const handleAmountChange = (e: any) => {
    setAmount(e.currentTarget.value);
    props.onChangeAmount(e.currentTarget.value);
  };

  const [selected, setSelected] = useState<Asset>(props.asset);

  const { value: tokenBalance } = useTokenBalanceOf(selected);

  const [amount, setAmount] = useState(tokenBalance);
  const [colaratedAssets, setColaratedAssets] = useState<Array<SelectItem>>([]);

  useEffect(() => {
    setAmount(weiTo18(tokenBalance));
  }, [tokenBalance]);

  useEffect(() => {
    // Filter and set available colarated assets.
    setColaratedAssets(
      AssetsDictionary.list().map(item => ({
        key: item.asset,
        label: item.symbol,
      })),
    );
  }, [props.asset]);

  useEffect(() => {
    if (props.position === TradingPosition.LONG) {
      setSelected(Asset.BTC);
    } else {
      setSelected(Asset.USD);
    }
  }, [props.position]);

  const weiAmount = useWeiAmount(amount);

  const { trade, loading, txHash, status, type } = useApproveAndTrade(
    props.asset,
    selected,
    props.leverage,
    weiAmount,
  );

  const valid = useIsAmountWithinLimits(weiAmount, '1', tokenBalance);

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-center justify-content-center">
        <img
          className="mb-3"
          src={assetDetails.logoSvg}
          alt={props.asset}
          style={{ height: '5rem' }}
        />
      </div>

      <div className="d-flex flex-row justify-content-between">
        <div className="flex-grow-1 mr-3">
          <InputGroup
            className="mb-3"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        <div>
          <FormSelect
            filterable={false}
            items={colaratedAssets}
            onChange={item => setSelected(item.key)}
            value={selected}
          />
        </div>
      </div>

      <BorrowInterestRate asset={props.asset} weiAmount={weiAmount} />

      <AssetWalletBalance asset={selected} />

      <div className="mb-4">
        <div className="d-inline text-lightGrey">Leverage</div>
        <div className="d-inline float-right">{props.leverage}x</div>
      </div>

      {type !== 'none' && (
        <div className="mb-4">
          <SendTxProgress
            status={status}
            txHash={txHash}
            loading={loading}
            type={type}
          />
        </div>
      )}

      <div className="d-flex flex-row justify-content-end align-items-center">
        <button
          className="btn btn-primary ml-3 mt-0"
          disabled={loading || !isConnected || !valid}
          onClick={() => trade()}
        >
          Leverage {props.asset}
        </button>
      </div>
    </div>
  );
}

TradeDialog.defaultProps = {
  leverage: 1,
  position: TradingPosition.LONG,
  isOpen: true,
  onClose: () => {},
  onChangeAmount: _ => {},
};
