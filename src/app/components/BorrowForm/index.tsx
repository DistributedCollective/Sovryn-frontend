/**
 *
 * BorrowForm
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Asset } from '../../../types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { Button, InputGroup, Tag } from '@blueprintjs/core';
import { useWeiAmount } from '../../../hooks/useWeiAmount';
import { SendTxProgress } from '../SendTxProgress';
import { useApproveAndTrade } from '../../../hooks/borrow/useApproveAndTrade';

interface Props {
  asset: Asset;
  position: TradingPosition;
  leverage: number;
  onChange: (weiAmount: string) => void;
}

export function BorrowForm(props: Props) {
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
      <div>Trade:</div>
      <div>
        <InputGroup
          value={amount}
          onChange={e => setAmount(e.target.value)}
          rightElement={<Tag minimal>{collateralToken}</Tag>}
        />
      </div>
      <div className="mt-3 d-flex flex-row justify-content-start align-items-center overflow-hidden">
        <Button
          className="mr-3 flex-shrink-0 flex-grow-0"
          text={`Buy`}
          type="button"
          onClick={() => trade()}
          loading={loading}
          disabled={loading}
        />
        {type !== 'none' && (
          <SendTxProgress status={status} txHash={txHash} loading={loading} />
        )}
      </div>
    </div>
  );
}

BorrowForm.defaultProps = {
  onChange: (_: string) => {},
};
