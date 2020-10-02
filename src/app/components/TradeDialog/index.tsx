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
import { useCheckLiquidity } from '../../hooks/trading/useCheckLiquidity';
import { handleNumberInput } from '../../../utils/helpers';

interface Props {
  asset: Asset;
  loanId: string;
  leverage: number;
  position: TradingPosition;
  onChangeAmount: (value) => void;
}

export function TradeDialog(props: Props) {
  const isConnected = useIsConnected();

  const handleAmountChange = (e: any) => {
    const value = handleNumberInput(e, true);
    setAmount(value);
    props.onChangeAmount(value);
  };

  const [selected, setSelected] = useState<Asset>(props.asset);

  const { value: tokenBalance } = useTokenBalanceOf(selected);

  const [amount, setAmount] = useState('');
  const [colaratedAssets, setColaratedAssets] = useState<Array<SelectItem>>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sufficient, liquidity } = useCheckLiquidity(
    amount,
    props.leverage,
    props.position,
  );

  useEffect(() => {
    // Filter and set available colarated assets.
    const collateral = AssetsDictionary.get(props.asset)
      .getCollateralAssets()
      .map(item => AssetsDictionary.get(item))
      .map(item => ({
        key: item.asset,
        label: item.symbol,
      }));
    setColaratedAssets(collateral);
  }, [props.asset]);

  useEffect(() => {
    if (
      colaratedAssets.length &&
      !colaratedAssets.find(item => item.key === selected)
    ) {
      setSelected(colaratedAssets[0].key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.position, colaratedAssets]);

  const weiAmount = useWeiAmount(amount);

  const { trade, loading, txHash, status, type } = useApproveAndTrade(
    props.asset,
    selected,
    props.leverage,
    weiAmount,
  );

  const valid = useIsAmountWithinLimits(weiAmount, '1', tokenBalance);
  const color = props.position === 'LONG' ? 'customTeal' : 'Gold';

  return (
    <div className="position-relative h-100 w-100">
      <div className="bg-component-bg p-3">
        <div className="row">
          <div className="col-4">
            <div className="data-label text-MediumGrey">Currency</div>
            <div className="data-container bordered">
              <FormSelect
                filterable={false}
                items={colaratedAssets}
                onChange={item => setSelected(item.key)}
                value={selected}
              />
            </div>
          </div>
          <div className="col-8">
            <div className="data-label text-MediumGrey">Amount</div>
            <InputGroup
              className="data-container bordered"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter trade amount"
            />
            {parseFloat(amount) > 0 && !loading && !valid && (
              <div className="font-xs text-white">Amount exceeds balance</div>
            )}
          </div>
        </div>

        <div className="row mt-2 mb-2">
          <div className="col-6">
            <AssetWalletBalance asset={selected} />
          </div>
          <div className="col-6">
            <button
              className={`btn btn-${color} text-white my-3 w-100 p-2 rounded`}
              disabled={loading || !isConnected || !valid}
              onClick={() => trade()}
            >
              Place Trade
            </button>
          </div>
        </div>
      </div>

      <div>
        <SendTxProgress
          status={status}
          txHash={txHash}
          loading={loading}
          type={type}
          position={props.position}
        />
      </div>
    </div>
  );
}

TradeDialog.defaultProps = {
  leverage: 1,
  position: TradingPosition.LONG,
  onChangeAmount: _ => {},
};
