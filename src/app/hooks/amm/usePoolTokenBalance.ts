import { Asset } from 'types/asset';
import { useBalanceOf } from '../erc20/useBalanceOf';

export function usePoolTokenBalance(asset: Asset) {
  return useBalanceOf(`${asset}_poolToken`);
}
