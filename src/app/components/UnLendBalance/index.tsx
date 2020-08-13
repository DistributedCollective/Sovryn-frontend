/**
 *
 * UnLendBalance
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Asset } from '../../../types/asset';
import { useCacheCall } from '../../../hooks/useCacheCall';
import { getLendingContractName } from '../../../utils/blockchain/contract-helpers';
import { bignumber } from 'mathjs';
import { fromWei } from 'web3-utils';
import { useAccount } from '../../../hooks/useAccount';
import { Button, Tooltip } from '@blueprintjs/core';
import { SendTxProgress } from '../SendTxProgress';
import { useUnLendTokens } from '../../../hooks/useUnLendTokens';

interface Props {
  asset: Asset;
}

export function UnLendBalance(props: Props) {
  const owner = useAccount();
  const balanceCall = useCacheCall(
    getLendingContractName(props.asset),
    'assetBalanceOf',
    owner,
  );

  useEffect(() => {
    if (balanceCall !== undefined) {
      setBalance(bignumber(fromWei(balanceCall)));
    }
  }, [balanceCall]);

  const [balance, setBalance] = useState(bignumber(0));

  const { unLend, loading, txHash, status } = useUnLendTokens(props.asset);

  const handleUnLendClick = useCallback(() => {
    unLend(balanceCall);
  }, [unLend, balanceCall]);

  return (
    <div className="mt-3 d-flex flex-row justify-content-start align-items-center overflow-hidden">
      <Tooltip content={`Withdraw all lended balance`}>
        <Button
          className="mr-3 flex-shrink-0 flex-grow-0"
          onClick={handleUnLendClick}
          text={`UnLend ${props.asset}`}
          type="button"
          loading={loading}
          disabled={loading && balance.greaterThan(0)}
        />
      </Tooltip>
      <SendTxProgress status={status} txHash={txHash} loading={loading} />
    </div>
  );
}
