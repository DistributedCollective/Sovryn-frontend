/**
 *
 * TradeDialog
 *
 */
import React, { useEffect, useState } from 'react';
import { Asset } from 'types/asset';
import { InputGroup } from '@blueprintjs/core';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { FormSelect, SelectItem } from '../FormSelect';
import { useTokenBalanceOf } from '../../hooks/useTokenBalanceOf';
import { AssetWalletBalance } from '../AssetWalletBalance';
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

export function TradeDialogNotModal(props: Props) {
  const isConnected = useIsConnected();

  const handleAmountChange = (e: any) => {
    //Check that input is a positive number before changing state
    if (e.target.value && e.target.value >= 0) {
      setAmount(e.currentTarget.value);
      props.onChangeAmount(e.currentTarget.value);
    }
  };

  const [selected, setSelected] = useState<Asset>(props.asset);

  const { value: tokenBalance } = useTokenBalanceOf(selected);

  const [amount, setAmount] = useState('');
  const [colaratedAssets, setColaratedAssets] = useState<Array<SelectItem>>([]);

  // useEffect(() => {
  //   setAmount(weiTo18(tokenBalance));
  // }, [tokenBalance]);

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
  const color = props.position === 'LONG' ? 'customTeal' : 'customOrange';

  return (
    <div className="mt-5 border-white">
      <div className="row text-center mb-3" />

      <AssetWalletBalance asset={selected} />

      <div className="mb-4">
        <div className="d-inline text-lightGrey">Leverage</div>
        <div className="d-inline float-right">
          {props.leverage}x {props.position}
        </div>
      </div>

      <div className="d-flex flex-row justify-content-between">
        <div className="flex-grow-1 mr-3">
          <InputGroup
            className="mb-0"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter trade amount"
          />
          {parseFloat(amount) > 0 && !loading && !valid && (
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
              Trade amount exceeds balance
            </div>
          )}
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

      <div className="d-flex flex-row justify-content-end align-items-center mt-3">
        <button
          className={`btn btn-${color} text-white font-weight-bold my-3 w-50`}
          disabled={loading || !isConnected || !valid}
          onClick={() => trade()}
        >
          Trade BTC
        </button>
      </div>
    </div>
  );
}

TradeDialogNotModal.defaultProps = {
  leverage: 1,
  position: TradingPosition.LONG,
  onChangeAmount: _ => {},
};
