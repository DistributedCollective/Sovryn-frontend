import { Asset } from 'types/asset';
import { useBalanceOf } from '../erc20/useBalanceOf';
import { getPoolTokenContractName } from '../../../utils/blockchain/contract-helpers';

export function usePoolTokenBalance(asset: Asset) {
  return useBalanceOf(getPoolTokenContractName(asset));
}
