/**
 *
 * BorrowForm
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Asset } from '../../../types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { InputGroup, Tag } from '@blueprintjs/core';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { SendTxProgress } from '../SendTxProgress';
import { useApproveAndTrade } from '../../../hooks/trading/useApproveAndTrade';
import { useIsConnected } from '../../../hooks/useAccount';

interface Props {
  asset: Asset;
  position: TradingPosition;
  leverage: number;
  onChange: (weiAmount: string) => void;
}

export function BorrowForm(props: Props) {
  const isConnected = useIsConnected();

  const handleContractToken = useCallback(() => {
    if (props.position === TradingPosition.LONG) {
      return Asset.USD;
    }
    return Asset.BTC;
  }, [props.position]);

  const handleCollateralToken = useCallback(() => {
    if (props.position === TradingPosition.LONG) {
      return Asset.BTC;
    }
    return Asset.USD;
  }, [props.position]);

  const [contractToken, setContractToken] = useState(handleContractToken);
  const [collateralToken, setCollateralToken] = useState(handleCollateralToken);

  useEffect(() => {
    setCollateralToken(handleCollateralToken);
    setContractToken(handleContractToken);
  }, [handleCollateralToken, handleContractToken, props.position, props.asset]);

  const [amount, setAmount] = useState('0');
  const weiAmount = useWeiAmount(amount);

  useEffect(() => {
    props.onChange(weiAmount);
  }, [props, weiAmount]);

  const { trade, loading, txHash, status, type } = useApproveAndTrade(
    contractToken,
    collateralToken,
    props.leverage,
    weiAmount,
  );

  return (
    <div className="mb-3">
      <div className="d-inline">Trade:</div>
      <div className="d-inline float-right w-50 pl-3">
        <InputGroup
          value={amount}
          onChange={e => setAmount(e.target.value)}
          rightElement={<Tag minimal>{collateralToken}</Tag>}
        />
      </div>
      <div className="text-center w-100 mt-4">
        {/* <Button
          className="mr-3 flex-shrink-0 flex-grow-0 bg-customTeal bg-image-none text-white font-weight-bold"
          text={`Buy`}
          type="button"
          onClick={() => trade()}
          loading={loading}
          disabled={loading}
        /> */}
        <button
          className="btn btn-customTeal text-white font-weight-bold my-3 w-25"
          disabled={loading || !isConnected}
          onClick={() => trade()}
        >
          Buy
        </button>
      </div>
      <div>
        {type !== 'none' && (
          <SendTxProgress
            status={status}
            txHash={txHash}
            loading={loading}
            type={type}
          />
        )}
      </div>
    </div>
  );
}

BorrowForm.defaultProps = {
  onChange: (_: string) => {},
};
