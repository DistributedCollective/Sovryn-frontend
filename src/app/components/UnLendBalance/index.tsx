/**
 *
 * UnLendBalance
 *
 */
import React, { useEffect, useState } from 'react';
import { Asset } from '../../../types/asset';
import { useCacheCall } from '../../../hooks/useCacheCall';
import { getLendingContract } from '../../../utils/blockchain/assetMapper';
import { bignumber } from 'mathjs';
import { fromWei } from 'web3-utils';
import { useAccount } from '../../../hooks/useAccount';

interface Props {
  asset: Asset;
}

export function UnLendBalance(props: Props) {

  const owner = useAccount();
  const balanceCall = useCacheCall(
    getLendingContract(props.asset).contractName,
    'assetBalanceOf',
    owner,
  );

  useEffect(() => {
    if (balanceCall !== undefined) {
      setBalance(bignumber(fromWei(balanceCall)));
    }
  }, [balanceCall]);

  const [balance, setBalance] = useState(bignumber(0));

  // const balance = useb
  return <div></div>;
}
