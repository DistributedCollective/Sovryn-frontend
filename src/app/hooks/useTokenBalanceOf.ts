import { Asset } from 'types/asset';
import { getTokenContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from './useCacheCallWithValue';
import { useAccount } from './useAccount';
import { useEffect, useState } from 'react';
import { useBalance } from './useBalance';

export function useTokenBalanceOf(asset: Asset) {
  const account = useAccount();

  const [contractName, setContractName] = useState(getTokenContractName(asset));

  const btcResult = useBalance();
  const tokenResult = useCacheCallWithValue(
    contractName,
    'balanceOf',
    '0',
    account,
  );

  useEffect(() => {
    setContractName(getTokenContractName(asset));
  }, [asset]);

  return asset === Asset.BTC ? btcResult : tokenResult;
}
