/**
 *
 * TradeDialog
 *
 */
import React, { useEffect, useState } from 'react';
import { Asset } from 'types/asset';
import { Dialog, InputGroup } from '@blueprintjs/core';
import { BorrowInterestRate } from '../BorrowInterestRate';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { FormSelect, SelectItem } from '../FormSelect';
import { useTokenBalanceOf } from '../../../hooks/useTokenBalanceOf';
import { AssetWalletBalance } from '../AssetWalletBalance';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { TradingPosition } from '../../../types/trading-position';
import { useApproveAndTrade } from '../../../hooks/trading/useApproveAndTrade';
import { SendTxProgress } from '../SendTxProgress';
import { useIsConnected } from '../../../hooks/useAccount';

interface Props {
  asset: Asset;
  loanId: string;
  leverage: number;
  position: TradingPosition;
  isOpen: boolean;
  onClose: () => void;
  onChangeAmount: (value) => void;
}

export function TradeDialog(props: Props) {
  const assetDetails = AssetsDictionary.get(props.asset);
  const isConnected = useIsConnected();

  const handleCloseClick = (e: any) => {
    if (e && e.preventDefault) e.preventDefault();
    props.onClose();
  };

  const handleAmountChange = (e: any) => {
    setAmount(e.currentTarget.value);
    props.onChangeAmount(e.currentTarget.value);
  };

  const [selected, setSelected] = useState<Asset>(props.asset);

  const { value: tokenBalance } = useTokenBalanceOf(selected);

  const [amount, setAmount] = useState(tokenBalance);
  const [colaratedAssets, setColaratedAssets] = useState<Array<SelectItem>>([]);

  useEffect(() => {
    setAmount(weiTo4(tokenBalance));
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

  const weiAmount = useWeiAmount(amount);

  const { trade, loading, txHash, status, type } = useApproveAndTrade(
    props.asset,
    selected,
    props.leverage,
    weiAmount,
  );

  return (
    <Dialog
      isOpen={props.isOpen}
      onClose={props.onClose}
      autoFocus={true}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
      className="bg-secondary py-3"
    >
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
          <button className="btn btn-link ml-3 mt-0" onClick={handleCloseClick}>
            Cancel
          </button>
          <button
            className="btn btn-primary ml-3 mt-0"
            disabled={loading || !isConnected}
            onClick={() => trade()}
          >
            Leverage {props.asset}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

TradeDialog.defaultProps = {
  leverage: 1,
  position: TradingPosition.LONG,
  isOpen: true,
  onClose: () => {},
  onChangeAmount: _ => {},
};
