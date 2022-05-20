import { Asset } from 'types/asset';
import { getTokenContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from './useCacheCallWithValue';
import { useAccount } from './useAccount';
import { useEffect, useState } from 'react';
import { useBalance } from './useBalance';
import { useIsMounted } from './useIsMounted';

/**
 * Returns balance of an asset
 * BTC is actual rBTC and not a token.
 * @param asset
 */
export function useAssetBalanceOf(asset: Asset) {
  const account = useAccount();
  const isMounted = useIsMounted();

  const [contractName, setContractName] = useState(getTokenContractName(asset));

  const btcResult = useBalance();
  const tokenResult = useCacheCallWithValue(
    contractName,
    'balanceOf',
    '0',
    account,
  );

  useEffect(() => {
    if (isMounted()) {
      setContractName(getTokenContractName(asset));
    }
  }, [asset, isMounted]);

  return asset === Asset.RBTC ? btcResult : tokenResult;
}
